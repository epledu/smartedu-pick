"use client";

/**
 * Quick action buttons for the dashboard.
 * Large touch targets optimised for mobile.
 */
import Link from "next/link";
import { PlusCircle, ScanLine, BarChart3, PiggyBank } from "lucide-react";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// Dark mode: colored chip backgrounds use {color}-900/30 in dark to keep subtle tones
const ACTIONS: QuickAction[] = [
  {
    label: "오늘의 기록",
    href: "/wallet/transactions?new=1",
    icon: <PlusCircle className="w-6 h-6" />,
    color: "text-blue-600 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    label: "영수증 스캔",
    href: "/wallet/receipts",
    icon: <ScanLine className="w-6 h-6" />,
    color: "text-purple-600 dark:text-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    label: "이번 달 요약",
    href: "/wallet/statistics",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "text-green-600 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-900/30",
  },
  {
    label: "이번 달 예산",
    href: "/wallet/budgets",
    icon: <PiggyBank className="w-6 h-6" />,
    color: "text-orange-600 dark:text-orange-300",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
  },
];

export function QuickActions() {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">빠른 실행</h2>
      {/* 2x2 on mobile, 4 in a row on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`
              flex flex-col items-center gap-2 py-4 px-2 rounded-2xl
              min-h-[80px]
              ${action.bgColor} ${action.color}
              hover:opacity-80 active:scale-95 transition-all
              text-center
            `}
          >
            {action.icon}
            <span className="text-xs font-medium leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
