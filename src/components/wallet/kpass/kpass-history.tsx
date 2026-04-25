"use client";

/**
 * KPassHistory
 *
 * Displays a bar chart of monthly K-Pass refunds over the past 6 months.
 * Each bar is proportional to the maximum refund in the displayed period.
 */
import type { KPassHistoryItem } from "@/hooks/wallet/use-kpass";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KPassHistoryProps {
  history: KPassHistoryItem[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

function formatWon(amount: number): string {
  if (amount >= 10000) return `${Math.floor(amount / 1000)}천원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KPassHistory({ history }: KPassHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm">
        <span>아직 K-패스 환급 내역이 없습니다.</span>
        <span className="mt-1 text-xs">월 15회 이상 교통 이용 시 내역이 표시됩니다.</span>
      </div>
    );
  }

  const maxRefund = Math.max(...history.map((h) => h.refundAmount), 1);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">최근 환급 내역 (6개월)</p>

      <div className="flex items-end gap-2 h-32">
        {history.map((item) => {
          const barHeight = maxRefund > 0 ? (item.refundAmount / maxRefund) * 100 : 0;
          const hasRefund = item.refundAmount > 0;

          return (
            <div key={`${item.year}-${item.month}`} className="flex-1 flex flex-col items-center gap-1">
              {/* Amount label */}
              <span className="text-xs text-gray-500 text-center leading-none">
                {hasRefund ? formatWon(item.refundAmount) : "-"}
              </span>

              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-t-md overflow-hidden" style={{ height: "72px" }}>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    hasRefund ? "bg-indigo-400" : "bg-gray-200"
                  }`}
                  style={{ height: `${barHeight}%`, marginTop: `${100 - barHeight}%` }}
                />
              </div>

              {/* Month label */}
              <span className="text-xs text-gray-400">{MONTH_LABELS[item.month - 1]}</span>

              {/* Uses count */}
              <span className="text-xs text-gray-400">{item.uses}회</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="inline-block w-3 h-3 rounded bg-indigo-400" />
        <span>환급 발생</span>
        <span className="inline-block w-3 h-3 rounded bg-gray-200 ml-2" />
        <span>미달성 (15회 미만)</span>
      </div>
    </div>
  );
}
