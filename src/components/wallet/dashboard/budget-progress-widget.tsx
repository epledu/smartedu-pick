"use client";

/**
 * Budget progress widget.
 * Shows top 3 categories by spending vs budget with mini progress bars.
 */
import Link from "next/link";

interface CategoryBudget {
  id: string;
  name: string;
  color: string | null;
  spent: number;
  budget: number;
}

interface BudgetProgressWidgetProps {
  items: CategoryBudget[];
}

function formatKRW(amount: number): string {
  if (amount >= 10000) return `${Math.floor(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

function ProgressBar({ ratio, color }: { ratio: number; color: string }) {
  const pct = Math.min(ratio * 100, 100);
  const isOver = ratio > 1;
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          backgroundColor: isOver ? "#ef4444" : (color ?? "#6366f1"),
        }}
      />
    </div>
  );
}

export function BudgetProgressWidget({ items }: BudgetProgressWidgetProps) {
  if (items.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">예산 현황</h2>
          <Link href="/wallet/budgets" className="text-xs text-blue-500 hover:underline">
            설정하기
          </Link>
        </div>
        {/* Dark mode: empty state card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-4 py-6 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">예산이 설정되지 않았어요.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">예산 현황</h2>
        <Link href="/wallet/budgets" className="text-xs text-blue-500 hover:underline">
          전체 보기
        </Link>
      </div>

      {/* Dark mode: budget list card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-4 divide-y divide-gray-100 dark:divide-gray-800">
        {items.slice(0, 3).map((item) => {
          const ratio = item.budget > 0 ? item.spent / item.budget : 0;
          const isOver = ratio > 1;
          return (
            <div key={item.id} className="py-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color ?? "#9CA3AF" }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{item.name}</span>
                </div>
                <span
                  className={`text-xs font-semibold ${isOver ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {formatKRW(item.spent)} / {formatKRW(item.budget)}
                </span>
              </div>
              <ProgressBar ratio={ratio} color={item.color ?? "#6366f1"} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
