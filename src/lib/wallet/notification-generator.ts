/**
 * Notification generator utilities.
 *
 * Generates in-app notifications based on budget thresholds,
 * recurring expense due dates, and goal progress milestones.
 * Each generator is idempotent — it checks for existing
 * notifications to avoid duplicates within the same period.
 */
import type { PrismaClient } from "@prisma/client";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// Budget warning triggers at 80% usage; exceeded at 100%
const BUDGET_WARNING_THRESHOLD = 0.8;

// Days ahead to warn about recurring expenses
const RECURRING_DUE_DAYS = 3;

// Goal milestone percentages to notify on
const GOAL_MILESTONES = [50, 80, 100];

// ---------------------------------------------------------------------------
// Budget notifications
// ---------------------------------------------------------------------------

/**
 * Check all budgets for the current month. Create BUDGET_WARNING or
 * BUDGET_EXCEEDED notifications if thresholds are crossed and no
 * notification of that type already exists for this budget this month.
 */
export async function generateBudgetNotifications(
  userId: string,
  prisma: PrismaTransactionClient
): Promise<number> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const budgets = await prisma.budget.findMany({
    where: { userId, year, month },
    include: { category: { select: { name: true } } },
  });

  if (!budgets.length) return 0;

  const spentRows = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: startOfMonth, lte: endOfMonth },
      categoryId: { in: budgets.map((b) => b.categoryId) },
    },
    _sum: { amount: true },
  });

  const spentMap = new Map<string, number>(
    spentRows.map((r) => [r.categoryId, Number(r._sum.amount ?? 0)])
  );

  let created = 0;

  for (const budget of budgets) {
    const amount = Number(budget.amount);
    if (amount <= 0) continue;

    const spent = spentMap.get(budget.categoryId) ?? 0;
    const ratio = spent / amount;

    const isExceeded = ratio >= 1.0;
    const isWarning = !isExceeded && ratio >= BUDGET_WARNING_THRESHOLD;

    if (!isExceeded && !isWarning) continue;

    const notifType = isExceeded ? "BUDGET_EXCEEDED" : "BUDGET_WARNING";
    const dedupeKey = `budget-${budget.id}-${year}-${month}-${notifType}`;

    // Avoid duplicate notifications for same budget/month/type
    const exists = await prisma.notification.findFirst({
      where: {
        userId,
        type: notifType,
        data: { path: ["dedupeKey"], equals: dedupeKey },
      },
    });
    if (exists) continue;

    const percent = Math.round(ratio * 100);
    const title = isExceeded
      ? `${budget.category.name} 예산 초과`
      : `${budget.category.name} 예산 경고`;
    const body = isExceeded
      ? `${budget.category.name} 예산을 ${percent - 100}% 초과했습니다.`
      : `${budget.category.name} 예산의 ${percent}%를 사용했습니다.`;

    await prisma.notification.create({
      data: {
        userId,
        type: notifType,
        title,
        body,
        data: { dedupeKey, budgetId: budget.id, categoryId: budget.categoryId, percent },
      },
    });
    created++;
  }

  return created;
}

// ---------------------------------------------------------------------------
// Recurring expense notifications
// ---------------------------------------------------------------------------

/**
 * Find recurring expenses due within the next 3 days and create
 * RECURRING_DUE notifications if not already generated today.
 */
export async function generateRecurringDueNotifications(
  userId: string,
  prisma: PrismaTransactionClient
): Promise<number> {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + RECURRING_DUE_DAYS);

  const upcoming = await prisma.recurringExpense.findMany({
    where: {
      userId,
      isActive: true,
      nextDueDate: { lte: cutoff },
    },
  });

  if (!upcoming.length) return 0;

  let created = 0;
  const todayStr = now.toISOString().slice(0, 10);

  for (const expense of upcoming) {
    const dedupeKey = `recurring-${expense.id}-${todayStr}`;

    const exists = await prisma.notification.findFirst({
      where: {
        userId,
        type: "RECURRING_DUE",
        data: { path: ["dedupeKey"], equals: dedupeKey },
      },
    });
    if (exists) continue;

    const dueDate = new Date(expense.nextDueDate);
    const daysUntil = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dueDateStr = dueDate.toLocaleDateString("ko-KR");
    const amountStr = Number(expense.amount).toLocaleString("ko-KR");

    const title = `고정 지출 예정: ${expense.description}`;
    const body =
      daysUntil <= 0
        ? `${expense.description} (${amountStr}원) 결제일이 오늘입니다.`
        : `${expense.description} (${amountStr}원) 결제일이 ${daysUntil}일 후(${dueDateStr})입니다.`;

    await prisma.notification.create({
      data: {
        userId,
        type: "RECURRING_DUE",
        title,
        body,
        data: { dedupeKey, recurringId: expense.id, daysUntil, amount: Number(expense.amount) },
      },
    });
    created++;
  }

  return created;
}

// ---------------------------------------------------------------------------
// Goal progress notifications
// ---------------------------------------------------------------------------

/**
 * Check all active goals and create GOAL_PROGRESS notifications
 * when a milestone (50%, 80%, 100%) is newly crossed.
 */
export async function generateGoalNotifications(
  userId: string,
  prisma: PrismaTransactionClient
): Promise<number> {
  const goals = await prisma.goal.findMany({
    where: { userId, status: "ACTIVE" },
  });

  if (!goals.length) return 0;

  let created = 0;

  for (const goal of goals) {
    const target = Number(goal.targetAmount);
    if (target <= 0) continue;

    const current = Number(goal.currentAmount);
    const percent = Math.floor((current / target) * 100);

    for (const milestone of GOAL_MILESTONES) {
      if (percent < milestone) continue;

      const dedupeKey = `goal-${goal.id}-${milestone}`;

      const exists = await prisma.notification.findFirst({
        where: {
          userId,
          type: "GOAL_PROGRESS",
          data: { path: ["dedupeKey"], equals: dedupeKey },
        },
      });
      if (exists) continue;

      const isComplete = milestone === 100;
      const title = isComplete
        ? `목표 달성! ${goal.title}`
        : `목표 ${milestone}% 달성: ${goal.title}`;
      const body = isComplete
        ? `"${goal.title}" 목표를 달성했습니다!`
        : `"${goal.title}" 목표의 ${milestone}%를 달성했습니다.`;

      await prisma.notification.create({
        data: {
          userId,
          type: "GOAL_PROGRESS",
          title,
          body,
          data: { dedupeKey, goalId: goal.id, milestone, percent },
        },
      });
      created++;
    }
  }

  return created;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Run all generators for a user and return the total created count.
 */
export async function generateAllNotifications(
  userId: string,
  prisma: PrismaTransactionClient
): Promise<{ total: number; budget: number; recurring: number; goal: number }> {
  const [budget, recurring, goal] = await Promise.all([
    generateBudgetNotifications(userId, prisma),
    generateRecurringDueNotifications(userId, prisma),
    generateGoalNotifications(userId, prisma),
  ]);

  return { total: budget + recurring + goal, budget, recurring, goal };
}
