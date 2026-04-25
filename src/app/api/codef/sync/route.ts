/**
 * POST /api/codef/sync
 *
 * Fetches real transaction data from CODEF for a connected account
 * and imports new records into the database.
 *
 * Duplicate detection: (amount + date-day + merchant/description) composite key.
 * Auto-categorisation: classifyByBuiltin from category-classifier.ts.
 * Balance update: replaced with the latest resAfterTranBalance for bank accounts.
 *
 * Body: { accountId: string }
 * Response: { imported: number; skipped: number; errors: string[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { fetchCardApprovals, fetchBankTransactions } from "@/lib/wallet/codef/client";
import { classifyByBuiltin } from "@/lib/wallet/category-classifier";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a Date to YYYYMMDD string as required by CODEF. */
function toCodefDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

/** Parse a YYYYMMDD string into a Date (UTC midnight). */
function fromCodefDate(s: string): Date {
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6)) - 1;
  const d = Number(s.slice(6, 8));
  return new Date(Date.UTC(y, m, d));
}

/** Find or create a category by name for the user, returning its id. */
async function resolveCategory(userId: string, categoryName: string): Promise<string> {
  const existing = await prisma.category.findFirst({ where: { userId, name: categoryName } });
  if (existing) return existing.id;

  const fallback = await prisma.category.findFirst({ where: { isDefault: true, name: categoryName } });
  if (fallback) return fallback.id;

  const created = await prisma.category.create({
    data: { userId, name: categoryName, icon: null, color: null },
  });
  return created.id;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { accountId?: string };
  try {
    body = (await req.json()) as { accountId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { accountId } = body;
  if (!accountId) {
    return NextResponse.json({ error: "accountId is required" }, { status: 400 });
  }

  // Load account and verify ownership.
  // The CODEF fields exist in the DB schema but Prisma client is stale —
  // cast to include them. Re-run `npx prisma generate` after restarting the dev server.
  interface AccountWithCodef {
    id: string;
    userId: string;
    name: string;
    type: string;
    balance: unknown;
    currency: string;
    color: string | null;
    icon: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    codefConnectedId: string | null;
    codefOrgCode: string | null;
    codefAccountNum: string | null;
    lastSyncedAt: Date | null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const account = (await prisma.account.findFirst({ where: { id: accountId, userId } })) as any as AccountWithCodef | null;
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }
  if (!account.codefConnectedId || !account.codefOrgCode) {
    return NextResponse.json({ error: "Account is not linked to CODEF" }, { status: 422 });
  }

  // Sync the last 30 days
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);

  const startStr = toCodefDate(startDate);
  const endStr = toCodefDate(endDate);

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Build existing-transaction fingerprints for dedup
  const existing = await prisma.transaction.findMany({
    where: { accountId, userId, date: { gte: startDate } },
    select: { amount: true, date: true, merchantName: true, memo: true },
  });

  const existingKeys = new Set(
    existing.map((t) => {
      const day = t.date.toISOString().slice(0, 10);
      const label = t.merchantName ?? t.memo ?? "";
      return `${day}::${String(t.amount)}::${label}`;
    }),
  );

  // ----- Card sync -------------------------------------------------------
  if (account.type === "CARD") {
    try {
      const approvals = await fetchCardApprovals({
        connectedId: account.codefConnectedId,
        organization: account.codefOrgCode,
        startDate: startStr,
        endDate: endStr,
      });

      for (const row of approvals) {
        const amount = Number(row.resApprovalAmount);
        if (isNaN(amount) || amount <= 0) continue;

        const txDate = fromCodefDate(row.resApprovalDate);
        const merchant = row.resMemberStoreName ?? "";
        const key = `${txDate.toISOString().slice(0, 10)}::${amount}::${merchant}`;

        if (existingKeys.has(key)) { skipped++; continue; }
        existingKeys.add(key);

        const classified = classifyByBuiltin(merchant);
        const categoryName = classified?.categoryName ?? "기타";
        const categoryId = await resolveCategory(userId, categoryName);

        await prisma.transaction.create({
          data: {
            userId,
            accountId,
            categoryId,
            type: "EXPENSE",
            amount,
            date: txDate,
            merchantName: merchant || null,
            memo: null,
          },
        });
        imported++;
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Card sync failed");
    }
  }

  // ----- Bank sync -------------------------------------------------------
  if (account.type === "BANK" && account.codefAccountNum) {
    try {
      const txList = await fetchBankTransactions({
        connectedId: account.codefConnectedId,
        organization: account.codefOrgCode,
        account: account.codefAccountNum,
        startDate: startStr,
        endDate: endStr,
      });

      let latestBalance: number | null = null;

      for (const row of txList) {
        const inAmt = Number(row.resAccountIn);
        const outAmt = Number(row.resAccountOut);
        const amount = outAmt > 0 ? outAmt : inAmt;
        const type = outAmt > 0 ? "EXPENSE" : "INCOME";
        const desc = row.resAccountDesc1 ?? "";

        if (isNaN(amount) || amount <= 0) continue;

        const txDate = fromCodefDate(row.resAccountTrDate);
        const key = `${txDate.toISOString().slice(0, 10)}::${amount}::${desc}`;

        if (existingKeys.has(key)) { skipped++; continue; }
        existingKeys.add(key);

        const classified = classifyByBuiltin(desc);
        const categoryName = classified?.categoryName ?? (type === "INCOME" ? "수입" : "기타");
        const categoryId = await resolveCategory(userId, categoryName);

        await prisma.transaction.create({
          data: { userId, accountId, categoryId, type, amount, date: txDate, memo: desc || null },
        });
        imported++;

        // Track balance from last row
        if (row.resAfterTranBalance) {
          latestBalance = Number(row.resAfterTranBalance);
        }
      }

      // Update account balance with latest value from CODEF
      if (latestBalance !== null && !isNaN(latestBalance)) {
        await prisma.account.update({ where: { id: accountId }, data: { balance: latestBalance } });
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Bank sync failed");
    }
  }

  // Update lastSyncedAt regardless of partial errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma.account.update as any)({
    where: { id: accountId },
    data: { lastSyncedAt: new Date() },
  });

  return NextResponse.json({ imported, skipped, errors });
}
