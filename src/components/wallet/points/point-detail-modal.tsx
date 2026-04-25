"use client";

/**
 * PointDetailModal — slide-over modal showing a single point's detail.
 *
 * Renders:
 *  - Provider name, current balance
 *  - PointUpdateForm for changing the balance
 *  - PointHistoryList for the full history
 *  - Delete button
 */

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { PointUpdateForm } from "./point-update-form";
import { PointHistoryList } from "./point-history-list";
import type { Point, PointHistory } from "@/hooks/wallet/use-points";
import { POINT_PROVIDERS } from "@/lib/wallet/constants";

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PointDetailModalProps {
  point: Point;
  onUpdate: (id: string, balance: number, description: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PointDetailModal({
  point,
  onUpdate,
  onDelete,
  onClose,
}: PointDetailModalProps) {
  const [history, setHistory] = useState<PointHistory[]>(point.history ?? []);
  const [loadingHistory, setLoadingHistory] = useState(!point.history);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const meta = POINT_PROVIDERS.find((p) => p.id === point.provider);
  const name = meta?.name ?? point.provider;

  // Fetch full history if not already loaded
  useEffect(() => {
    if (point.history) {
      setHistory(point.history);
      setLoadingHistory(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/points/${point.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setHistory(data.history ?? []);
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    })();
    return () => { cancelled = true; };
  }, [point.id, point.history]);

  const handleUpdate = async (balance: number, description: string) => {
    await onUpdate(point.id, balance, description);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(point.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-xl
        max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <p className="text-2xl font-bold text-indigo-600 mt-0.5">
              {formatKRW(toNumber(point.balance))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Delete with confirmation */}
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600">삭제하시겠어요?</span>
                <button
                  onClick={handleDelete}
                  className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  확인
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="포인트 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">
          {/* Update form */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">잔액 수정</h3>
            <PointUpdateForm
              point={point}
              onSubmit={handleUpdate}
              onCancel={onClose}
            />
          </section>

          {/* History */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">적립/사용 내역</h3>
            {loadingHistory ? (
              <p className="text-center text-sm text-gray-400 py-6">불러오는 중...</p>
            ) : (
              <PointHistoryList history={history} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
