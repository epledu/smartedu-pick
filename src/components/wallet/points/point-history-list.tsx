"use client";

/**
 * PointHistoryList — timeline of point history entries for a provider.
 *
 * Each entry shows:
 *  - Icon: green plus (EARN), red minus (USE), gray clock (EXPIRE)
 *  - Amount and formatted date
 *  - Optional description
 *
 * Entries are grouped by calendar month (newest month first).
 */

import { Plus, Minus, Clock } from "lucide-react";
import type { PointHistory } from "@/hooks/wallet/use-points";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNumber(val: number | string): number {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}

function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PointHistoryListProps {
  history: PointHistory[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PointHistoryList({ history }: PointHistoryListProps) {
  if (history.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">내역이 없습니다.</p>
    );
  }

  // Group by month (newest first)
  const sorted = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const grouped = sorted.reduce<Record<string, PointHistory[]>>((acc, entry) => {
    const key = getMonthKey(entry.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([month, entries]) => (
        <div key={month}>
          {/* Month heading */}
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {month}
          </h4>

          <ul className="space-y-2">
            {entries.map((entry) => {
              const amount = toNumber(entry.amount);

              const isEarn = entry.type === "EARN";
              const isUse = entry.type === "USE";

              const iconBg = isEarn
                ? "bg-green-100"
                : isUse
                  ? "bg-red-100"
                  : "bg-gray-100";
              const iconColor = isEarn
                ? "text-green-600"
                : isUse
                  ? "text-red-500"
                  : "text-gray-400";
              const amountColor = isEarn
                ? "text-green-700"
                : isUse
                  ? "text-red-600"
                  : "text-gray-400";
              const sign = isEarn ? "+" : isUse ? "-" : "";
              const EntryIcon = isEarn ? Plus : isUse ? Minus : Clock;

              return (
                <li key={entry.id} className="flex items-start gap-3">
                  {/* Icon */}
                  <span
                    className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
                  >
                    <EntryIcon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700 truncate">
                        {entry.description ?? "내역"}
                      </span>
                      <span className={`text-sm font-semibold flex-shrink-0 ${amountColor}`}>
                        {sign}
                        {formatKRW(amount)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
