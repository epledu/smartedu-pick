"use client";

/**
 * ReceiptTrigger
 *
 * Renders a button that opens a modal containing ReceiptUpload.
 * Calls `onFill` with the recognised values so TransactionForm can
 * pre-populate its fields without owning the modal state itself.
 */
import React, { useState } from "react";
import { ScanLine, X } from "lucide-react";
import ReceiptUpload, { RecognizedReceipt } from "@/components/wallet/receipts/receipt-upload";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReceiptPrefill {
  amount: number;
  merchantName: string;
  date: string;
  imageUrl: string;
}

interface Props {
  onFill: (data: ReceiptPrefill) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReceiptTrigger({ onFill }: Props) {
  const [open, setOpen] = useState(false);

  function handleRecognized(data: RecognizedReceipt) {
    onFill({
      amount: data.amount,
      merchantName: data.merchantName,
      date: data.date,
      imageUrl: data.imageUrl,
    });
    setOpen(false);
  }

  return (
    <>
      {/* Trigger button — replaces the old "준비 중" placeholder */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 rounded-lg py-3 text-sm text-indigo-500 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
      >
        <ScanLine className="w-4 h-4" />
        영수증으로 자동 입력
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">영수증 OCR 자동 입력</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ReceiptUpload onRecognized={handleRecognized} />
          </div>
        </div>
      )}
    </>
  );
}
