"use client";

/**
 * RecurringList — displays a list of recurring expenses.
 *
 * Each row shows: icon, description, category + account badge (prominent),
 * frequency badge, amount (red), next due date, active toggle,
 * and edit/delete action buttons.
 *
 * "지금 실행" per-row button triggers a confirmation dialog showing
 * the account name and amount before proceeding.
 */
import React, { useState } from "react";
import { Pencil, Trash2, Repeat, Building2, Play } from "lucide-react";
import type { RecurringExpense } from "@/hooks/wallet/use-recurring";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  recurring: RecurringExpense[];
  loading: boolean;
  onEdit: (expense: RecurringExpense) => void;
  onDelete: (id: string) => void;
  onToggleActive: (expense: RecurringExpense) => void;
  /** Optional per-row run handler. If provided, a "지금 실행" button is shown. */
  onRun?: (expense: RecurringExpense) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "매일",
  WEEKLY: "매주",
  MONTHLY: "매월",
  YEARLY: "매년",
};

const FREQUENCY_COLORS: Record<string, string> = {
  DAILY: "bg-orange-100 text-orange-700",
  WEEKLY: "bg-blue-100 text-blue-700",
  MONTHLY: "bg-indigo-100 text-indigo-700",
  YEARLY: "bg-purple-100 text-purple-700",
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  BANK: "은행",
  CREDIT_CARD: "신용카드",
  DEBIT_CARD: "체크카드",
  CASH: "현금",
  SAVINGS: "저축",
  INVESTMENT: "투자",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function accountTypeLabel(type: string): string {
  return ACCOUNT_TYPE_LABELS[type] ?? type;
}

// ---------------------------------------------------------------------------
// Run confirmation dialog
// ---------------------------------------------------------------------------

interface RunConfirmProps {
  expense: RecurringExpense;
  onConfirm: () => void;
  onCancel: () => void;
}

function RunConfirmDialog({ expense, onConfirm, onCancel }: RunConfirmProps) {
  const accountName = expense.account?.name ?? "선택된 계좌";
  const amount = formatAmount(Number(expense.amount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-base font-bold text-gray-900 mb-2">지금 실행 확인</h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold text-gray-900">{accountName}</span>에서{" "}
          <span className="font-semibold text-red-600">{amount}</span>이 지출됩니다.
          계속하시겠습니까?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            실행
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RecurringList({
  recurring,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  onRun,
}: Props) {
  const [confirmExpense, setConfirmExpense] = useState<RecurringExpense | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);

  async function handleRunConfirmed() {
    if (!confirmExpense || !onRun) return;
    setRunningId(confirmExpense.id);
    setConfirmExpense(null);
    await onRun(confirmExpense);
    setRunningId(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (recurring.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Repeat className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">등록된 고정 지출이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-gray-100">
        {recurring.map((expense) => {
          const acctType = expense.account?.type
            ? accountTypeLabel(expense.account.type)
            : null;

          return (
            <li
              key={expense.id}
              className={`flex items-center gap-3 px-4 py-4 ${
                expense.isActive ? "" : "opacity-50"
              }`}
            >
              {/* Category icon */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: expense.category?.color
                    ? `${expense.category.color}22`
                    : "#e0e7ff",
                }}
              >
                <Repeat
                  className="w-4 h-4"
                  style={{ color: expense.category?.color ?? "#6366f1" }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {expense.description}
                </p>

                {/* Account info — prominent display */}
                {expense.account && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700">
                      {expense.account.name}
                    </span>
                    {acctType && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                        {acctType}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {expense.category?.name ?? "—"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  {/* Frequency badge */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      FREQUENCY_COLORS[expense.frequency] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {FREQUENCY_LABELS[expense.frequency] ?? expense.frequency}
                  </span>
                  {/* Next due date */}
                  <span className="text-xs text-gray-400">
                    다음: {formatDate(expense.nextDueDate)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <span className="text-sm font-bold text-red-500 flex-shrink-0">
                -{formatAmount(expense.amount)}
              </span>

              {/* Per-row run button */}
              {onRun && expense.isActive && (
                <button
                  type="button"
                  onClick={() => setConfirmExpense(expense)}
                  disabled={runningId === expense.id}
                  className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 flex-shrink-0 disabled:opacity-50"
                  aria-label="지금 실행"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}

              {/* Active toggle */}
              <button
                type="button"
                onClick={() => onToggleActive(expense)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  expense.isActive ? "bg-indigo-600" : "bg-gray-300"
                }`}
                aria-label={expense.isActive ? "비활성화" : "활성화"}
                role="switch"
                aria-checked={expense.isActive}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    expense.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => onEdit(expense)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
                aria-label="수정"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => onDelete(expense.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex-shrink-0"
                aria-label="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Run confirmation dialog */}
      {confirmExpense && (
        <RunConfirmDialog
          expense={confirmExpense}
          onConfirm={handleRunConfirmed}
          onCancel={() => setConfirmExpense(null)}
        />
      )}
    </>
  );
}
