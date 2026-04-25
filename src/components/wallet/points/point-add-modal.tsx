"use client";

/**
 * PointAddModal — modal for registering a new point provider.
 *
 * Uses POINT_PROVIDERS constant to populate the provider dropdown.
 * Lets the user choose a provider, set an initial balance, and
 * optionally set an expiry date.
 */

import { useState } from "react";
import { X } from "lucide-react";
import { POINT_PROVIDERS } from "@/lib/wallet/constants";
import type { CreatePointData, PointType } from "@/hooks/wallet/use-points";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PointAddModalProps {
  existingProviderIds: string[];
  onSubmit: (data: CreatePointData) => Promise<void>;
  onClose: () => void;
}

// Map POINT_PROVIDERS type field to PointType enum
const TYPE_MAP: Record<"pay" | "points" | "convenience", PointType> = {
  pay: "APPTECH",
  points: "LOYALTY",
  convenience: "LOYALTY",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PointAddModal({
  existingProviderIds,
  onSubmit,
  onClose,
}: PointAddModalProps) {
  const available = POINT_PROVIDERS.filter(
    (p) => !existingProviderIds.includes(p.id)
  );

  const [selectedId, setSelectedId] = useState<string>(
    available[0]?.id ?? ""
  );
  const [balance, setBalance] = useState("0");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedProvider = POINT_PROVIDERS.find((p) => p.id === selectedId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    setSubmitting(true);
    try {
      await onSubmit({
        provider: selectedId,
        type: TYPE_MAP[selectedProvider.type],
        balance: parseFloat(balance) || 0,
        expiresAt: expiresAt || null,
        description: "초기 잔액 등록",
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">새 포인트 추가</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {available.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-500">
            등록 가능한 제공사가 없습니다.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {/* Provider selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                포인트 제공사
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              >
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({TYPE_MAP[p.type] === "APPTECH" ? "앱테크" : "적립"})
                  </option>
                ))}
              </select>
            </div>

            {/* Initial balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                현재 잔액 (원)
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                min="0"
                step="1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Expiry date (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                만료일 (선택)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm
                  font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedId}
                className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium
                  text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "등록 중..." : "등록"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
