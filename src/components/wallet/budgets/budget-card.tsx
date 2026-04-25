"use client";

/**
 * BudgetCard — displays a single category budget with progress and actions.
 *
 * Shows:
 *  - Category icon and name
 *  - Amount set vs amount spent
 *  - Remaining amount
 *  - Animated progress bar (color reflects status)
 *  - Percentage text
 *  - Edit and Delete buttons
 */
import { Pencil, Trash2 } from "lucide-react";
import { BudgetProgress } from "./budget-progress";
import type { Budget } from "@/hooks/wallet/use-budgets";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a number as Korean Won with no decimal places. */
function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

/** Map status to human-readable label. */
function statusLabel(status: Budget["status"]): string {
  if (status === "exceeded") return "초과";
  if (status === "warning") return "주의";
  return "정상";
}

/** Map status to text color class. */
function statusTextColor(status: Budget["status"]): string {
  if (status === "exceeded") return "text-red-600";
  if (status === "warning") return "text-yellow-600";
  return "text-green-600";
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { category, amount, spent, remaining, percent, status } = budget;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: category info + actions */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Category icon + name */}
        <div className="flex items-center gap-2 min-w-0">
          {category.icon && (
            <span
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: category.color ?? "#E5E7EB" }}
            >
              {/* Icon is a Lucide name stored as text; render as emoji fallback */}
              <span className="text-white text-xs font-bold">
                {category.name.charAt(0)}
              </span>
            </span>
          )}
          <span className="font-semibold text-gray-900 truncate">{category.name}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(budget)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="예산 수정"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(budget)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="예산 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amount row */}
      <div className="flex items-baseline justify-between mb-2 text-sm">
        <span className="text-gray-500">예산</span>
        <span className="font-medium text-gray-900">{formatKRW(amount)}</span>
      </div>
      <div className="flex items-baseline justify-between mb-3 text-sm">
        <span className="text-gray-500">지출</span>
        <span className={`font-medium ${statusTextColor(status)}`}>{formatKRW(spent)}</span>
      </div>

      {/* Progress bar */}
      <BudgetProgress percent={percent} status={status} className="mb-2" />

      {/* Footer: percentage + remaining */}
      <div className="flex items-center justify-between text-xs mt-1">
        <span className={`font-semibold ${statusTextColor(status)}`}>
          {percent.toFixed(1)}% · {statusLabel(status)}
        </span>
        <span className="text-gray-500">
          남은 금액: {formatKRW(remaining)}
        </span>
      </div>
    </div>
  );
}
