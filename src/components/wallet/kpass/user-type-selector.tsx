"use client";

/**
 * UserTypeSelector
 *
 * Radio-group component that lets the user select their K-Pass tier.
 * Selection is persisted to localStorage via the onChange callback.
 * Each option shows the applicable refund rate.
 */
import { K_PASS_REFUND_RATES } from "@/lib/wallet/constants";
import type { KPassUserType } from "@/lib/wallet/kpass";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserTypeSelectorProps {
  value: KPassUserType;
  onChange: (type: KPassUserType) => void;
}

// ---------------------------------------------------------------------------
// Option metadata
// ---------------------------------------------------------------------------

const USER_TYPE_OPTIONS: Array<{
  value: KPassUserType;
  label: string;
  description: string;
  badge: string;
}> = [
  {
    value: "regular",
    label: "일반",
    description: "만 19세 미만 또는 만 34세 초과",
    badge: `${Math.round(K_PASS_REFUND_RATES.regular * 100)}% 환급`,
  },
  {
    value: "youth",
    label: "청년",
    description: "만 19세 이상 ~ 만 34세 이하",
    badge: `${Math.round(K_PASS_REFUND_RATES.youth * 100)}% 환급`,
  },
  {
    value: "low_income",
    label: "저소득층",
    description: "기초생활수급자 또는 차상위계층",
    badge: `${Math.round(K_PASS_REFUND_RATES.low_income * 100)}% 환급`,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UserTypeSelector({ value, onChange }: UserTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">내 K-패스 유형</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {USER_TYPE_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                relative flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left
                transition-all duration-150
                ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
              aria-pressed={isSelected}
            >
              {/* Selected indicator */}
              <span
                className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}`}
              >
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                )}
              </span>

              {/* Label */}
              <span
                className={`text-sm font-semibold ${isSelected ? "text-indigo-700" : "text-gray-800"}`}
              >
                {opt.label}
              </span>

              {/* Refund rate badge */}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full
                  ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}
              >
                {opt.badge}
              </span>

              {/* Description */}
              <span className="text-xs text-gray-500 leading-snug">{opt.description}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">
        선택한 유형은 이 기기에 저장됩니다. K-패스 카드 발급 유형과 동일하게 설정하세요.
      </p>
    </div>
  );
}
