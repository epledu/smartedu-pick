/**
 * GET /api/kpass
 *
 * Returns the current month's K-Pass status plus 6-month history.
 *
 * Query params:
 *   year  - number (default: current year)
 *   month - number 1-12 (default: current month)
 *   userType - "regular" | "youth" | "low_income" (default: "regular")
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";
import {
  calculateKPassRefund,
  getMonthlyKPassStatus,
  projectYearlyKPass,
  type KPassUserType,
} from "@/lib/wallet/kpass";
import { K_PASS_REFUND_RATES } from "@/lib/wallet/constants";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the N months prior to (year, month), inclusive of the target month. */
function getPastMonths(year: number, month: number, count: number) {
  const months: Array<{ year: number; month: number }> = [];
  let y = year;
  let m = month;
  for (let i = 0; i < count; i++) {
    months.unshift({ year: y, month: m });
    m -= 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
  }
  return months;
}

/** Returns the first and last day of a calendar month as Date objects. */
function monthBounds(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getFullYear());
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);
  const rawUserType = searchParams.get("userType") ?? "regular";
  const userType: KPassUserType =
    rawUserType === "youth" || rawUserType === "low_income" ? rawUserType : "regular";

  try {
    // Fetch 6 months of transport transactions at once to minimise DB roundtrips
    const pastMonths = getPastMonths(year, month, 6);
    const oldest = pastMonths[0];
    const { start: rangeStart } = monthBounds(oldest.year, oldest.month);
    const { end: rangeEnd } = monthBounds(year, month);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: rangeStart, lte: rangeEnd },
        category: { name: "교통" },
      },
      select: {
        amount: true,
        date: true,
        category: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    });

    // Map Prisma Decimal → number
    const txList = transactions.map((tx) => ({
      amount: Number(tx.amount),
      date: tx.date,
      category: tx.category,
    }));

    // Current month status
    const currentMonthStatus = getMonthlyKPassStatus(txList, userType, year, month);

    // Build 6-month history (exclude current month from history list)
    const history = pastMonths.slice(0, 5).map(({ year: y, month: m }) => {
      const result = calculateKPassRefund(txList, userType, y, m);
      return { year: y, month: m, refundAmount: result.refundAmount, uses: result.eligibleUses };
    });

    // Yearly projection based on past 6 months
    const monthlyAverages = pastMonths.map(({ year: y, month: m }) => {
      const r = calculateKPassRefund(txList, userType, y, m);
      return { uses: r.eligibleUses, totalSpent: r.totalSpent };
    });
    const yearlyProjection = projectYearlyKPass(monthlyAverages, userType);

    return NextResponse.json({
      currentMonth: {
        year,
        month,
        uses: currentMonthStatus.eligibleUses,
        eligibleUses: currentMonthStatus.eligibleUses,
        totalSpent: currentMonthStatus.totalSpent,
        refundAmount: currentMonthStatus.refundAmount,
        isEligible: currentMonthStatus.isEligible,
        remaining: currentMonthStatus.remaining,
        progress: currentMonthStatus.progress,
      },
      settings: { userType, refundRate: K_PASS_REFUND_RATES[userType] },
      history,
      yearlyProjection,
    });
  } catch (err) {
    console.error("[GET /api/kpass]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
