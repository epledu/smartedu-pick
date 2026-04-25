"use client";

/**
 * StatSummaryCards
 *
 * Grid of 5 summary metric cards: 총 수입, 총 지출, 순 저축액,
 * 일평균 지출, 거래 건수.
 * Card backgrounds and text adapt to light/dark theme via Tailwind dark: variants.
 */
import { TrendingUp, TrendingDown, Wallet, Calendar, Hash } from "lucide-react";
import type { StatSummary } from "@/hooks/wallet/use-statistics";
import { formatCurrency } from "@/lib/wallet/utils";
import { cn } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  summary: StatSummary;
}

interface CardConfig {
  label: string;
  value: string;
  icon: React.ElementType;
  /** Icon foreground color — same in both themes (semantic meaning preserved) */
  colorClass: string;
  /** Icon background — light and dark variants */
  bgClass: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StatSummaryCards({ summary }: Props) {
  const positive = summary.netSavings >= 0;

  const cards: CardConfig[] = [
    {
      label: "총 수입",
      value: formatCurrency(summary.totalIncome),
      icon: TrendingUp,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      label: "총 지출",
      value: formatCurrency(summary.totalExpense),
      icon: TrendingDown,
      colorClass: "text-red-500 dark:text-red-400",
      bgClass: "bg-red-50 dark:bg-red-900/30",
    },
    {
      label: "순 저축액",
      value: formatCurrency(Math.abs(summary.netSavings)),
      icon: Wallet,
      colorClass: positive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-orange-500 dark:text-orange-400",
      bgClass: positive
        ? "bg-emerald-50 dark:bg-emerald-900/30"
        : "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      label: "일평균 지출",
      value: formatCurrency(summary.avgDailyExpense),
      icon: Calendar,
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-900/30",
    },
    {
      label: "거래 건수",
      value: `${summary.transactionCount}건`,
      icon: Hash,
      colorClass: "text-gray-600 dark:text-gray-300",
      bgClass: "bg-gray-100 dark:bg-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            // Card surface: white in light, gray-800 in dark
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm flex flex-col gap-2"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.bgClass)}>
              <Icon className={cn("w-4 h-4", card.colorClass)} />
            </div>
            {/* Label text */}
            <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
            {/* Value text — uses semantic color (same hue, lighter shade in dark) */}
            <p className={cn("text-base font-bold", card.colorClass)}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
