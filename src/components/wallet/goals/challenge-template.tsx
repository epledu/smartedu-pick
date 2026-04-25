"use client";

/**
 * ChallengeTemplate
 *
 * Grid of predefined challenge templates. Clicking a card pre-fills
 * the goal form via the onSelect callback.
 */
import type { CreateGoalData } from "@/hooks/wallet/use-goals";

// ---------------------------------------------------------------------------
// Template definitions
// ---------------------------------------------------------------------------

interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  /** Prefilled form values (targetAmount in KRW, duration in days) */
  preset: Pick<CreateGoalData, "title" | "targetAmount" | "icon" | "color"> & {
    durationDays: number;
  };
}

const TEMPLATES: Template[] = [
  {
    id: "coffee-challenge",
    title: "커피값 챌린지",
    description: "이번 달 커피값 5만원 이하",
    icon: "☕",
    color: "#92400E",
    preset: {
      title: "이번 달 커피값 5만원 이하 챌린지",
      targetAmount: 50000,
      icon: "☕",
      color: "#92400E",
      durationDays: 30,
    },
  },
  {
    id: "dining-limit",
    title: "외식비 제한",
    description: "외식비 월 20만원 제한",
    icon: "🍽️",
    color: "#D97706",
    preset: {
      title: "외식비 월 20만원 제한",
      targetAmount: 200000,
      icon: "🍽️",
      color: "#D97706",
      durationDays: 30,
    },
  },
  {
    id: "transit-challenge",
    title: "대중교통 챌린지",
    description: "대중교통 월 10회 챌린지",
    icon: "🚌",
    color: "#0369A1",
    preset: {
      title: "대중교통 월 10회 챌린지",
      targetAmount: 10,
      icon: "🚌",
      color: "#0369A1",
      durationDays: 30,
    },
  },
  {
    id: "save-1m",
    title: "100만원 모으기",
    description: "목표 저축 100만원",
    icon: "💰",
    color: "#059669",
    preset: {
      title: "100만원 모으기",
      targetAmount: 1000000,
      icon: "💰",
      color: "#059669",
      durationDays: 90,
    },
  },
  {
    id: "budget-streak",
    title: "예산 달성 연속",
    description: "3개월 연속 예산 달성",
    icon: "🏆",
    color: "#7C3AED",
    preset: {
      title: "3개월 연속 예산 달성",
      targetAmount: 3,
      icon: "🏆",
      color: "#7C3AED",
      durationDays: 90,
    },
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ChallengeTemplateProps {
  /** Called with a partial CreateGoalData when user selects a template */
  onSelect: (preset: Partial<CreateGoalData> & { durationDays?: number }) => void;
}

export default function ChallengeTemplate({ onSelect }: ChallengeTemplateProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">챌린지 템플릿 선택</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.preset)}
            className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-colors group"
          >
            <span
              className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
              style={{ background: `${tpl.color}22` }}
              aria-hidden="true"
            >
              {tpl.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 truncate">
                {tpl.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{tpl.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
