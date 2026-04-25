/**
 * GET /api/insights
 *
 * Fetches the authenticated user's recent transactions and budgets,
 * runs all spending pattern analyses, and returns actionable insights
 * sorted by severity (critical → warning → info → positive).
 */
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
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
} from "@/lib/wallet/insights";

type SessionUser = { id: string };

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Current month boundaries
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 1);

    // Last month boundaries
    const lastMonthStart = new Date(year, month - 2, 1);
    const lastMonthEnd = new Date(year, month - 1, 1);

    // 30-day window for velocity and merchant analysis
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all required data in parallel
    const [thisMonthCats, lastMonthCats, recentTxs, budgets] = await Promise.all([
      // This month's spending per category
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { userId, type: "EXPENSE", date: { gte: monthStart, lt: monthEnd } },
        _sum: { amount: true },
      }),
      // Last month's spending per category
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { userId, type: "EXPENSE", date: { gte: lastMonthStart, lt: lastMonthEnd } },
        _sum: { amount: true },
      }),
      // Recent 30-day transactions for velocity and merchant analysis
      prisma.transaction.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        select: { date: true, amount: true, merchantName: true, type: true, categoryId: true },
        orderBy: { date: "desc" },
      }),
      // Current month budgets with actual spending
      prisma.budget.findMany({
        where: { userId, year, month },
        include: { category: { select: { id: true, name: true } } },
      }),
    ]);

    // Resolve category names for this month aggregates
    const allCategoryIds = [
      ...thisMonthCats.map((r) => r.categoryId),
      ...lastMonthCats.map((r) => r.categoryId),
    ];
    const categoryIds = allCategoryIds.filter((id, idx) => allCategoryIds.indexOf(id) === idx);

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });
    const catMap = new Map(categories.map((c) => [c.id, c.name]));

    // Build CategorySpend arrays
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

    // Build TransactionInput array
    const txInputs: TransactionInput[] = recentTxs.map((t) => ({
      date: t.date,
      amount: Number(t.amount),
      merchantName: t.merchantName,
      type: t.type,
    }));

    // Build BudgetInput array — attach current month spending per category
    const spentMap = new Map(thisMonthCats.map((r) => [r.categoryId, Number(r._sum.amount ?? 0)]));
    const budgetInputs: BudgetInput[] = budgets.map((b) => ({
      categoryId: b.categoryId,
      categoryName: b.category.name,
      amount: Number(b.amount),
      spent: spentMap.get(b.categoryId) ?? 0,
    }));

    // Days elapsed and days in month for budget projection
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());

    // Run all analyses
    const categoryChanges = analyzeCategoryChange(thisMonthSpend, lastMonthSpend);
    const velocity = analyzeSpendingVelocity(txInputs);
    const topMerchants = analyzeTopMerchants(txInputs, 3);
    const budgetProjections = analyzeBudgetProgress(budgetInputs, daysElapsed, daysInMonth);

    // Generate insight messages
    const insights = generateInsightMessages({
      categoryChanges,
      velocity,
      topMerchants,
      budgetProjections,
      avgDailySpend: velocity.avgDailyLast30,
    });

    return NextResponse.json(insights);
  } catch (err) {
    console.error("[GET /api/insights]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
