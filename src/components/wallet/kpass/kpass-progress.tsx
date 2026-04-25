"use client";

/**
 * KPassProgress
 *
 * Progress bar showing how many transport rides the user has made this month
 * relative to the 15-ride eligibility threshold.
 *
 * Color states:
 *   - gray  : fewer than 15 uses (not yet eligible)
 *   - green : 15–59 uses (eligible, earning refund)
 *   - gold  : 60+ uses (maximum cap reached)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KPassProgressProps {
  /** Total transport rides counted this month (capped at 60 by the API). */
  uses: number;
  /** Whether the 15-use eligibility threshold has been met. */
  isEligible: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_USES = 15;
const MAX_USES = 60;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KPassProgress({ uses, isEligible }: KPassProgressProps) {
  const isMaxed = uses >= MAX_USES;

  // Progress ratio capped at 1.0 relative to MIN_USES for the bar fill
  const progressRatio = Math.min(1, uses / MIN_USES);

  // Color scheme based on status
  const barColor = isMaxed
    ? "bg-yellow-400"
    : isEligible
      ? "bg-green-500"
      : "bg-gray-400";

  const textColor = isMaxed
    ? "text-yellow-600"
    : isEligible
      ? "text-green-600"
      : "text-gray-500";

  const statusLabel = isMaxed
    ? "최대 이용 횟수 도달! 🎉"
    : isEligible
      ? "목표 달성! ✓"
      : `목표까지 ${MIN_USES - uses}회 남음`;

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">이번 달 교통 이용</span>
        <span className={`font-semibold ${textColor}`}>{statusLabel}</span>
      </div>

      {/* Count display */}
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${textColor}`}>{uses}</span>
        <span className="text-gray-400 text-sm">/ {MIN_USES}회</span>
        {isMaxed && (
          <span className="ml-1 text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">
            MAX {MAX_USES}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${progressRatio * 100}%` }}
          role="progressbar"
          aria-valuenow={uses}
          aria-valuemin={0}
          aria-valuemax={MIN_USES}
          aria-label={`교통 이용 횟수 ${uses}/${MIN_USES}`}
        />
      </div>

      {/* Threshold markers */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>0회</span>
        <span className={isEligible ? textColor : ""}>{MIN_USES}회 (환급 시작)</span>
        <span className={isMaxed ? "text-yellow-500" : ""}>{MAX_USES}회 (최대)</span>
      </div>
    </div>
  );
}
