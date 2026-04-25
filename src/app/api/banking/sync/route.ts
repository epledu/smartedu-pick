/**
 * POST /api/banking/sync
 *
 * Generates mock bank transactions for a connected account, auto-categorises
 * them, and persists them as Transaction records. Duplicate detection is done
 * by matching (merchantName + amount + date-truncated-to-day).
 *
 * Body: { accountId: string; daysBack?: number }
 * Response: { imported: number; skipped: number; newTransactions: Transaction[] }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { generateMockTransactions, categorizeMerchant } from "@/lib/wallet/bank-mock";

type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Truncates a Date to midnight (UTC) for day-level dedup. */
function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Find or create a category by name for the user.
 * Returns the category id.
 */
async function resolveCategory(userId: string, name: string): Promise<string> {
  const existing = await prisma.category.findFirst({ where: { userId, name } });
  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: { userId, name, icon: null, color: null },
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

  let body: { accountId?: string; daysBack?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { accountId, daysBack = 30 } = body;

  if (!accountId) {
    return NextResponse.json({ error: "accountId is required" }, { status: 400 });
  }

  // Verify the account belongs to this user
  const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Simulate network latency (2-3 seconds) — mock only
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

  const mockTxs = generateMockTransactions(accountId, daysBack);

  // Build a set of existing (merchantName+amount+day) keys to detect duplicates
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  const existingTxs = await prisma.transaction.findMany({
    where: { accountId, userId, date: { gte: startDate } },
    select: { merchantName: true, amount: true, date: true },
  });

  const existingKeysArr = existingTxs.map(
    (t) => `${t.merchantName}|${t.amount}|${dayKey(t.date)}`
  );
  const existingKeys = new Set<string>(existingKeysArr);

  // Separate new from duplicate transactions
  const toImport = mockTxs.filter(
    (t) => !existingKeys.has(`${t.merchantName}|${t.amount}|${dayKey(t.date)}`)
  );
  const skipped = mockTxs.length - toImport.length;

  // Resolve category ids up-front (batch, avoid N+1)
  const uniqueCategories = Array.from(new Set<string>(toImport.map((t) => t.category)));
  const categoryMap: Record<string, string> = {};
  for (const cat of uniqueCategories) {
    categoryMap[cat] = await resolveCategory(userId, cat);
  }

  // Persist new transactions
  const created = await Promise.all(
    toImport.map((t) =>
      prisma.transaction.create({
        data: {
          userId,
          accountId,
          categoryId: categoryMap[t.category],
          type: "EXPENSE",
          amount: t.amount,
          date: t.date,
          memo: t.memo,
          merchantName: t.merchantName,
        },
        include: {
          category: { select: { id: true, name: true, icon: true, color: true } },
          account: { select: { id: true, name: true, type: true } },
        },
      })
    )
  );

  // Auto-categorise label for the response (already done above, kept for API clarity)
  const annotated = created.map((tx) => ({
    ...tx,
    autoCategory: categorizeMerchant(tx.merchantName ?? ""),
  }));

  return NextResponse.json({
    imported: created.length,
    skipped,
    newTransactions: annotated,
  });
}
