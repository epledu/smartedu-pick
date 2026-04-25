"use client";

/**
 * BudgetProgress — reusable animated progress bar for budget usage.
 *
 * Color changes automatically based on the budget status:
 *  - normal   → green
 *  - warning  → yellow
 *  - exceeded → red
 */
import { getBudgetColor } from "@/lib/wallet/budget";
import type { BudgetStatus } from "@/lib/wallet/budget";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BudgetProgressProps {
  /** Spending percentage (0–100+). Values above 100 render a full red bar. */
  percent: number;
  status: BudgetStatus;
  /** Optional additional class names for the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BudgetProgress({ percent, status, className = "" }: BudgetProgressProps) {
  // Cap the visual fill at 100% so the bar never overflows its container
  const fill = Math.min(percent, 100);
  const colorClass = getBudgetColor(status);

  return (
    <div
      className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${fill}%` }}
      />
    </div>
  );
}
