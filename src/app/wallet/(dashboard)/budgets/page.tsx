"use client";

/**
 * Budgets page — /budgets
 *
 * Layout:
 *  - Header: "예산 관리" + "새 예산 추가" button
 *  - Month/Year selector
 *  - Summary card (total budget / spent / remaining with progress bar)
 *  - BudgetAlert (if any warning/exceeded budgets exist)
 *  - Grid of BudgetCard components
 *  - Modal with BudgetForm for add/edit
 */
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { BudgetCard } from "@/components/wallet/budgets/budget-card";
import { BudgetForm } from "@/components/wallet/budgets/budget-form";
import { BudgetAlert } from "@/components/wallet/budgets/budget-alert";
import { BudgetProgress } from "@/components/wallet/budgets/budget-progress";
import { useBudgets } from "@/hooks/wallet/use-budgets";
import { useCategories } from "@/hooks/wallet/use-categories";
import { calculateBudgetStatus } from "@/lib/wallet/budget";
import type { Budget, CreateBudgetData } from "@/hooks/wallet/use-budgets";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function BudgetsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Budget | null>(null);

  const {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  const { categories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchBudgets(year, month);
  }, [fetchBudgets, year, month]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // All categories except the catch-all "미분류" (Uncategorized) are budget-eligible.
  // Default categories (식비, 교통, 쇼핑, etc.) must remain selectable so new users
  // can assign budgets without needing to create custom categories first.
  const budgetedCategoryIds = new Set(budgets.map((b) => b.categoryId));
  const availableCategories = categories.filter(
    (c) => c.name !== "미분류"
  );

  // ---------------------------------------------------------------------------
  // Summary totals
  // ---------------------------------------------------------------------------

  const totalAmount = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalAmount - totalSpent;
  const totalPercent = totalAmount > 0 ? (totalSpent / totalAmount) * 100 : 0;
  const summaryStatus = calculateBudgetStatus(totalSpent / (totalAmount || 1));

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (budget: Budget) => {
    setEditTarget(budget);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleFormSubmit = async (data: CreateBudgetData | { amount: number }) => {
    if (editTarget) {
      await updateBudget(editTarget.id, { amount: (data as { amount: number }).amount }, year, month);
    } else {
      await createBudget(data as CreateBudgetData);
    }
    closeModal();
  };

  const handleDelete = async (budget: Budget) => {
    if (!confirm(`"${budget.category.name}" 예산을 삭제할까요?`)) return;
    await deleteBudget(budget.id, year, month);
  };

  // ---------------------------------------------------------------------------
  // Month navigation helpers
  // ---------------------------------------------------------------------------

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">예산 관리</h1>
        <Button onClick={openAdd} size="sm">
          <Plus className="w-4 h-4" />
          새 예산 추가
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Month selector */}
      {/* Month selector — dark mode: border and text variants */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={prevMonth}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          &#8249;
        </button>
        <span className="text-base font-semibold text-gray-800 dark:text-gray-200 min-w-[80px] text-center">
          {year}년 {month}월
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          &#8250;
        </button>
      </div>

      {/* Summary card — dark mode: background and text */}
      {budgets.length > 0 && (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm mb-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">전체 예산 현황</p>
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">총 예산</p>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">{formatKRW(totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">총 지출</p>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">{formatKRW(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">남은 예산</p>
              <p className={`text-base font-bold ${totalRemaining < 0 ? "text-red-600" : "text-green-600"}`}>
                {formatKRW(totalRemaining)}
              </p>
            </div>
          </div>
          <BudgetProgress percent={totalPercent} status={summaryStatus} />
          <p className="mt-1.5 text-right text-xs text-gray-400 dark:text-gray-500">
            {totalPercent.toFixed(1)}% 사용
          </p>
        </div>
      )}

      {/* Alert banner */}
      <BudgetAlert budgets={budgets} />

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          불러오는 중...
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <p className="text-sm">이 달에 설정된 예산이 없습니다.</p>
          <Button variant="outline" size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4" />
            예산 추가하기
          </Button>
        </div>
      ) : (
        /* Budget grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal — dark mode: overlay and inner card */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editTarget ? "예산 수정" : "새 예산 추가"}
            </h2>
            <BudgetForm
              availableCategories={availableCategories}
              budgetedCategoryIds={budgetedCategoryIds}
              defaultMonth={month}
              defaultYear={year}
              editBudget={editTarget ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
