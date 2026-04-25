"use client";

/**
 * TransactionForm
 *
 * Input form for creating or editing a transaction.
 * Supports income / expense toggle, amount, date, category, account,
 * merchant name, and memo fields.
 */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/wallet/ui/button";
import { cn } from "@/lib/wallet/utils";
import ReceiptTrigger, { ReceiptPrefill } from "./receipt-trigger";
import AdvisorWidget from "@/components/wallet/payment-advisor/advisor-widget";
import { useCategorySuggestion } from "@/hooks/wallet/use-category-suggestion";
import CategorySuggestionChip from "./category-suggestion-chip";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FormCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface FormAccount {
  id: string;
  name: string;
  type: string;
}

export interface TransactionFormData {
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  merchantName?: string;
  memo?: string;
  /** Receipt image URL — carried through OCR pre-fill flow */
  receiptImageUrl?: string;
}

interface Props {
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  onCancel: () => void;
  initialData?: Partial<TransactionFormData>;
  categories: FormCategory[];
  accounts: FormAccount[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function formatAmountDisplay(raw: string): string {
  const num = raw.replace(/\D/g, "");
  return num ? Number(num).toLocaleString("ko-KR") : "";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransactionForm({
  onSubmit,
  onCancel,
  initialData,
  categories,
  accounts,
}: Props) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type ?? "EXPENSE"
  );
  const [amountRaw, setAmountRaw] = useState(
    initialData?.amount ? String(initialData.amount) : ""
  );
  const [date, setDate] = useState(initialData?.date ?? today());
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [accountId, setAccountId] = useState(initialData?.accountId ?? "");
  const [merchantName, setMerchantName] = useState(initialData?.merchantName ?? "");
  const [memo, setMemo] = useState(initialData?.memo ?? "");
  // Hidden field — preserved through pre-fill flow so it gets POSTed to API
  const [receiptImageUrl] = useState<string | undefined>(initialData?.receiptImageUrl);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Category auto-suggestion based on merchant name + memo
  const { suggestion } = useCategorySuggestion(merchantName, memo);

  // Auto-apply when category is empty and confidence is high enough
  const AUTO_APPLY_THRESHOLD = 0.85;
  const showSuggestion =
    suggestion !== null &&
    suggestion.categoryId !== categoryId;

  // Auto-apply suggestion when category is unset and confidence exceeds threshold
  useEffect(() => {
    if (suggestion && !categoryId && suggestion.confidence >= AUTO_APPLY_THRESHOLD) {
      setCategoryId(suggestion.categoryId);
    }
  }, [suggestion, categoryId]);

  // Pre-fill fields from OCR receipt recognition
  function handleReceiptFill(data: ReceiptPrefill) {
    setAmountRaw(String(data.amount));
    setMerchantName(data.merchantName);
    setDate(data.date);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!amountRaw || Number(amountRaw.replace(/\D/g, "")) <= 0) {
      next.amount = "금액을 입력해주세요.";
    }
    if (!categoryId) next.categoryId = "카테고리를 선택해주세요.";
    if (!accountId) next.accountId = "계좌를 선택해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: Number(amountRaw.replace(/\D/g, "")),
        date,
        categoryId,
        accountId,
        merchantName: merchantName || undefined,
        memo: memo || undefined,
        receiptImageUrl,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // py-3 on mobile for 44px+ tap targets; py-2 on sm+
  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-3 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle — 44px+ tap target */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        {(["EXPENSE", "INCOME"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "flex-1 py-3 sm:py-2.5 text-sm font-medium transition-colors min-h-[44px]",
              type === t
                ? t === "EXPENSE"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            {t === "INCOME" ? "수입" : "지출"}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">금액</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            ₩
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatAmountDisplay(amountRaw)}
            onChange={(e) => setAmountRaw(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className={cn(inputClass, "pl-7 text-right text-xl font-semibold", errors.amount && "border-red-400")}
          />
        </div>
        {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={cn(inputClass, errors.categoryId && "border-red-400")}
        >
          <option value="">카테고리 선택</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon ? `${c.icon} ` : ""}{c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
        {/* Suggestion chip — shown when classifier result differs from current category */}
        {showSuggestion && (
          <CategorySuggestionChip
            suggestion={suggestion}
            onApply={(id) => {
              setCategoryId(id);
              // Clear category validation error when user accepts suggestion
              setErrors((prev) => ({ ...prev, categoryId: "" }));
            }}
          />
        )}
      </div>

      {/* Account */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">결제 수단</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className={cn(inputClass, errors.accountId && "border-red-400")}
        >
          <option value="">계좌 선택</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {errors.accountId && <p className="text-xs text-red-500 mt-1">{errors.accountId}</p>}
      </div>

      {/* Merchant name */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">가맹점명 (선택)</label>
        <input
          type="text"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
          placeholder="예: 스타벅스"
          className={inputClass}
        />
        {/* Payment advisor widget — shows top recommendations when merchant is typed */}
        {merchantName && (
          <AdvisorWidget
            merchantName={merchantName}
            amount={amountRaw ? Number(amountRaw) : undefined}
            className="mt-2"
          />
        )}
      </div>

      {/* Memo */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">메모 (선택)</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
          rows={2}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      {/* Receipt OCR auto-fill */}
      <ReceiptTrigger onFill={handleReceiptFill} />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          취소
        </Button>
        <Button type="submit" isLoading={submitting} className="flex-1">
          저장
        </Button>
      </div>
    </form>
  );
}
