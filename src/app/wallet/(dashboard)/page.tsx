/**
 * Dashboard home page
 *
 * Server component that fetches this month's summary stats,
 * recent transactions, budget progress, and upcoming recurring expenses.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { formatCurrency } from "@/lib/wallet/utils";
import { InsightWidgetWrapper } from "@/components/wallet/insights/insight-widget-wrapper";
import { QuickActions } from "@/components/wallet/dashboard/quick-actions";
import { BudgetProgressWidget } from "@/components/wallet/dashboard/budget-progress-widget";
import { UpcomingRecurring } from "@/components/wallet/dashboard/upcoming-recurring";

// Extend session user type to include id added by NextAuth callback
type SessionUser = { id: string; name?: string | null; email?: string | null };

const TX_TYPE = { INCOME: "INCOME", EXPENSE: "EXPENSE", TRANSFER: "TRANSFER" } as const;
type TxType = (typeof TX_TYPE)[keyof typeof TX_TYPE];

// ---------------------------------------------------------------------------
// Summary card
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  color = "text-gray-900",
  subValue,
}: {
  label: string;
  value: string;
  color?: string;
  subValue?: string;
}) {
  return (
    // Dark mode: card background and border
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      {subValue && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subValue}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recent transaction row
// ---------------------------------------------------------------------------

function RecentRow({
  type,
  amount,
  label,
  categoryColor,
  date,
}: {
  type: TxType;
  amount: number;
  label: string;
  categoryColor: string | null;
  date: Date;
}) {
  const isIncome = type === TX_TYPE.INCOME;
  const dateStr = new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="w-8 h-8 rounded-full shrink-0"
        style={{ backgroundColor: categoryColor ?? "#9CA3AF" }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{dateStr}</p>
      </div>
      <span className={`text-sm font-semibold shrink-0 ${isIncome ? "text-blue-500" : "text-red-500"}`}>
        {isIncome ? "+" : "-"}{formatCurrency(amount)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/wallet/login");

  const userId = (session.user as SessionUser).id;
  if (!userId) redirect("/wallet/login");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Monthly transactions for aggregation
  const monthlyTxs = await prisma.transaction.findMany({
    where: { userId, date: { gte: monthStart, lt: monthEnd } },
    select: { type: true, amount: true },
  });

  // Income / expense totals
  let totalIncome = 0;
  let totalExpense = 0;
  for (const tx of monthlyTxs) {
    const n = Number(tx.amount);
    if (tx.type === TX_TYPE.INCOME) totalIncome += n;
    else if (tx.type === TX_TYPE.EXPENSE) totalExpense += n;
  }
  const balance = totalIncome - totalExpense;

  // Last 5 transactions
  const recentTxs = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: { category: { select: { name: true, color: true } } },
  });

  // Budget progress: categories with budgets set this month
  // Budget model uses month (1-12) and year (YYYY) as integers
  const budgets = await prisma.budget.findMany({
    where: { userId, month: now.getMonth() + 1, year: now.getFullYear() },
    include: { category: { select: { id: true, name: true, color: true } } },
    take: 3,
    orderBy: { amount: "desc" },
  }).catch(() => []);

  // Spending per category for budget widget
  const spendingByCategory: Record<string, number> = {};
  if (budgets.length > 0) {
    const catIds = budgets.map((b: { category: { id: string } }) => b.category.id);
    const catTxs = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: monthStart, lt: monthEnd },
        type: TX_TYPE.EXPENSE,
        categoryId: { in: catIds },
      },
      select: { categoryId: true, amount: true },
    });
    for (const tx of catTxs) {
      if (tx.categoryId) {
        spendingByCategory[tx.categoryId] =
          (spendingByCategory[tx.categoryId] ?? 0) + Number(tx.amount);
      }
    }
  }

  const budgetItems = budgets.map((b: { id: string; category: { id: string; name: string; color: string | null }; amount: object }) => ({
    id: b.id,
    name: b.category.name,
    color: b.category.color,
    spent: spendingByCategory[b.category.id] ?? 0,
    budget: Number(b.amount),
  }));

  // Upcoming recurring expenses (next 7 days)
  // RecurringExpense model has no direct category relation — use categoryId only
  const upcomingRecurring = await prisma.recurringExpense.findMany({
    where: { userId, nextDueDate: { gte: now, lte: nextWeek } },
    orderBy: { nextDueDate: "asc" },
    take: 5,
    select: { id: true, description: true, amount: true, nextDueDate: true },
  }).catch(() => []);

  const recurringItems = upcomingRecurring.map((r: {
    id: string;
    description: string;
    amount: object;
    nextDueDate: Date;
  }) => ({
    id: r.id,
    name: r.description,
    amount: Number(r.amount),
    dueDate: r.nextDueDate,
    categoryColor: null,
  }));

  const userName = (session.user as SessionUser & { name?: string | null }).name;

  return (
    // Dark mode: page background and header
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header — diary-style greeting */}
      <header className="bg-white dark:bg-gray-900 px-4 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-sm text-amber-700 font-medium">오늘의 지갑 📖</p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {userName ?? "사용자"}님의 {now.getMonth() + 1}월 기록
        </h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">
        {/* Summary cards */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">이번 달 요약</h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="이번 달 수입" value={formatCurrency(totalIncome)} color="text-blue-600" />
            <SummaryCard label="이번 달 지출" value={formatCurrency(totalExpense)} color="text-red-500" />
            <SummaryCard
              label="잔액"
              value={formatCurrency(balance)}
              color={balance >= 0 ? "text-green-600" : "text-red-500"}
              subValue={balance >= 0 ? "절약 중이에요 👍" : "예산 초과 주의"}
            />
            <SummaryCard label="거래 건수" value={`${monthlyTxs.length}건`} />
          </div>
        </section>

        {/* Quick actions */}
        <QuickActions />

        {/* Budget progress */}
        <BudgetProgressWidget items={budgetItems} />

        {/* Insight widget */}
        <InsightWidgetWrapper />

        {/* Upcoming recurring */}
        <UpcomingRecurring items={recurringItems} />

        {/* Recent transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">최근 거래</h2>
            <Link href="/wallet/transactions" className="text-xs text-blue-500 hover:underline">
              전체 보기
            </Link>
          </div>

          {/* Dark mode: recent transactions container */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 px-4 divide-y divide-gray-100 dark:divide-gray-800">
            {recentTxs.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">거래 내역이 없습니다.</p>
            ) : (
              recentTxs.map((tx: {
                id: string;
                type: string;
                amount: object;
                merchantName: string | null;
                memo: string | null;
                date: Date;
                category: { name: string; color: string | null } | null;
              }) => (
                <RecentRow
                  key={tx.id}
                  type={tx.type as TxType}
                  amount={Number(tx.amount)}
                  label={tx.merchantName ?? tx.memo ?? tx.category?.name ?? "내역 없음"}
                  categoryColor={tx.category?.color ?? null}
                  date={tx.date}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
