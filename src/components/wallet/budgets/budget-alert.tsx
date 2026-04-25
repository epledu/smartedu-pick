"use client";

/**
 * BudgetAlert — dismissible alert banner summarizing budgets in warning/exceeded state.
 *
 * Displays:
 *  - Count summary ("N개 카테고리가 예산의 80%를 초과했습니다")
 *  - Expandable list of affected categories
 *  - Dismiss (X) button
 */
import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import type { Budget } from "@/hooks/wallet/use-budgets";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BudgetAlertProps {
  budgets: Budget[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BudgetAlert({ budgets }: BudgetAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Filter budgets that need attention
  const alertBudgets = budgets.filter(
    (b) => b.status === "warning" || b.status === "exceeded"
  );

  if (dismissed || alertBudgets.length === 0) return null;

  const exceededCount = alertBudgets.filter((b) => b.status === "exceeded").length;
  const warningCount = alertBudgets.filter((b) => b.status === "warning").length;

  // Choose color scheme based on highest severity
  const hasExceeded = exceededCount > 0;
  const bannerColor = hasExceeded
    ? "bg-red-50 border-red-200 text-red-800"
    : "bg-yellow-50 border-yellow-200 text-yellow-800";
  const iconColor = hasExceeded ? "text-red-500" : "text-yellow-500";

  // Summary message
  const summaryParts: string[] = [];
  if (exceededCount > 0) summaryParts.push(`${exceededCount}개 초과`);
  if (warningCount > 0) summaryParts.push(`${warningCount}개 경고`);
  const summary = `${alertBudgets.length}개 카테고리가 예산의 80%를 초과했습니다 (${summaryParts.join(", ")})`;

  return (
    <div className={`rounded-lg border px-4 py-3 mb-4 ${bannerColor}`}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{summary}</p>

          {/* Expandable list toggle */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 flex items-center gap-1 text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> 목록 접기
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> 목록 보기
              </>
            )}
          </button>

          {/* Expanded list */}
          {expanded && (
            <ul className="mt-2 space-y-1">
              {alertBudgets.map((b) => (
                <li key={b.id} className="flex items-center justify-between text-xs">
                  <span>{b.category.name}</span>
                  <span className="font-semibold">
                    {b.percent.toFixed(1)}%{" "}
                    {b.status === "exceeded" ? "🔴 초과" : "🟡 경고"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
          aria-label="알림 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
