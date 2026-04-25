"use client";

/**
 * Login page — social OAuth sign-in with Google, Kakao, and Naver.
 * Fetches /api/auth/providers-status to show which providers are configured.
 * Unconfigured providers display a "설정 필요" badge and show a tooltip on click.
 */
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProvidersStatus {
  google: boolean;
  kakao: boolean;
  naver: boolean;
  isDev: boolean;
}

interface ProviderDef {
  id: "google" | "kakao" | "naver";
  label: string;
  bg: string;
  disabledBg: string;
  textColor: string;
  icon: React.ReactNode;
}

// ---------------------------------------------------------------------------
// In-app browser detection
// Google OAuth rejects these user agents with "disallowed_useragent" (403).
// ---------------------------------------------------------------------------

/**
 * Detects environments where Google OAuth will refuse to authorize:
 * - Korean messaging app in-app browsers (카카오톡, 라인, 네이버)
 * - Instagram / Facebook / Twitter in-app browsers
 * - Generic WebView indicators (wv)
 * - PWA standalone mode on some platforms
 */
function detectBlockedUA(): { blocked: boolean; platform: string } {
  if (typeof window === "undefined") return { blocked: false, platform: "" };
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("kakaotalk")) return { blocked: true, platform: "카카오톡" };
  if (ua.includes("naver")) return { blocked: true, platform: "네이버앱" };
  if (ua.includes("line/")) return { blocked: true, platform: "라인" };
  if (ua.includes("instagram")) return { blocked: true, platform: "인스타그램" };
  if (ua.includes("fbav") || ua.includes("fban")) return { blocked: true, platform: "페이스북" };
  if (ua.includes("twitter")) return { blocked: true, platform: "X(트위터)" };
  if (ua.includes("daum")) return { blocked: true, platform: "다음앱" };
  if (ua.match(/; wv\)/)) return { blocked: true, platform: "앱 내부 브라우저" };

  return { blocked: false, platform: "" };
}

// ---------------------------------------------------------------------------
// Provider button definitions
// ---------------------------------------------------------------------------

