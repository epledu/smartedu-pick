"use client";

/**
 * SimpleAuthPendingView — Displays the waiting state after a push notification
 * has been sent. Shows a countdown and buttons to confirm or retry.
 */

import { useEffect, useState } from "react";
import { Loader2, Smartphone, CheckCircle2, RefreshCw } from "lucide-react";

interface SimpleAuthPendingViewProps {
  providerLabel: string;
  onComplete: () => Promise<void>;
  onRetry: () => void;
  loading: boolean;
  error: string | null;
}

const COUNTDOWN_SECONDS = 60;

export default function SimpleAuthPendingView({
  providerLabel,
  onComplete,
  onRetry,
  loading,
  error,
}: SimpleAuthPendingViewProps) {
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const expired = remaining <= 0;

  return (
    <div className="space-y-5 text-center">
      <div className="flex flex-col items-center gap-3">
        <Smartphone className="w-12 h-12 text-indigo-500" />
        <p className="text-sm font-medium text-gray-900">
          {providerLabel} 앱에서 알림을 확인하고 인증을 완료해주세요
        </p>
        {!expired ? (
          <p className="text-xs text-gray-500">
            남은 시간: <span className="font-mono font-semibold">{remaining}초</span>
          </p>
        ) : (
          <p className="text-xs text-amber-600">인증 시간이 만료되었습니다. 다시 시도해주세요.</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => { void onComplete(); }}
        disabled={loading || expired}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />확인 중...</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" />인증 완료</>
        )}
      </button>

      <button
        type="button"
        onClick={onRetry}
        disabled={loading}
        className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
      >
        <RefreshCw className="w-3.5 h-3.5" />다시 시도
      </button>
    </div>
  );
}
