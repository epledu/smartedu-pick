"use client";

/**
 * PWA install prompt banner.
 *
 * - Chrome/Edge/Android: listens for the `beforeinstallprompt` event and
 *   shows a native install button.
 * - iOS Safari: detected via user-agent; shows manual "Share → Add to Home"
 *   instructions since iOS does not fire `beforeinstallprompt`.
 * - Dismissal is stored in localStorage and respected for 30 days.
 */
import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

// Key used to persist dismissal timestamp in localStorage
const DISMISS_KEY = "pwa-install-dismissed-at";
// How long (ms) to wait before showing the banner again after dismissal
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type BannerVariant = "chromium" | "ios" | null;

export default function InstallPrompt() {
  const [variant, setVariant] = useState<BannerVariant>(null);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Skip if recently dismissed
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < DISMISS_DURATION_MS) return;
    }

    // Skip if already running as standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // iOS Safari detection
    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone;

    if (isIos) {
      setVariant("ios");
      return;
    }

    // Chrome / Edge / Android: listen for install prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVariant("chromium");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVariant(null);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVariant(null);
  };

  if (!variant) return null;

  return (
    <div
      role="banner"
      aria-label="앱 설치 안내"
      className="fixed top-0 inset-x-0 z-50 bg-amber-800 text-white shadow-lg safe-top"
    >
      <div className="flex items-start gap-3 px-4 py-3 max-w-2xl mx-auto">
        <span className="text-2xl shrink-0 mt-0.5">📱</span>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug">
            홈 화면에 지갑일기 설치하기
          </p>

          {variant === "chromium" && (
            <p className="text-amber-200 text-xs mt-0.5">
              앱처럼 빠르게 실행할 수 있습니다.
            </p>
          )}

          {variant === "ios" && (
            <p className="text-amber-200 text-xs mt-0.5 flex items-center gap-1 flex-wrap">
              <Share className="w-3.5 h-3.5 shrink-0" />
              <span>공유 버튼 탭 →</span>
              <span className="font-medium text-white">홈 화면에 추가</span>
              <span>선택</span>
            </p>
          )}
        </div>

        {variant === "chromium" && (
          <button
            onClick={handleInstall}
            disabled={installing}
            aria-label="앱 설치"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-amber-800 text-xs font-semibold rounded-lg shrink-0 hover:bg-amber-50 transition-colors disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            {installing ? "설치 중..." : "설치"}
          </button>
        )}

        <button
          onClick={handleDismiss}
          aria-label="닫기"
          className="shrink-0 p-1 rounded-md hover:bg-amber-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
