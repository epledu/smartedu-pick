"use client";

/**
 * PwaSection — shows PWA installation status and per-platform install guidance.
 * Rendered inside the Settings page to help users install the app.
 */
import { useEffect, useState } from "react";
import { Smartphone, Monitor, CheckCircle2, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";

type InstallState = "installed" | "web" | "unknown";

// Detect iOS Safari without the standalone flag (not yet installed)
function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window.navigator as { standalone?: boolean }).standalone
  );
}

// Detect Android Chrome (can receive beforeinstallprompt)
function isAndroidChrome(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent) && /chrome/i.test(navigator.userAgent);
}

export default function PwaSection() {
  const [installState, setInstallState] = useState<InstallState>("unknown");

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstallState("installed");
    } else {
      setInstallState("web");
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          앱 설치
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current installation status badge */}
        <div className="flex items-center gap-2">
          {installState === "installed" ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-sm text-green-700 font-medium">설치됨 — 앱으로 실행 중</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600">웹 버전 사용 중</span>
            </>
          )}
        </div>

        {/* Show install instructions only when not yet installed */}
        {installState === "web" && (
          <div className="space-y-3">
            {/* iOS Safari instructions */}
            {isIosSafari() && (
              <InstallGuide
                icon="🍎"
                title="iPhone / iPad (Safari)"
                steps={[
                  "하단 공유 버튼(□↑)을 탭하세요",
                  "'홈 화면에 추가'를 선택하세요",
                  "'추가'를 탭하면 완료!",
                ]}
              />
            )}

            {/* Android Chrome instructions */}
            {isAndroidChrome() && (
              <InstallGuide
                icon="🤖"
                title="Android (Chrome)"
                steps={[
                  "주소창 옆 메뉴(⋮)를 탭하세요",
                  "'앱 설치' 또는 '홈 화면에 추가'를 선택하세요",
                  "팝업에서 '설치'를 탭하면 완료!",
                ]}
              />
            )}

            {/* Generic fallback for desktop or unknown */}
            {!isIosSafari() && !isAndroidChrome() && (
              <InstallGuide
                icon="💻"
                title="데스크톱 (Chrome / Edge)"
                steps={[
                  "주소창 오른쪽 설치 아이콘(⊕)을 클릭하세요",
                  "'설치'를 클릭하면 완료!",
                  "없다면 메뉴(⋮) → '지갑일기 설치'를 선택하세요",
                ]}
              />
            )}

            {/* Benefits note */}
            <div className="flex gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span>
                설치하면 브라우저 주소창 없이 앱처럼 빠르게 실행되고,
                오프라인에서도 최근 데이터를 볼 수 있습니다.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

interface InstallGuideProps {
  icon: string;
  title: string;
  steps: string[];
}

function InstallGuide({ icon, title, steps }: InstallGuideProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
      <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <span>{icon}</span>
        {title}
      </p>
      <ol className="space-y-1 pl-4 list-decimal">
        {steps.map((step, i) => (
          <li key={i} className="text-xs text-gray-600">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
