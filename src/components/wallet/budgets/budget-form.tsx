"use client";

/**
 * BudgetForm — create or edit a monthly budget for a category.
 *
 * Fields:
 *  - Category selector (all non-default expense categories; already-budgeted ones are disabled)
 *  - Amount input
 *  - Month/year selector (defaults to current month)
 *  - Save / Cancel buttons
 */
import React, { useState } from "react";
import { Button } from "@/components/wallet/ui/button";
import { Input } from "@/components/wallet/ui/input";
import type { Budget, CreateBudgetData } from "@/hooks/wallet/use-budgets";
import type { Category } from "@/hooks/wallet/use-categories";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BudgetFormProps {
  /** All non-default expense categories. Parent does NOT pre-filter. */
  availableCategories: Category[];
  /** Category IDs that already have a budget for the selected period. */
  budgetedCategoryIds: Set<string>;
  /** Month/year for the new budget (1-indexed month). */
  defaultMonth: number;
  defaultYear: number;
  /** Pre-populated budget when editing. */
  editBudget?: Budget;
  onSubmit: (data: CreateBudgetData | { amount: number }) => Promise<void>;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Build year/month option arrays
// ---------------------------------------------------------------------------

function buildMonthOptions(): { value: number; label: string }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`,
  }));
}

function buildYearOptions(currentYear: number): number[] {
  return [currentYear - 1, currentYear, currentYear + 1];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BudgetForm({
  availableCategories,
  budgetedCategoryIds,
  defaultMonth,
  defaultYear,
  editBudget,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const isEdit = Boolean(editBudget);

  // Default to first non-budgeted category, or first category if all are budgeted
  const defaultCatId =
    editBudget?.categoryId ??
    (availableCategories.find((c) => !budgetedCategoryIds.has(c.id))?.id ??
      availableCategories[0]?.id ??
      "");

  const [categoryId, setCategoryId] = useState<string>(defaultCatId);
  const [amountStr, setAmountStr] = useState<string>(
    editBudget ? String(editBudget.amount) : ""
  );
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [saving, setSaving] = useState(false);
  const [amountError, setAmountError] = useState("");

  const monthOptions = buildMonthOptions();
  const yearOptions = buildYearOptions(defaultYear);

  // Check if the currently selected category already has a budget
  const selectedIsBudgeted = !isEdit && budgetedCategoryIds.has(categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      setAmountError("유효한 예산 금액을 입력해주세요.");
      return;
    }
    if (!isEdit && !categoryId) {
      return;
    }
    // Block submission if user tries to submit a budgeted category (should not happen via UI)
    if (selectedIsBudgeted) return;
    setAmountError("");
    setSaving(true);
    try {
      if (isEdit) {
        await onSubmit({ amount });
      } else {
        await onSubmit({ categoryId, amount, month, year });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category selector — only shown when creating */}
      {!isEdit && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">카테고리</label>
          {availableCategories.length === 0 ? (
            <p className="text-sm text-gray-500">
              등록된 카테고리가 없습니다.
            </p>
          ) : (
            <>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {availableCategories.map((cat) => {
                  const alreadyBudgeted = budgetedCategoryIds.has(cat.id);
                  return (
                    <option
                      key={cat.id}
                      value={cat.id}
                      disabled={alreadyBudgeted}
                    >
                      {cat.name}
                      {alreadyBudgeted ? " — 이미 설정됨" : ""}
                    </option>
                  );
                })}
              </select>

              {/* Helper note for already-budgeted categories */}
              <p className="text-xs text-gray-400">
                이미 예산이 설정된 카테고리는{" "}
                <a
                  href="/wallet/budgets"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  목록에서 수정
                </a>
                할 수 있습니다.
              </p>

              {/* Warn when the currently selected category is already budgeted */}
              {selectedIsBudgeted && (
                <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 border border-amber-200">
                  <span className="font-semibold">이미 설정됨</span>
                  이 카테고리는 이번 달 예산이 이미 설정되어 있습니다.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Amount input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">예산 금액 (원)</label>
        <Input
          type="number"
          min={1}
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          placeholder="예: 300000"
        />
        {amountError && <p className="text-xs text-red-500">{amountError}</p>}
      </div>

      {/* Month / Year selectors — only shown when creating */}
      {!isEdit && (
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-gray-700">년도</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-gray-700">월</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          취소
        </Button>
        <Button
          type="submit"
          isLoading={saving}
          loadingText="저장 중..."
          disabled={!isEdit && (availableCategories.length === 0 || selectedIsBudgeted)}
        >
          저장
        </Button>
      </div>
    </form>
  );
}
