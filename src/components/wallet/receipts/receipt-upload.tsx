"use client";

/**
 * ReceiptUpload
 *
 * Drag-and-drop / file-picker component that uploads a receipt image to
 * /api/ocr, displays a preview and the recognition result, then exposes
 * the OCR data to the parent via `onRecognized`.
 *
 * Shows a provider badge indicating whether Google Vision or the mock
 * backend was used.
 */
import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle, AlertCircle, Eye, FlaskConical } from "lucide-react";
import type { OCRResult } from "@/lib/wallet/ocr-mock";
import type { OCRProvider } from "@/lib/wallet/ocr";
import { cn } from "@/lib/wallet/utils";
import { Button } from "@/components/wallet/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DebugInfo {
  rawText: string;
  candidates: Array<{ value: number; priority: number; reason: string }>;
}

export type RecognizedReceipt = OCRResult & {
  imageUrl: string;
  provider?: OCRProvider;
  _debug?: DebugInfo;
};

interface Props {
  onRecognized: (data: RecognizedReceipt) => void;
}

type Status = "idle" | "selected" | "loading" | "done" | "error";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 90
      ? "bg-green-100 text-green-700"
      : pct >= 80
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", color)}>
      신뢰도 {pct}%
    </span>
  );
}

/** Badge that shows which OCR backend produced the result. */
function ProviderBadge({ provider }: { provider?: OCRProvider }) {
  if (provider === "google-vision") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
        <Eye className="w-3 h-3" />
        실제 인식 (Google Vision)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
      <FlaskConical className="w-3 h-3" />
      샘플 데이터 (Mock)
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReceiptUpload({ onRecognized }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RecognizedReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);

  // Accept a file object and prepare the preview
  const acceptFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("selected");
    setResult(null);
    setErrorMsg("");
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) acceptFile(f);
  }

  async function handleRecognize() {
    if (!file) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch("/api/ocr", { method: "POST", body });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `서버 오류 (${res.status})`);
      }

      const { imageUrl, ocrResult, provider } = await res.json();
      const recognized: RecognizedReceipt = { ...ocrResult, imageUrl, provider };
      setResult(recognized);
      setStatus("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  /**
   * Navigate to /transactions with OCR data pre-filled.
   *
   * The receipt image URL can be a base64 data URL (Vercel fallback) which
   * easily exceeds the browser URL length limit (~32KB → "about:blank#blocked"
   * in Chrome). We persist the imageUrl in sessionStorage and pass only a
   * short flag in the query string to avoid that.
   */
  function handleUseResult() {
    if (!result) return;
    // Notify parent for any side-effect it may want
    onRecognized(result);

    // Stash the (potentially huge) image URL in sessionStorage
    try {
      sessionStorage.setItem("pendingReceiptImageUrl", result.imageUrl);
    } catch {
      // Storage quota / disabled — fall through; transactions page handles missing value
    }

    const params = new URLSearchParams({
      new: "true",
      prefillAmount: String(result.amount),
      prefillMerchant: result.merchantName,
      prefillDate: result.date,
      prefillFromReceipt: "1",
    });
    router.push(`/wallet/transactions?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
          dragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
        )}
      >
        {preview ? (
          <div className="relative w-40 h-40">
            <Image
              src={preview}
              alt="선택한 영수증 이미지"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gray-300" />
            <p className="text-sm text-gray-500 text-center">
              영수증 사진을 드래그하거나{" "}
              <span className="text-indigo-600 font-medium">클릭하여 선택</span>
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG, HEIC 등 이미지 파일 (최대 10MB)
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Recognise button */}
      {(status === "selected" || status === "error") && (
        <Button onClick={handleRecognize} className="w-full">
          인식하기
        </Button>
      )}

      {/* Loading state */}
      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          영수증을 인식하는 중입니다…
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="flex flex-col gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">인식 실패</span>
          </div>
          <p>{errorMsg}</p>
          <p className="text-xs text-red-400">
            이미지를 다시 선택하거나 잠시 후 다시 시도해주세요.
          </p>
        </div>
      )}

      {/* OCR result */}
      {status === "done" && result && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle className="w-4 h-4" />
              인식 완료
            </div>
            <div className="flex items-center gap-2">
              <ProviderBadge provider={result.provider} />
              <ConfidenceBadge score={result.confidence} />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">가맹점</dt>
            <dd className="font-medium text-gray-900">{result.merchantName}</dd>
            <dt className="text-gray-500">금액</dt>
            <dd className="font-semibold text-red-600">
              ₩{result.amount.toLocaleString("ko-KR")}
            </dd>
            <dt className="text-gray-500">날짜</dt>
            <dd className="text-gray-900">{result.date}</dd>
          </dl>

          {/* Debug info — only shown in development to help tune the parser */}
          {result._debug && (
            <details className="text-xs border-t border-green-200 pt-2">
              <summary className="cursor-pointer text-green-700 font-medium hover:underline">
                🔍 디버그 정보 (개발용)
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">금액 후보 (상위 5):</p>
                  <ul className="bg-white rounded p-2 text-gray-700 space-y-0.5 max-h-40 overflow-y-auto">
                    {result._debug.candidates.slice(0, 5).map((c, i) => (
                      <li key={i} className="font-mono text-[11px]">
                        ₩{c.value.toLocaleString("ko-KR")} (pri:{c.priority}) {c.reason}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold mb-1">원본 OCR 텍스트:</p>
                  <pre className="bg-white rounded p-2 text-gray-700 text-[11px] max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {result._debug.rawText}
                  </pre>
                </div>
              </div>
            </details>
          )}

          <Button onClick={handleUseResult} className="w-full mt-2">
            이 내용으로 거래 등록
          </Button>
        </div>
      )}
    </div>
  );
}
