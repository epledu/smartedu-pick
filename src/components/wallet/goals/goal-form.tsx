"use client";

/**
 * GoalForm
 *
 * Two-type goal form:
 *  - 절약 목표 (spending challenge): tracks spending ≤ targetAmount
 *  - 저축 목표 (savings goal): tracks savings toward targetAmount
 *
 * Props allow pre-filling values (e.g. from a challenge template).
 */
import { useState, useEffect } from "react";
import type { CreateGoalData, Goal, UpdateGoalData } from "@/hooks/wallet/use-goals";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_OPTIONS = ["💰", "🏦", "☕", "🍽️", "🚌", "🏆", "🎯", "✈️", "🏠", "📱", "🎮", "👗"];
const COLOR_OPTIONS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#3B82F6", "#EC4899", "#14B8A6", "#F97316", "#92400E",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GoalFormProps {
  /** When provided, the form is in edit mode */
  existing?: Goal;
  /** Pre-filled values (e.g. from challenge template) */
  defaults?: Partial<CreateGoalData> & { durationDays?: number };
  onSubmit: (data: CreateGoalData | UpdateGoalData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GoalForm({
  existing,
  defaults,
  onSubmit,
  onCancel,
  loading = false,
}: GoalFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  // Compute default end date based on durationDays
  function defaultEndDate(days?: number) {
    if (!days) return "";
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  const [type, setType] = useState<"절약" | "저축">("저축");
  const [title, setTitle] = useState(existing?.title ?? defaults?.title ?? "");
  const [targetAmount, setTargetAmount] = useState(
    String(existing?.targetAmount ?? defaults?.targetAmount ?? "")
  );
  const [currentAmount, setCurrentAmount] = useState(
    String(existing?.currentAmount ?? defaults?.currentAmount ?? "0")
  );
  const [icon, setIcon] = useState(existing?.icon ?? defaults?.icon ?? "🎯");
  const [color, setColor] = useState(existing?.color ?? defaults?.color ?? "#6366F1");
  const [startDate, setStartDate] = useState(
    existing?.startDate?.slice(0, 10) ?? defaults?.startDate ?? today
  );
  const [endDate, setEndDate] = useState(
    existing?.endDate?.slice(0, 10) ?? defaultEndDate(defaults?.durationDays) ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Re-apply defaults when they change (template selection)
  useEffect(() => {
    if (!defaults) return;
    if (defaults.title) setTitle(defaults.title);
    if (defaults.targetAmount) setTargetAmount(String(defaults.targetAmount));
    if (defaults.icon) setIcon(defaults.icon);
    if (defaults.color) setColor(defaults.color);
    if (defaults.durationDays) setEndDate(defaultEndDate(defaults.durationDays));
  }, [defaults]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "제목을 입력해 주세요";
    const amt = Number(targetAmount);
    if (!targetAmount || isNaN(amt) || amt <= 0) errs.targetAmount = "올바른 금액을 입력해 주세요";
    if (!startDate) errs.startDate = "시작일을 선택해 주세요";
    if (!endDate) errs.endDate = "종료일을 선택해 주세요";
    if (startDate && endDate && startDate > endDate)
      errs.endDate = "종료일은 시작일 이후여야 합니다";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data: CreateGoalData = {
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      startDate,
      endDate,
      icon,
      color,
    };
    await onSubmit(data);
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const errCls = "text-xs text-red-500 mt-0.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Goal type selector */}
      {!existing && (
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {(["저축", "절약"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                type === t ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "저축" ? "💰 저축 목표" : "🎯 절약 목표"}
            </button>
          ))}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">제목</label>
        <input
          type="text"
          className={inputCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === "저축" ? "예: 여행 자금 모으기" : "예: 커피값 줄이기"}
          maxLength={50}
        />
        {errors.title && <p className={errCls}>{errors.title}</p>}
      </div>

      {/* Target amount */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {type === "저축" ? "목표 금액 (원)" : "한도 금액 (원)"}
        </label>
        <input
          type="number"
          className={inputCls}
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0"
          min={1}
        />
        {errors.targetAmount && <p className={errCls}>{errors.targetAmount}</p>}
      </div>

      {/* Current amount */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">현재 금액 (원)</label>
        <input
          type="number"
          className={inputCls}
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          placeholder="0"
          min={0}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">시작일</label>
          <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          {errors.startDate && <p className={errCls}>{errors.startDate}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">종료일</label>
          <input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {errors.endDate && <p className={errCls}>{errors.endDate}</p>}
        </div>
      </div>

      {/* Icon picker */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">아이콘</label>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition-colors ${
                icon === ic ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">색상</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                color === c ? "border-gray-700 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              aria-label={`색상 ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "저장 중…" : existing ? "수정" : "목표 추가"}
        </button>
      </div>
    </form>
  );
}
