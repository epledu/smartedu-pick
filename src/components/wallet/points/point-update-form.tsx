"use client";

/**
 * PointUpdateForm — form to update a point provider balance.
 *
 * Supports two modes:
 *  - "set"   (전체 변경): input becomes the new absolute balance
 *  - "delta" (증감): input is added to (or subtracted from) current balance
 *
 * A memo field captures the reason for the change.
 */

import { useState } from "react";
import type { Point } from "@/hooks/wallet/use-points";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNumber(val: number | string): number {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PointUpdateFormProps {
  point: Point;
  onSubmit: (balance: number, description: string) => Promise<void>;
  onCancel: () => void;
}

type Mode = "set" | "delta";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PointUpdateForm({ point, onSubmit, onCancel }: PointUpdateFormProps) {
  const currentBalance = toNumber(point.balance);

  const [mode, setMode] = useState<Mode>("set");
  const [inputValue, setInputValue] = useState<string>(String(currentBalance));
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Compute preview of resulting balance
  const numInput = parseFloat(inputValue) || 0;
  const preview = mode === "set" ? numInput : currentBalance + numInput;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preview < 0) return;
    setSubmitting(true);
    try {
      await onSubmit(preview, memo.trim() || (mode === "set" ? "잔액 설정" : "잔액 조정"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mode selector */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            setMode("set");
            setInputValue(String(currentBalance));
          }}
          className={`flex-1 py-2 text-sm font-medium transition-colors
            ${mode === "set"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
        >
          전체 변경
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("delta");
            setInputValue("0");
          }}
          className={`flex-1 py-2 text-sm font-medium transition-colors
            ${mode === "delta"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
        >
          증감 입력
        </button>
      </div>

      {/* Balance input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {mode === "set" ? "새 잔액 (원)" : "증감 금액 (원, 음수 가능)"}
        </label>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
          step="1"
          required
        />
      </div>

      {/* Preview */}
      {mode === "delta" && (
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
          변경 후 잔액:{" "}
          <span className={`font-semibold ${preview < 0 ? "text-red-600" : "text-gray-900"}`}>
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
              maximumFractionDigits: 0,
            }).format(preview)}
          </span>
        </div>
      )}

      {/* Memo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          메모 (선택)
        </label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="예: 구매 적립, 이벤트 보너스"
          maxLength={100}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm
            font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting || preview < 0}
          className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium
            text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
