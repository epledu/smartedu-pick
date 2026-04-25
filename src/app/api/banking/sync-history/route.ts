/**
 * GET /api/banking/sync-history?accountId=
 *
 * Returns a lightweight sync history derived from the transaction log.
 * Each "sync event" is represented as the most-recent batch of transactions
 * created within the same second (which is how the sync endpoint writes them).
 *
 * Since we have no dedicated SyncLog table we approximate history by grouping
 * transactions created in the same minute-window per account.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

type SessionUser = { id: string; name?: string | null; email?: string | null };

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ error: "accountId is required" }, { status: 400 });
  }

  // Verify ownership
  const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  try {
    // Fetch the 200 most-recently created transactions for grouping
    const transactions = await prisma.transaction.findMany({
      where: { accountId, userId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, createdAt: true, amount: true, merchantName: true },
    });

    if (transactions.length === 0) {
      return NextResponse.json({ history: [] });
    }

    // Group by minute-window of createdAt to approximate sync batches
    const groups: Map<string, typeof transactions> = new Map();
    for (const tx of transactions) {
      const minuteKey = tx.createdAt.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
      if (!groups.has(minuteKey)) groups.set(minuteKey, []);
      groups.get(minuteKey)!.push(tx);
    }

    const history = Array.from(groups.entries())
      .slice(0, 10) // Return last 10 sync events
      .map(([timeKey, txs]) => ({
        syncedAt: new Date(timeKey + ":00Z").toISOString(),
        count: txs.length,
        totalAmount: txs.reduce((s, t) => s + Number(t.amount), 0),
      }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error("[GET /api/banking/sync-history]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
