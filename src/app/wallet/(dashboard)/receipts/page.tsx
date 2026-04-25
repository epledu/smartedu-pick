"use client";

/**
 * Receipts page
 *
 * Provides a receipt OCR entry point. The user can upload a receipt image,
 * review the recognised data, and register it as a new transaction.
 * Recent transactions that include a receipt image are listed below.
 */
import React, { useEffect, useState } from "react";
import { ScanLine, FileImage } from "lucide-react";
import ReceiptUpload from "@/components/wallet/receipts/receipt-upload";
import OcrMockBanner from "@/components/wallet/receipts/ocr-mock-banner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecentReceipt {
  id: string;
  merchantName: string | null;
  amount: number;
  date: string;
  receiptImageUrl: string;
  type: "INCOME" | "EXPENSE";
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ReceiptsPage() {
  const [recentReceipts, setRecentReceipts] = useState<RecentReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch last 5 transactions that have a receipt image attached
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/transactions?hasReceipt=true&limit=5");
        if (res.ok) {
          const data = await res.json();
          setRecentReceipts(data.transactions ?? []);
        }
      } catch {
        // Non-critical — silently ignore fetch errors on this page
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /**
   * No-op callback. ReceiptUpload itself navigates to /transactions with all
   * prefill query parameters (including ?new=true) when the user clicks the
   * "use this data" button. We intentionally do NOT navigate again here to
   * avoid double redirects and dropped query params.
   */
  function handleRecognized() {
    // Could refresh recentReceipts list in the future when navigation is removed.
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      {/* OCR mock mode warning banner */}
      <OcrMockBanner />

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-50">
          <ScanLine className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">영수증 OCR</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            영수증 사진을 업로드하면 금액·가맹점·날짜를 자동으로 인식합니다.
          </p>
        </div>
      </div>

      {/* Feature description card */}
      <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-5 py-4 text-sm text-indigo-800 space-y-1">
        <p className="font-semibold">사용 방법</p>
        <ol className="list-decimal list-inside space-y-0.5 text-indigo-700">
          <li>아래 영역에 영수증 사진을 드래그하거나 클릭해 선택합니다.</li>
          <li><span className="font-medium">인식하기</span> 버튼을 누릅니다.</li>
          <li>인식된 정보를 확인 후 <span className="font-medium">이 내용으로 거래 등록</span>을 누릅니다.</li>
        </ol>
      </div>

      {/* Main upload area */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <ReceiptUpload onRecognized={handleRecognized} />
      </div>

      {/* Recent recognised receipts */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FileImage className="w-4 h-4 text-gray-400" />
          최근 인식한 영수증
        </h2>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-6">불러오는 중…</p>
        ) : recentReceipts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
            아직 등록된 영수증이 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {recentReceipts.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.receiptImageUrl}
                    alt="영수증 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {r.merchantName ?? "가맹점 불명"}
                  </p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>

                {/* Amount */}
                <p
                  className={`text-sm font-semibold ${
                    r.type === "EXPENSE" ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {r.type === "EXPENSE" ? "-" : "+"}
                  ₩{r.amount.toLocaleString("ko-KR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
