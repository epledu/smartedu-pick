"use client";

/**
 * ThemeSection — theme selection UI.
 * Allows switching between light, dark, and system-default themes.
 * Uses the ThemeProvider context to persist and apply the chosen theme.
 */
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";
import { useTheme, type Theme } from "@/components/wallet/providers/theme-provider";

// ---------------------------------------------------------------------------
// Option definitions
// ---------------------------------------------------------------------------

interface ThemeOption {
  value: Theme;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "라이트",
    description: "밝은 베이지 배경",
    icon: <Sun className="w-5 h-5" />,
  },
  {
    value: "dark",
    label: "다크",
    description: "짙은 갈색 배경",
    icon: <Moon className="w-5 h-5" />,
  },
  {
    value: "system",
    label: "시스템 설정 따르기",
    description: "OS 설정에 맞게 자동 전환",
    icon: <Monitor className="w-5 h-5" />,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800 dark:text-[#D4A574]">테마</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          앱의 색상 테마를 선택하세요. 시스템 설정은 기기의 다크 모드 설정을 자동으로 따릅니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors text-left ${
                  isSelected
                    ? "border-amber-400 dark:border-[#D4A574] bg-amber-50 dark:bg-amber-950/30"
                    : "border-gray-200 dark:border-white/10 hover:border-amber-200 dark:hover:border-amber-700 cursor-pointer"
                }`}
                aria-pressed={isSelected}
              >
                {/* Selected checkmark badge */}
                {isSelected && (
                  <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-amber-500 dark:bg-[#D4A574] rounded-full">
                    <Check className="w-3 h-3 text-white dark:text-[#1a1411]" />
                  </span>
                )}

                <span className={isSelected ? "text-amber-600 dark:text-[#D4A574]" : "text-gray-400 dark:text-gray-500"}>
                  {opt.icon}
                </span>
                <span className={`text-sm font-medium ${isSelected ? "text-amber-800 dark:text-[#D4A574]" : "text-gray-600 dark:text-gray-400"}`}>
                  {opt.label}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
