/**
 * Server-side insights loader.
 *
 * Fetches the data needed for spending insights and runs every analysis,
 * returning a sorted Insight[] ready for the dashboard widget or the
 * /api/insights HTTP route. Centralizing the work here lets a Server
 * Component call into the same logic without an HTTP round-trip.
 */
import "server-only";
import prisma from "@/lib/wallet/prisma";
import {
  analyzeCategoryChange,
  analyzeSpendingVelocity,
  analyzeTopMerchants,
  analyzeBudgetProgress,
  generateInsightMessages,
  type CategorySpend,
  type TransactionInput,
  type BudgetInput,
  type Insight,
} from "@/lib/wallet/insights";

export async function loadInsights(userId: string): Promise<Insight[]> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);
  const lastMonthStart = new Date(year, month - 2, 1);
  const lastMonthEnd = new Date(year, month - 1, 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [thisMonthCats, lastMonthCats, recentTxs, budgets, allCategories] =
    await Promise.all([
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { userId, type: "EXPENSE", date: { gte: monthStart, lt: monthEnd } },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { userId, type: "EXPENSE", date: { gte: lastMonthStart, lt: lastMonthEnd } },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        select: { date: true, amount: true, merchantName: true, type: true, categoryId: true },
        orderBy: { date: "desc" },
      }),
      prisma.budget.findMany({
        where: { userId, year, month },
        include: { category: { select: { id: true, name: true } } },
      }),
      prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true },
      }),
    ]);

  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  const thisMonthSpend: CategorySpend[] = thisMonthCats.map((r) => ({
    categoryId: r.categoryId,
    name: catMap.get(r.categoryId) ?? r.categoryId,
    total: Number(r._sum.amount ?? 0),
  }));

  const lastMonthSpend: CategorySpend[] = lastMonthCats.map((r) => ({
    categoryId: r.categoryId,
    name: catMap.get(r.categoryId) ?? r.categoryId,
    total: Number(r._sum.amount ?? 0),
  }));

  const txInputs: TransactionInput[] = recentTxs.map((t) => ({
    date: t.date,
    amount: Number(t.amount),
    merchantName: t.merchantName,
    type: t.type,
  }));

  const spentMap = new Map(
    thisMonthCats.map((r) => [r.categoryId, Number(r._sum.amount ?? 0)]),
  );
  const budgetInputs: BudgetInput[] = budgets.map((b) => ({
    categoryId: b.categoryId,
    categoryName: b.category.name,
    amount: Number(b.amount),
    spent: spentMap.get(b.categoryId) ?? 0,
  }));

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysElapsed = Math.max(1, now.getDate());

  const categoryChanges = analyzeCategoryChange(thisMonthSpend, lastMonthSpend);
  const velocity = analyzeSpendingVelocity(txInputs);
  const topMerchants = analyzeTopMerchants(txInputs, 3);
  const budgetProjections = analyzeBudgetProgress(budgetInputs, daysElapsed, daysInMonth);

  return generateInsightMessages({
    categoryChanges,
    velocity,
    topMerchants,
    budgetProjections,
    avgDailySpend: velocity.avgDailyLast30,
  });
}
