"use client";

/**
 * MonthComparison
 *
 * Compact card showing month-over-month expense change
 * with directional icon, color coding, and a progress bar.
 * Background, text, and progress track colors adapt to light/dark theme.
 */
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  thisMonth: number;
  lastMonth: number;
  changePercent: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MonthComparison({ thisMonth, lastMonth, changePercent }: Props) {
  const increased = changePercent > 0;
  const decreased = changePercent < 0;
  const neutral = changePercent === 0;

  const absPercent = Math.abs(changePercent);

  // Progress bar — represents thisMonth relative to max of both months
  const maxVal = Math.max(thisMonth, lastMonth, 1);
  const thisBarWidth = Math.round((thisMonth / maxVal) * 100);
  const lastBarWidth = Math.round((lastMonth / maxVal) * 100);

  return (
    // Container: white in light mode, gray-800 in dark mode
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">지난달 대비</p>

      {/* Change indicator — semantic colors kept (red = bad/increase, green = good/decrease) */}
      <div className="flex items-center gap-2 mb-4">
        {increased && (
          <>
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="text-base font-bold text-red-500">
              +{absPercent}% 증가
            </span>
          </>
        )}
        {decreased && (
          <>
            <TrendingDown className="w-5 h-5 text-emerald-500" />
            <span className="text-base font-bold text-emerald-500">
              -{absPercent}% 감소
            </span>
          </>
        )}
        {neutral && (
          <>
            <Minus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span className="text-base font-bold text-gray-500 dark:text-gray-400">변동 없음</span>
          </>
        )}
      </div>

      {/* Month comparison bars */}
      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
        {/* This month */}
        <div>
          <div className="flex justify-between mb-0.5">
            <span>이번 달</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {formatCurrency(thisMonth)}
            </span>
          </div>
          {/* Progress track: gray-100 in light, gray-700 in dark */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${thisBarWidth}%` }}
            />
          </div>
        </div>

        {/* Last month */}
        <div>
          <div className="flex justify-between mb-0.5">
            <span>지난 달</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {formatCurrency(lastMonth)}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Last month bar is muted gray (intentionally less prominent) */}
            <div
              className="h-full bg-gray-300 dark:bg-gray-500 rounded-full transition-all duration-500"
              style={{ width: `${lastBarWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
