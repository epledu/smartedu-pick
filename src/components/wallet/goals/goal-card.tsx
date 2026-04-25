"use client";

/**
 * GoalCard
 *
 * Displays a single goal as a card with:
 * - Colored header gradient bar (based on goal.color)
 * - Icon + title
 * - Progress bar with currentAmount / targetAmount
 * - Days remaining
 * - Status badge
 * - Progress ring (via GoalProgressRing)
 * - Optional edit / delete callbacks
 */
import GoalProgressRing from "./goal-progress-ring";
import type { Goal } from "@/hooks/wallet/use-goals";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<Goal["status"], string> = {
  ACTIVE: "진행 중",
  COMPLETED: "달성",
  FAILED: "실패",
  PAUSED: "중단",
};

const STATUS_COLORS: Record<Goal["status"], string> = {
  ACTIVE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  PAUSED: "bg-gray-100 text-gray-600",
};

function formatKRW(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}만원`;
  }
  return `${value.toLocaleString("ko-KR")}원`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const barColor = goal.color ?? "#6366F1";
  const progressPct = Math.min(100, goal.percent);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Top gradient bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(to right, ${barColor}99, ${barColor})`,
        }}
      />

      <div className="p-4 space-y-3">
        {/* Header row: icon + title + status badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {goal.icon && (
              <span className="text-xl flex-shrink-0" aria-hidden="true">
                {goal.icon}
              </span>
            )}
            <h3 className="font-semibold text-gray-800 text-sm truncate">{goal.title}</h3>
          </div>
          <span
            className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[goal.status]}`}
          >
            {STATUS_LABELS[goal.status]}
          </span>
        </div>

        {/* Progress row: ring + amounts */}
        <div className="flex items-center gap-3">
          <GoalProgressRing
            percent={goal.percent}
            startDate={goal.startDate}
            endDate={goal.endDate}
            size={64}
            strokeWidth={6}
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{formatKRW(goal.currentAmount)}</span>
              <span>{formatKRW(goal.targetAmount)}</span>
            </div>
            {/* Linear progress bar */}
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(to right, ${barColor}99, ${barColor})`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {goal.status === "ACTIVE"
                ? goal.daysRemaining > 0
                  ? `${goal.daysRemaining}일 남음`
                  : "기간 종료"
                : `목표: ${formatKRW(goal.targetAmount)}`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-1 border-t border-gray-50">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(goal)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                수정
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(goal.id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
