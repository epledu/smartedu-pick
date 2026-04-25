"use client";

/**
 * Transactions page
 *
 * Displays the full transaction history with filters and a modal form
 * for creating or editing entries.
 */
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import TransactionList from "@/components/wallet/transactions/transaction-list";
import TransactionForm, { type TransactionFormData, type FormCategory, type FormAccount } from "@/components/wallet/transactions/transaction-form";
import { useTransactions, type Transaction } from "@/hooks/wallet/use-transactions";
import { useCategories } from "@/hooks/wallet/use-categories";
import { useAccounts } from "@/hooks/wallet/use-accounts";
import ExportButton from "@/components/wallet/export/export-button";

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

interface FilterState {
  type: "" | "INCOME" | "EXPENSE";
  dateFrom: string;
  dateTo: string;
}

// ---------------------------------------------------------------------------
// Inner component — isolated so useSearchParams() can be wrapped in Suspense
// ---------------------------------------------------------------------------

function TransactionsPageInner() {
  const { transactions, loading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  // Load categories and accounts from API
  const { categories: rawCategories, loading: categoriesLoading } = useCategories();
  const { accounts: rawAccounts, loading: accountsLoading } = useAccounts();

  // Map hook data to form-compatible types (shapes are compatible — just assert)
  const categories: FormCategory[] = rawCategories as FormCategory[];
  const accounts: FormAccount[] = rawAccounts as FormAccount[];

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterState>({ type: "", dateFrom: "", dateTo: "" });

  // Read query params for auto-open and OCR prefill
  const searchParams = useSearchParams();

  // Auto-open modal when ?new=true is present in the URL
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setEditTarget(null);
      setShowModal(true);
    }
  }, [searchParams]);

  // Build prefill data from OCR receipt query params
  const prefillAmount = searchParams.get("prefillAmount");
  const prefillMerchant = searchParams.get("prefillMerchant");
  const prefillDate = searchParams.get("prefillDate");
  const prefillFromReceipt = searchParams.get("prefillFromReceipt") === "1";

  // Receipt image URL (potentially large base64 data URL) is stored in
  // sessionStorage to avoid exceeding the browser URL length limit.
  const [pendingReceiptImageUrl, setPendingReceiptImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (prefillFromReceipt && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pendingReceiptImageUrl");
      if (stored) {
        setPendingReceiptImageUrl(stored);
        // Consume the value once read so it doesn't leak to the next visit
        sessionStorage.removeItem("pendingReceiptImageUrl");
      }
    }
  }, [prefillFromReceipt]);

  const receiptPrefill: Partial<TransactionFormData> | undefined =
    prefillAmount || prefillMerchant || prefillDate || pendingReceiptImageUrl
      ? {
          amount: prefillAmount ? Number(prefillAmount) : undefined,
          merchantName: prefillMerchant ?? undefined,
          date: prefillDate ?? undefined,
          receiptImageUrl: pendingReceiptImageUrl,
        }
      : undefined;

  useEffect(() => {
    fetchTransactions({
      type: filters.type || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    });
  }, [filters, fetchTransactions]);

  function handleEdit(transaction: Transaction) {
    setEditTarget(transaction);
    setShowModal(true);
  }

  function handleAdd() {
    setEditTarget(null);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditTarget(null);
  }

  async function handleSubmit(data: TransactionFormData) {
    if (editTarget) {
      await updateTransaction(editTarget.id, data);
    } else {
      await createTransaction(data);
    }
    handleCloseModal();
  }

  async function handleDelete(id: string) {
    await deleteTransaction(id);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header — dark mode: sticky header background and border */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">거래내역</h1>
          <div className="flex items-center gap-2">
            <ExportButton
              defaultDateFrom={filters.dateFrom || undefined}
              defaultDateTo={filters.dateTo || undefined}
            />
            <Button size="sm" onClick={handleAdd} className="gap-1.5">
              <Plus size={16} />
              새 거래
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-4 pb-3 max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {/* Type filter */}
            {(["", "INCOME", "EXPENSE"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilters((f) => ({ ...f, type: t }))}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filters.type === t
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {t === "" ? "전체" : t === "INCOME" ? "수입" : "지출"}
              </button>
            ))}

            {/* Date range */}
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="shrink-0 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <span className="shrink-0 self-center text-gray-400 dark:text-gray-500 text-xs">~</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="shrink-0 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>
      </header>

      {/* List */}
      {/* Dark mode: main content area */}
      <main className="max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-[calc(100vh-120px)]">
        {/* Accounts empty state — guide user to register accounts first */}
        {!accountsLoading && accounts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
            <p className="text-gray-500 text-sm">계좌를 먼저 등록해주세요.</p>
            <Link
              href="/wallet/accounts"
              className="text-blue-500 text-sm font-medium underline underline-offset-2"
            >
              계좌 관리 바로가기
            </Link>
          </div>
        )}
        {/* Categories empty state */}
        {!categoriesLoading && categories.length === 0 && accounts.length > 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
            <p className="text-gray-500 text-sm">카테고리가 없습니다.</p>
            <Link
              href="/wallet/categories"
              className="text-blue-500 text-sm font-medium underline underline-offset-2"
            >
              카테고리 관리 바로가기
            </Link>
          </div>
        )}
        <TransactionList
          transactions={transactions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal — bottom sheet on mobile, centered dialog on sm+. Dark mode: inner sheet */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div
            className="
              bg-white dark:bg-gray-900 w-full sm:max-w-lg
              rounded-t-3xl sm:rounded-2xl
              p-6
              max-h-[92vh] sm:max-h-[90vh]
              overflow-y-auto
              slide-up sm:animate-none
            "
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          >
            {/* Drag indicator — mobile only */}
            <div className="sm:hidden w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />

            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {editTarget ? "거래 수정" : "새 거래 추가"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>

            {/* Show loading indicator while categories/accounts are being fetched */}
            {(categoriesLoading || accountsLoading) ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                로딩 중...
              </div>
            ) : (
              <TransactionForm
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
                categories={categories}
                accounts={accounts}
                initialData={
                  editTarget
                    ? {
                        type: editTarget.type === "TRANSFER" ? "EXPENSE" : editTarget.type,
                        amount: Number(editTarget.amount),
                        date: editTarget.date.slice(0, 10),
                        categoryId: editTarget.categoryId,
                        accountId: editTarget.accountId,
                        merchantName: editTarget.merchantName ?? undefined,
                        memo: editTarget.memo ?? undefined,
                      }
                    : receiptPrefill
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component — wraps inner component in Suspense for useSearchParams()
// ---------------------------------------------------------------------------

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16 text-gray-400 text-sm">불러오는 중...</div>}>
      <TransactionsPageInner />
    </Suspense>
  );
}
