/**
 * Budget utility functions.
 *
 * Provides status calculation, color mapping, and notification creation
 * helpers for the budget feature.
 */

import { BUDGET_WARNING_THRESHOLD, BUDGET_EXCEEDED_THRESHOLD } from "@/lib/wallet/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BudgetStatus = "normal" | "warning" | "exceeded";

// ---------------------------------------------------------------------------
// Status calculation
// ---------------------------------------------------------------------------

/**
 * Determines the budget status based on the spending percentage.
 *
 * @param percent - Spending percentage as a decimal (e.g. 0.85 = 85%)
 * @returns "exceeded" if >= 100%, "warning" if >= 80%, "normal" otherwise
 */
export function calculateBudgetStatus(percent: number): BudgetStatus {
  if (percent >= BUDGET_EXCEEDED_THRESHOLD) return "exceeded";
  if (percent >= BUDGET_WARNING_THRESHOLD) return "warning";
  return "normal";
}

/**
 * Returns the Tailwind CSS background color class for a given budget status.
 *
 * @param status - The current budget status
 * @returns Tailwind bg-color class string
 */
export function getBudgetColor(status: BudgetStatus): string {
  switch (status) {
    case "exceeded":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    default:
      return "bg-green-500";
  }
}

// ---------------------------------------------------------------------------
// Notification deduplication helper
// ---------------------------------------------------------------------------

/**
 * Checks and creates budget notifications for all budgets that crossed a
 * threshold. Deduplicates by skipping if an identical notification already
 * exists for today.
 *
 * This function is designed to be called from POST /api/transactions after
 * a new expense is recorded.
 *
 * @param userId  - The authenticated user's id
 * @param prisma  - Prisma client instance
 */
export async function checkAndCreateBudgetNotifications(
  userId: string,
  // Use `any` to avoid importing PrismaClient type in a non-generated context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<void> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Fetch all budgets for this user in the current month
  const budgets = await prisma.budget.findMany({
    where: { userId, year, month },
    include: { category: { select: { name: true } } },
  });

  if (!budgets.length) return;

  // Sum expenses per category for the current month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const spentRows: Array<{ categoryId: string; _sum: { amount: unknown } }> =
    await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startOfMonth, lte: endOfMonth },
        categoryId: { in: budgets.map((b: { categoryId: string }) => b.categoryId) },
      },
      _sum: { amount: true },
    });

  // Build a lookup map of spent amounts
  const spentMap = new Map<string, number>(
    spentRows.map((row) => [
      row.categoryId,
      Number(row._sum.amount ?? 0),
    ])
  );

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000 - 1);

  for (const budget of budgets) {
    const spent = spentMap.get(budget.categoryId) ?? 0;
    const budgetAmount = Number(budget.amount);
    if (budgetAmount <= 0) continue;

    const percent = spent / budgetAmount;
    const status = calculateBudgetStatus(percent);

    if (status === "normal") continue;

    const notifType =
      status === "exceeded" ? "BUDGET_EXCEEDED" : "BUDGET_WARNING";

    // Dedup: skip if same type notification exists today
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: notifType,
        createdAt: { gte: todayStart, lte: todayEnd },
        data: { path: ["budgetId"], equals: budget.id },
      },
    });

    if (existing) continue;

    const percentLabel = Math.round(percent * 100);
    const title =
      status === "exceeded"
        ? `[${budget.category.name}] 예산 초과`
        : `[${budget.category.name}] 예산 경고`;
    const body =
      status === "exceeded"
        ? `${budget.category.name} 카테고리 예산을 초과했습니다. (${percentLabel}% 사용)`
        : `${budget.category.name} 카테고리 예산의 ${percentLabel}%를 사용했습니다.`;

    await prisma.notification.create({
      data: {
        userId,
        type: notifType,
        title,
        body,
        data: { budgetId: budget.id, categoryId: budget.categoryId, percent: percentLabel },
      },
    });
  }
}
