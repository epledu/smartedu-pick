"use client";

/**
 * KPassRefundCard
 *
 * Large card showing the estimated K-Pass refund amount for the current month,
 * next expected refund date, and progress toward the next threshold.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KPassRefundCardProps {
  /** Estimated refund amount in KRW. */
  refundAmount: number;
  /** Whether the 15-use eligibility threshold has been met. */
  isEligible: boolean;
  /** Number of rides remaining before eligibility (null if already eligible). */
  remaining: number | null;
  /** Total amount spent on transport this month. */
  totalSpent: number;
  /** Refund rate as a decimal (e.g. 0.20 for 20%). */
  refundRate: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Formats a number as Korean Won string. */
function formatWon(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

/** Returns a human-readable label for the next expected refund date. */
function getNextRefundLabel(): string {
  const now = new Date();
  // K-Pass refunds are typically issued in the first week of the following month
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5);
  return nextMonth.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KPassRefundCard({
  refundAmount,
  isEligible,
  remaining,
  totalSpent,
  refundRate,
}: KPassRefundCardProps) {
  const nextRefundDate = getNextRefundLabel();
  const refundPercent = Math.round(refundRate * 100);

  return (
    <div
      className={`rounded-2xl p-6 text-white shadow-md ${
        isEligible
          ? "bg-gradient-to-br from-indigo-500 to-indigo-700"
          : "bg-gradient-to-br from-gray-400 to-gray-600"
      }`}
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-white/80">이번 달 예상 환급액</span>
        <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">
          {refundPercent}% 환급
        </span>
      </div>

      {/* Main refund amount */}
      <div className="mt-1 mb-4">
        <span className="text-4xl font-bold tracking-tight">
          {isEligible ? formatWon(refundAmount) : "₩0"}
        </span>
        {isEligible && totalSpent > 0 && (
          <span className="ml-2 text-sm text-white/70">
            (교통비 {formatWon(totalSpent)} × {refundPercent}%)
          </span>
        )}
      </div>

      {/* Status row */}
      {isEligible ? (
        <div className="bg-white/10 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">다음 환급 예정일</span>
            <span className="font-medium">{nextRefundDate}</span>
          </div>
          <p className="text-xs text-white/60">
            K-Pass 환급은 다음 달 초 교통카드로 자동 적립됩니다.
          </p>
        </div>
      ) : (
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-sm text-white/90">
            앞으로 <span className="font-bold text-white">{remaining}회</span> 더 이용하면
            환급이 시작됩니다.
          </p>
          <p className="text-xs text-white/60 mt-1">
            월 15회 이상 이용 시 {refundPercent}% 자동 환급
          </p>
        </div>
      )}
    </div>
  );
}
