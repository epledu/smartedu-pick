/**
 * GET /api/statistics
 *
 * Query params:
 *   period = "month" | "year"
 *   year   = number (e.g. 2026)
 *   month  = number (1-12, required when period=month)
 *
 * Returns aggregated stats: category breakdown, account breakdown,
 * daily trend, summary, and month-over-month comparison.
 */
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, format } from "date-fns";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns [start, end) Date range for the given params. */
function getDateRange(period: string, year: number, month: number): { start: Date; end: Date } {
  if (period === "year") {
    return { start: startOfYear(new Date(year, 0, 1)), end: endOfYear(new Date(year, 0, 1)) };
  }
  const ref = new Date(year, month - 1, 1);
  return { start: startOfMonth(ref), end: endOfMonth(ref) };
}

/** Days in month range as "yyyy-MM-dd" strings. */
function buildDailyKeys(start: Date, end: Date): string[] {
  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const period = searchParams.get("period") ?? "month";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(searchParams.get("month") ?? new Date().getMonth() + 1);

  const { start, end } = getDateRange(period, year, month);

  // Date range for previous month (used in month-over-month)
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const { start: prevStart, end: prevEnd } = getDateRange("month", prevYear, prevMonth);

  try {
    // Fetch all transactions in range
    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: {
        category: { select: { id: true, name: true, color: true } },
        account: { select: { id: true, name: true, color: true } },
      },
    });

    // Previous month expense total for month-over-month
    const prevTransactions = await prisma.transaction.findMany({
      where: { userId, type: "EXPENSE", date: { gte: prevStart, lte: prevEnd } },
      select: { amount: true },
    });

    // ── Summary ────────────────────────────────────────────────────────────
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
      const amt = Number(tx.amount);
      if (tx.type === "INCOME") totalIncome += amt;
      else if (tx.type === "EXPENSE") totalExpense += amt;
    }

    const daysInRange = buildDailyKeys(start, end).length;
    const avgDailyExpense = daysInRange > 0 ? Math.round(totalExpense / daysInRange) : 0;

    const summary = {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      transactionCount: transactions.length,
      avgDailyExpense,
    };

    // ── Category breakdown (EXPENSE only) ──────────────────────────────────
    const catMap = new Map<string, { name: string; color: string | null; total: number; count: number }>();

    for (const tx of transactions) {
      if (tx.type !== "EXPENSE" || !tx.category) continue;
      const { id, name, color } = tx.category;
      const existing = catMap.get(id);
      if (existing) {
        existing.total += Number(tx.amount);
        existing.count += 1;
      } else {
        catMap.set(id, { name, color, total: Number(tx.amount), count: 1 });
      }
    }

    const catArray = Array.from(catMap.entries())
      .map(([categoryId, v]) => ({ categoryId, ...v }))
      .sort((a, b) => b.total - a.total);

    const byCategory = catArray.map((c) => ({
      ...c,
      percent: totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0,
    }));

    // ── Account breakdown ──────────────────────────────────────────────────
    const accMap = new Map<string, { name: string; color: string | null; total: number }>();

    for (const tx of transactions) {
      if (tx.type !== "EXPENSE") continue;
      const { id, name, color } = tx.account;
      const existing = accMap.get(id);
      if (existing) existing.total += Number(tx.amount);
      else accMap.set(id, { name, color: color ?? null, total: Number(tx.amount) });
    }

    const byAccount = Array.from(accMap.entries())
      .map(([accountId, v]) => ({ accountId, ...v }))
      .sort((a, b) => b.total - a.total);

    // ── Daily trend ────────────────────────────────────────────────────────
    const dailyMap = new Map<string, { income: number; expense: number }>();
    for (const key of buildDailyKeys(start, end)) {
      dailyMap.set(key, { income: 0, expense: 0 });
    }

    for (const tx of transactions) {
      const key = format(new Date(tx.date), "yyyy-MM-dd");
      const entry = dailyMap.get(key);
      if (!entry) continue;
      if (tx.type === "INCOME") entry.income += Number(tx.amount);
      else if (tx.type === "EXPENSE") entry.expense += Number(tx.amount);
    }

    const dailyTrend = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }));

    // ── Month-over-month ───────────────────────────────────────────────────
    const lastMonthExpense = prevTransactions.reduce((s, t) => s + Number(t.amount), 0);
    const changePercent =
      lastMonthExpense > 0 ? Math.round(((totalExpense - lastMonthExpense) / lastMonthExpense) * 100) : 0;

    const monthOverMonth = { thisMonth: totalExpense, lastMonth: lastMonthExpense, changePercent };

    return NextResponse.json({ byCategory, byAccount, dailyTrend, summary, monthOverMonth });
  } catch (err) {
    console.error("[statistics] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
