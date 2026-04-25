"use client";

/**
 * DayTransactions
 *
 * Slide-up panel that shows all transactions for a selected calendar day.
 * Displays category icon/name, amount, merchant name, memo.
 * Shows income/expense summary at the top and a close button.
 */
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction } from "@/hooks/wallet/use-transactions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n) + "원";
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DayTransactionsProps {
  date: Date | null;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DayTransactions({ date, onClose }: DayTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch transactions for the selected day
  useEffect(() => {
    if (!date) {
      setTransactions([]);
      return;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    setLoading(true);

    fetch(`/api/transactions?dateFrom=${dateStr}&dateTo=${dateStr}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions ?? []);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [date]);

  if (!date) return null;

  // Compute daily totals
  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + Number(t.amount), 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet, slides up from bottom */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-w-xl mx-auto bg-white rounded-t-2xl shadow-xl max-h-[75vh] flex flex-col slide-up"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-base font-bold text-gray-900">
              {format(date, "M월 d일 (EEE)", { locale: ko })}
            </p>
            <div className="flex gap-4 mt-1">
              <span className="flex items-center gap-1 text-xs text-blue-500 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                {formatKRW(income)}
              </span>
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                {formatKRW(expense)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction list */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          {!loading && transactions.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">거래내역이 없습니다</p>
          )}

          {!loading && transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              {/* Category icon */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                style={{ backgroundColor: tx.category?.color ?? "#e5e7eb" }}
              >
                {tx.category?.icon ?? "💳"}
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {tx.merchantName ?? tx.category?.name ?? "기타"}
                </p>
                {tx.memo && (
                  <p className="text-xs text-gray-400 truncate">{tx.memo}</p>
                )}
              </div>

              {/* Amount */}
              <span
                className={`text-sm font-semibold shrink-0 ${
                  tx.type === "INCOME" ? "text-blue-500" : "text-red-500"
                }`}
              >
                {tx.type === "INCOME" ? "+" : "-"}
                {formatKRW(Number(tx.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
