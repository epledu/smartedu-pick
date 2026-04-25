"use client";

/**
 * Offline fallback page.
 *
 * Served by the service worker when the user navigates to any route
 * while the network is unavailable and the page is not in the cache.
 * Must be a Client Component because the retry button uses window.location.
 */
export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-amber-50 px-6 text-center">
      <span className="text-7xl" role="img" aria-label="일기장">
        📖
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-amber-900">지갑일기</h1>
        <p className="text-gray-600 text-base">인터넷 연결이 끊겼습니다</p>
        <p className="text-gray-400 text-sm">
          연결이 복구되면 자동으로 다시 사용할 수 있습니다.
        </p>
      </div>

      {/* Retry triggers a full page reload; the SW will serve cached content if available */}
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-amber-800 text-white font-semibold rounded-2xl shadow hover:bg-amber-700 active:scale-95 transition-all"
      >
        다시 시도
      </button>

      <p className="text-xs text-gray-300 mt-4">
        오프라인 상태 · 기록된 데이터는 유지됩니다
      </p>
    </main>
  );
}
