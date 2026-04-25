"use client";

/**
 * RecurringForm — form for creating or editing a recurring expense.
 *
 * Fields: description, amount, category, account, frequency, dayOfMonth,
 * nextDueDate, isActive toggle.
 */
import React, { useState, useEffect } from "react";
import type { Frequency } from "@/hooks/wallet/use-recurring";

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

export interface RecurringFormData {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  frequency: Frequency;
  dayOfMonth?: number;
  nextDueDate: string;
  isActive: boolean;
}

interface Props {
  onSubmit: (data: RecurringFormData) => void;
  onCancel: () => void;
  initialData?: Partial<RecurringFormData>;
  categories: FormCategory[];
  accounts: FormAccount[];
}

// ---------------------------------------------------------------------------
// Frequency options
// ---------------------------------------------------------------------------

const FREQUENCY_OPTIONS: Array<{ value: Frequency; label: string }> = [
  { value: "DAILY", label: "매일" },
  { value: "WEEKLY", label: "매주" },
  { value: "MONTHLY", label: "매월" },
  { value: "YEARLY", label: "매년" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RecurringForm({
  onSubmit,
  onCancel,
  initialData,
  categories,
  accounts,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const [description, setDescription] = useState(initialData?.description ?? "");
  const [amount, setAmount] = useState(String(initialData?.amount ?? ""));
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [accountId, setAccountId] = useState(initialData?.accountId ?? "");
  const [frequency, setFrequency] = useState<Frequency>(
    initialData?.frequency ?? "MONTHLY"
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    String(initialData?.dayOfMonth ?? "")
  );
  const [nextDueDate, setNextDueDate] = useState(
    initialData?.nextDueDate?.slice(0, 10) ?? today
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Sync initial data when editing
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description ?? "");
      setAmount(String(initialData.amount ?? ""));
      setCategoryId(initialData.categoryId ?? "");
      setAccountId(initialData.accountId ?? "");
      setFrequency(initialData.frequency ?? "MONTHLY");
      setDayOfMonth(String(initialData.dayOfMonth ?? ""));
      setNextDueDate(initialData.nextDueDate?.slice(0, 10) ?? today);
      setIsActive(initialData.isActive ?? true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      description: description.trim(),
      amount: parseFloat(amount),
      categoryId,
      accountId,
      frequency,
      dayOfMonth:
        frequency === "MONTHLY" && dayOfMonth
          ? parseInt(dayOfMonth, 10)
          : undefined,
      nextDueDate,
      isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="예: 넷플릭스 구독"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          금액 (원)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
          placeholder="0"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          카테고리
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">선택하세요</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Account */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          계좌
        </label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">선택하세요</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          반복 주기
        </label>
        <div className="flex gap-2">
          {FREQUENCY_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                frequency === value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Day of month — only shown for MONTHLY */}
      {frequency === "MONTHLY" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            매월 몇 일 (선택)
          </label>
          <input
            type="number"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            min={1}
            max={31}
            placeholder="예: 25"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Next due date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          다음 실행일
        </label>
        <input
          type="date"
          value={nextDueDate}
          onChange={(e) => setNextDueDate(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-gray-700">활성화</span>
        <button
          type="button"
          onClick={() => setIsActive((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isActive ? "bg-indigo-600" : "bg-gray-300"
          }`}
          aria-checked={isActive}
          role="switch"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          저장
        </button>
      </div>
    </form>
  );
}
