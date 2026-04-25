"use client";

/**
 * Goals & Challenges page — /goals
 *
 * Displays savings and spending goals in a tabbed grid layout.
 * - Tabs: 진행 중 / 완료 / 전체
 * - Summary: average achievement rate, active count
 * - "새 목표 추가" opens a 2-step modal (template → form)
 * - Edit / Delete per card
 */
import { useEffect, useState } from "react";
import { Target, Plus, X } from "lucide-react";
import { useGoals, type Goal, type CreateGoalData, type UpdateGoalData } from "@/hooks/wallet/use-goals";
import GoalCard from "@/components/wallet/goals/goal-card";
import GoalForm from "@/components/wallet/goals/goal-form";
import ChallengeTemplate from "@/components/wallet/goals/challenge-template";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "active" | "completed" | "all";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GoalsPage() {
  const { goals, loading, error, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoals();

  const [tab, setTab] = useState<Tab>("active");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"template" | "form">("template");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formDefaults, setFormDefaults] = useState<Partial<CreateGoalData> & { durationDays?: number }>({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const filtered = goals.filter((g) => {
    if (tab === "active") return g.status === "ACTIVE";
    if (tab === "completed") return g.status === "COMPLETED" || g.status === "FAILED";
    return true;
  });

  const activeCount = goals.filter((g) => g.status === "ACTIVE").length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");
  const avgAchievement =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.percent, 0) / goals.length)
      : 0;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function openNewModal() {
    setEditingGoal(null);
    setFormDefaults({});
    setModalStep("template");
    setModalOpen(true);
  }

  function openEditModal(goal: Goal) {
    setEditingGoal(goal);
    setModalStep("form");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingGoal(null);
    setFormDefaults({});
  }

  function handleTemplateSelect(preset: Partial<CreateGoalData> & { durationDays?: number }) {
    setFormDefaults(preset);
    setModalStep("form");
  }

  async function handleFormSubmit(data: CreateGoalData | UpdateGoalData) {
    setFormLoading(true);
    if (editingGoal) {
      await updateGoal(editingGoal.id, data as UpdateGoalData);
    } else {
      await createGoal(data as CreateGoalData);
    }
    setFormLoading(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 목표를 삭제하시겠습니까?")) return;
    await deleteGoal(id);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">목표 &amp; 챌린지</h1>
        </div>
        <button
          type="button"
          onClick={openNewModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 목표 추가
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="달성률 평균" value={`${avgAchievement}%`} color="text-green-600" />
        <SummaryCard label="진행 중" value={`${activeCount}개`} color="text-blue-600" />
        <SummaryCard label="달성 완료" value={`${completedGoals.length}개`} color="text-indigo-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([["active", "진행 중"], ["completed", "완료"], ["all", "전체"]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Goal grid */}
      {loading && <p className="text-center text-gray-400 py-12">불러오는 중…</p>}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {tab === "active" ? "진행 중인 목표가 없습니다." : "해당 목표가 없습니다."}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {editingGoal
                  ? "목표 수정"
                  : modalStep === "template"
                    ? "챌린지 템플릿"
                    : "새 목표 추가"}
              </h2>
              <button type="button" onClick={closeModal} className="p-1 rounded-md hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="p-5">
              {/* Step 1: template selection */}
              {!editingGoal && modalStep === "template" && (
                <div className="space-y-4">
                  <ChallengeTemplate onSelect={handleTemplateSelect} />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setModalStep("form")}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      템플릿 없이 직접 입력 →
                    </button>
                  </div>
                </div>
              )}
              {/* Step 2: goal form */}
              {(editingGoal || modalStep === "form") && (
                <GoalForm
                  existing={editingGoal ?? undefined}
                  defaults={formDefaults}
                  onSubmit={handleFormSubmit}
                  onCancel={closeModal}
                  loading={formLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: summary card
// ---------------------------------------------------------------------------

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
