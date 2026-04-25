"use client";

/**
 * SyncResult component.
 *
 * Displays the outcome of a CODEF sync operation:
 *  - Summary: imported count, skipped duplicate count, errors
 *  - "확인" button to dismiss
 *
 * Note: The CODEF sync endpoint does not return individual transaction rows,
 * so this component shows only the aggregate counts.
 */

import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { SyncResult } from "@/hooks/wallet/use-banking";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SyncResultProps {
  result: SyncResult;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SyncResultModal({ result, onClose }: SyncResultProps) {
  const { imported, skipped, errors } = result;
  const hasErrors = errors.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${hasErrors ? "bg-amber-100" : "bg-green-100"}`}>
              {hasErrors ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">동기화 완료</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="font-medium text-gray-900">{imported}건</span> 가져옴
                {skipped > 0 && (
                  <span className="ml-1 text-gray-400">· {skipped}건 중복 스킵</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Error list (if any) */}
        {hasErrors && (
          <div className="px-6 py-4 space-y-1">
            <p className="text-xs font-medium text-red-600 mb-2">오류 발생:</p>
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-gray-600 bg-red-50 rounded px-2 py-1">
                {e}
              </p>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
