"use client";

/**
 * Global error boundary catch-all page for Next.js App Router.
 * Receives the error and a reset function to retry the failed segment.
 */
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Forward to error tracking service in production
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-5">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>

      {/* Heading */}
      <h1 className="text-xl font-bold text-gray-800 mb-2">
        문제가 발생했어요
      </h1>
      <p className="text-sm text-gray-500 max-w-xs mb-8">
        예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도하거나
        페이지를 새로고침 해주세요.
      </p>

      {/* Error details (dev only) */}
      {process.env.NODE_ENV !== "production" && error?.message && (
        <pre className="mb-6 text-xs text-red-400 bg-red-50 rounded-lg px-4 py-3 max-w-sm text-left overflow-x-auto">
          {error.message}
        </pre>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
        >
          다시 시도
        </button>
        <a
          href="/wallet"
          className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          홈으로
        </a>
      </div>
    </div>
  );
}
