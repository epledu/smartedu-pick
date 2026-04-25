/**
 * GET /api/calendar?year=2026&month=4
 *
 * Returns aggregated daily transactions for the specified month.
 * Response shape:
 * {
 *   days: { "2026-04-05": { income, expense, count } },
 *   monthTotal: { income, expense }
 * }
 */
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string; name?: string | null; email?: string | null };

const TX_TYPE = { INCOME: "INCOME", EXPENSE: "EXPENSE" } as const;

// ---------------------------------------------------------------------------
// GET /api/calendar
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  // Validate query params
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
  const month = monthParam ? parseInt(monthParam, 10) : new Date().getMonth() + 1;

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }

  // Build month range using date-fns
  const refDate = new Date(year, month - 1, 1);
  const rangeStart = startOfMonth(refDate);
  const rangeEnd = endOfMonth(refDate);

  try {
    // Fetch all INCOME and EXPENSE transactions in the month range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: { in: [TX_TYPE.INCOME, TX_TYPE.EXPENSE] },
        date: { gte: rangeStart, lte: rangeEnd },
      },
      select: { date: true, type: true, amount: true },
      orderBy: { date: "asc" },
    });

    // Aggregate by day key "YYYY-MM-DD"
    const days: Record<string, { income: number; expense: number; count: number }> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
      // Format date to local YYYY-MM-DD (avoid UTC offset shift)
      const d = tx.date;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      if (!days[key]) {
        days[key] = { income: 0, expense: 0, count: 0 };
      }

      const amt = Number(tx.amount);
      if (tx.type === TX_TYPE.INCOME) {
        days[key].income += amt;
        totalIncome += amt;
      } else {
        days[key].expense += amt;
        totalExpense += amt;
      }
      days[key].count += 1;
    }

    return NextResponse.json({
      days,
      monthTotal: { income: totalIncome, expense: totalExpense },
    });
  } catch (err) {
    console.error("[GET /api/calendar]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