const PROVIDERS: ProviderDef[] = [
  {
    id: "google",
    label: "Google로 계속하기",
    bg: "bg-red-500 hover:bg-red-600",
    disabledBg: "bg-red-200 cursor-not-allowed",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    id: "kakao",
    label: "카카오로 계속하기",
    bg: "bg-yellow-400 hover:bg-yellow-500",
    disabledBg: "bg-yellow-100 cursor-not-allowed",
    textColor: "text-gray-900",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3C6.48 3 2 6.58 2 11c0 2.76 1.67 5.2 4.22 6.72L5.4 21l4.02-2.13C10.26 19.27 11.12 19.4 12 19.4c5.52 0 10-3.58 10-8.4S17.52 3 12 3z" />
      </svg>
    ),
  },
  {
    id: "naver",
    label: "네이버로 계속하기",
    bg: "bg-green-500 hover:bg-green-600",
    disabledBg: "bg-green-200 cursor-not-allowed",
    textColor: "text-white",
    icon: (
      <span className="w-5 h-5 font-bold text-sm flex items-center justify-center" aria-hidden="true">
        N
      </span>
    ),
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const [status, setStatus] = useState<ProvidersStatus | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [uaWarning, setUaWarning] = useState<{ blocked: boolean; platform: string }>({
    blocked: false,
    platform: "",
  });
  const [copied, setCopied] = useState(false);

  // Fetch which providers are configured on mount
  useEffect(() => {
    fetch("/api/auth/providers-status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {
        // If fetch fails, assume all providers are configured to avoid blocking UI
        setStatus({ google: true, kakao: true, naver: true, isDev: false });
      });
  }, []);

  // Detect in-app browsers that Google OAuth rejects
  useEffect(() => {
    setUaWarning(detectBlockedUA());
  }, []);

  // Copy current URL to clipboard so user can paste in a real browser
  function handleCopyUrl() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      },
      () => {
        // Clipboard API failed — fallback to showing prompt
        window.prompt("아래 주소를 복사해서 Chrome/Safari에 붙여넣으세요:", window.location.href);
      }
    );
  }

  const isConfigured = (id: ProviderDef["id"]): boolean => {
    if (!status) return true; // optimistic while loading
    return status[id];
  };

  const noneConfigured =
    status !== null && !status.google && !status.kakao && !status.naver && !status.isDev;

  const handleProviderClick = (provider: ProviderDef) => {
    if (!isConfigured(provider.id)) {
      setTooltip(provider.id);
      setTimeout(() => setTooltip(null), 3000);
      return;
    }
    signIn(provider.id, { callbackUrl: "/wallet" });
  };

  return (
    // Dark mode: gradient background adapts to near-black tones
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 px-4">
      {/* Dark mode: card background */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">지갑일기 📖</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">오늘 지갑에 무슨 일이 있었나요?</p>
        </div>

        {/* In-app browser warning — Google OAuth rejects these user agents */}
        {uaWarning.blocked && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 space-y-2">
            <p className="font-semibold">⚠️ 외부 브라우저가 필요합니다</p>
            <p>
              {uaWarning.platform} 내부 브라우저에서는 Google이 로그인을 차단합니다
              <br />
              (disallowed_useragent 정책).
            </p>
            <p className="font-medium">아래 방법으로 로그인해주세요:</p>
            <ol className="list-decimal list-inside space-y-1 text-red-700">
              <li>우측 상단 메뉴 → <strong>외부 브라우저로 열기</strong> 또는</li>
              <li>주소 복사 후 Chrome/Safari에 붙여넣기</li>
            </ol>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="mt-1 w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              {copied ? "✓ 주소가 복사되었습니다" : "📋 주소 복사하기"}
            </button>
          </div>
        )}

        {/* Warning card when no providers are configured in production */}
        {noneConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-1">
            <p className="font-semibold">⚠️ OAuth 설정이 필요합니다</p>
            <p>로그인을 사용하려면 OAuth 키를 환경변수에 설정해야 합니다.</p>
            <a
              href="/OAUTH_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-amber-700 hover:text-amber-900"
            >
              OAUTH_SETUP.md 설정 가이드 보기 →
            </a>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 dark:text-gray-500">
            {/* Dark mode: divider label background matches card */}
            <span className="bg-white dark:bg-gray-900 px-3">소셜 계정으로 로그인</span>
          </div>
        </div>

        {/* Dev login — only visible in development */}
        {status?.isDev && (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() =>
                signIn("credentials", {
                  email: "demo@smartbudget.app",
                  callbackUrl: "/wallet",
                })
              }
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors duration-150 bg-gray-900 hover:bg-gray-800 text-white"
            >
              📖 데모 계정으로 시작하기
            </button>
            <p className="text-center text-xs text-gray-400">개발 환경에서만 사용 가능</p>
          </div>
        )}

        {/* Provider buttons */}
        <div className="space-y-3">
          {PROVIDERS.map((provider) => {
            const configured = isConfigured(provider.id);
            const showTooltip = tooltip === provider.id;

            return (
              <div key={provider.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleProviderClick(provider)}
                  aria-disabled={!configured}
                  className={`
                    w-full flex items-center justify-center gap-3 px-4 py-3
                    rounded-xl font-medium text-sm transition-colors duration-150
                    ${configured ? `${provider.bg} ${provider.textColor}` : `${provider.disabledBg} ${provider.textColor} opacity-60`}
                  `}
                >
                  {provider.icon}
                  <span>{provider.label}</span>
                  {/* Badge shown when provider is not configured */}
                  {!configured && (
                    <span className="ml-auto text-[10px] font-semibold bg-white/80 text-gray-600 px-1.5 py-0.5 rounded-full">
                      설정 필요
                    </span>
                  )}
                </button>

                {/* Tooltip on click when unconfigured */}
                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 whitespace-nowrap bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                    관리자가 OAuth 키를 설정하지 않았습니다
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
        </p>
      </div>
    </div>
  );
}
