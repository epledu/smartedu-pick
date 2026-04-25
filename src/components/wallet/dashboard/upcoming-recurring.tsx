"use client";

/**
 * Upcoming recurring expenses widget.
 * Shows fixed expenses scheduled within the next 7 days.
 */
import Link from "next/link";
import { Repeat } from "lucide-react";

interface RecurringItem {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  categoryColor: string | null;
}

interface UpcomingRecurringProps {
  items: RecurringItem[];
}

function formatDate(date: Date): string {
  const today = new Date();
  const diffMs = date.getTime() - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "내일";
  return `${diffDays}일 후`;
}

function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function UpcomingRecurring({ items }: UpcomingRecurringProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">다가오는 고정 지출</h2>
        <Link href="/wallet/recurring" className="text-xs text-blue-500 hover:underline">
          전체 보기
        </Link>
      </div>

      {/* Dark mode: recurring expenses card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-4">
        {items.length === 0 ? (
          <div className="py-6 text-center">
            <Repeat className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">7일 내 예정된 고정 지출이 없어요.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: (item.categoryColor ?? "#9CA3AF") + "30" }}
                >
                  <Repeat
                    className="w-3.5 h-3.5"
                    style={{ color: item.categoryColor ?? "#9CA3AF" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(item.dueDate)}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0">
                  {formatKRW(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
