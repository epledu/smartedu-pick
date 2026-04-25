"use client";

/**
 * OcrStatusBanner — shows OCR backend status.
 *
 * - If Google Vision API is configured: shows a green "real OCR active" banner (dismissible).
 * - If only mock is available: shows a yellow "mock mode" warning (dismissible).
 *
 * Uses localStorage so each banner state remembers its own dismissal.
 */
import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type OcrStatus = { provider: "google-vision" | "mock"; configured: boolean };

const MOCK_DISMISS_KEY = "ocr_mock_banner_dismissed";
const REAL_DISMISS_KEY = "ocr_real_banner_dismissed";

export default function OcrMockBanner() {
  const [status, setStatus] = useState<OcrStatus | null>(null);
  const [visible, setVisible] = useState(false);

  // Fetch OCR status and determine if banner should show
  useEffect(() => {
    fetch("/api/ocr/status")
      .then((r) => r.json())
      .then((data: OcrStatus) => {
        setStatus(data);
        const key = data.configured ? REAL_DISMISS_KEY : MOCK_DISMISS_KEY;
        const dismissed = localStorage.getItem(key);
        if (!dismissed) setVisible(true);
      })
      .catch(() => {});
  }, []);

  function handleDismiss() {
    if (!status) return;
    const key = status.configured ? REAL_DISMISS_KEY : MOCK_DISMISS_KEY;
    localStorage.setItem(key, "1");
    setVisible(false);
  }

  if (!visible || !status) return null;

  // Real OCR active — green success banner
  if (status.configured) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm text-green-800">
          <p className="font-semibold mb-0.5">✓ Google Vision OCR 활성화됨</p>
          <p>
            실제 영수증 이미지 분석이 작동합니다. 영수증 사진을 업로드하면 금액·가맹점·날짜를
            자동으로 인식합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-green-100 text-green-600 flex-shrink-0"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Mock mode — yellow warning banner
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm text-amber-800">
        <p className="font-semibold mb-0.5">⚠️ 개발 모드 OCR 안내</p>
        <p>
          현재 영수증 인식은 Mock 데이터입니다. 실제 이미지 분석이 아닌 샘플 금액과
          가맹점이 반환됩니다.
        </p>
        <p className="mt-0.5 text-amber-600">
          실제 OCR 연동(Google Vision API)은 .env의 GOOGLE_VISION_API_KEY를 설정하세요.
        </p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 rounded hover:bg-amber-100 text-amber-500 flex-shrink-0"
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
