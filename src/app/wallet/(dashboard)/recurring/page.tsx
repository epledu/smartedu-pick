"use client";

/**
 * Recurring expenses page (/recurring)
 *
 * - "고정 지출" header with global "지금 실행" and "추가" buttons
 * - Monthly total summary card with per-account breakdown
 * - RecurringList with per-row run confirmation
 * - Add/edit modal (RecurringForm) with active-only accounts
 */
import React, { useEffect, useState } from "react";
import { Plus, Play, X } from "lucide-react";
import RecurringList from "@/components/wallet/recurring/recurring-list";
import RecurringForm, {
  type RecurringFormData,
  type FormCategory,
  type FormAccount,
} from "@/components/wallet/recurring/recurring-form";
import { useRecurring, type RecurringExpense } from "@/hooks/wallet/use-recurring";

// ---------------------------------------------------------------------------
// Monthly total helpers
// ---------------------------------------------------------------------------

function monthlyEquivalent(expense: RecurringExpense): number {
  const amt = Number(expense.amount);
  switch (expense.frequency) {
    case "DAILY":   return amt * 30;
    case "WEEKLY":  return amt * 4;
    case "MONTHLY": return amt;
    case "YEARLY":  return amt / 12;
    default:        return amt;
  }
}

function formatKRW(value: number): string {
  return "₩" + new Intl.NumberFormat("ko-KR").format(Math.round(value));
}

/** Returns per-account monthly totals for active recurring expenses. */
function buildAccountTotals(
  items: RecurringExpense[]
): { name: string; total: number }[] {
  const map = new Map<string, { name: string; total: number }>();
  for (const e of items) {
    if (!e.isActive) continue;
    const key = e.accountId;
    const name = e.account?.name ?? "기타";
    const existing = map.get(key);
    if (existing) {
      existing.total += monthlyEquivalent(e);
    } else {
      map.set(key, { name, total: monthlyEquivalent(e) });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function RecurringPage() {
  const {
    recurring,
    loading,
    error,
    fetchRecurring,
    createRecurring,
    updateRecurring,
    deleteRecurring,
    runRecurring,
  } = useRecurring();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<RecurringExpense | null>(null);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const [categories, setCategories] = useState<FormCategory[]>([]);
  const [accounts, setAccounts] = useState<FormAccount[]>([]);

  useEffect(() => {
    fetchRecurring();

    // Fetch categories for form selector
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: FormCategory[]) => setCategories(data))
      .catch(() => {});

    // Fetch only active accounts (API filters isActive=true by default)
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((data: FormAccount[]) => setAccounts(data))
      .catch(() => {});
  }, [fetchRecurring]);

  // Monthly total across all active recurring expenses
  const totalMonthly = recurring
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + monthlyEquivalent(e), 0);

  const accountTotals = buildAccountTotals(recurring);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  async function handleGlobalRun() {
    setRunning(true);
    setRunStatus(null);
    const result = await runRecurring();
    setRunning(false);
    setRunStatus(result ? `${result.processed}건 처리 완료` : "처리 중 오류가 발생했습니다.");
  }

  async function handleRowRun(expense: RecurringExpense) {
    const result = await runRecurring();
    if (result) {
      setRunStatus(`${expense.description} 실행 완료`);
    }
  }

  function handleAdd() {
    setEditTarget(null);
    setShowModal(true);
  }

  function handleEdit(expense: RecurringExpense) {
    setEditTarget(expense);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditTarget(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 고정 지출을 삭제하시겠습니까?")) return;
    await deleteRecurring(id);
  }

  async function handleToggleActive(expense: RecurringExpense) {
    await updateRecurring(expense.id, { isActive: !expense.isActive });
  }

  async function handleSubmit(data: RecurringFormData) {
    if (editTarget) {
      await updateRecurring(editTarget.id, data);
    } else {
      await createRecurring(data);
    }
    handleCloseModal();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <h1 className="text-lg font-bold text-gray-900">고정 지출</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGlobalRun}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {running ? "처리 중..." : "지금 실행"}
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
        </div>

        {/* Run status toast */}
        {runStatus && (
          <div className="px-4 pb-3 max-w-2xl mx-auto">
            <p className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
              {runStatus}
            </p>
          </div>
        )}
      </header>

      {/* Summary card with per-account breakdown */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">총 월 고정 지출 (활성)</p>
          <p className="text-2xl font-bold text-red-500">{formatKRW(totalMonthly)}</p>

          {/* Per-account breakdown */}
          {accountTotals.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {accountTotals.map(({ name, total }) => (
                <span key={name} className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{name}</span>{" "}
                  {formatKRW(total)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 mt-3">
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        </div>
      )}

      {/* List */}
      <main className="max-w-2xl mx-auto mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <RecurringList
          recurring={recurring}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onRun={handleRowRun}
        />
      </main>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">
                {editTarget ? "고정 지출 수정" : "고정 지출 추가"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <RecurringForm
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              categories={categories}
              accounts={accounts}
              initialData={
                editTarget
                  ? {
                      accountId: editTarget.accountId,
                      categoryId: editTarget.categoryId,
                      amount: Number(editTarget.amount),
                      description: editTarget.description,
                      frequency: editTarget.frequency,
                      dayOfMonth: editTarget.dayOfMonth ?? undefined,
                      nextDueDate: editTarget.nextDueDate,
                      isActive: editTarget.isActive,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
