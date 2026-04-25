"use client";

/**
 * AppSettingsSection — user preferences persisted to localStorage.
 * Covers: language, currency, default view, first day of week, budget cycle start.
 */
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";
import { Save } from "lucide-react";

const STORAGE_KEY = "app_settings";

interface AppSettings {
  language: "ko";
  currency: "KRW";
  defaultView: "dashboard" | "transactions" | "calendar";
  firstDayOfWeek: "sun" | "mon";
  budgetStartType: "first" | "custom";
  budgetStartDay: number; // 1-28
}

const DEFAULT: AppSettings = {
  language: "ko",
  currency: "KRW",
  defaultView: "dashboard",
  firstDayOfWeek: "sun",
  budgetStartType: "first",
  budgetStartDay: 1,
};

export default function AppSettingsSection() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT, ...JSON.parse(stored) });
    } catch { /* ignore parse errors */ }
  }, []);

  const patch = (partial: Partial<AppSettings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const RadioRow = ({
    label, name, value, current, onChange,
  }: { label: string; name: string; value: string; current: string; onChange: (v: string) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        className="accent-amber-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800">앱 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language */}
        <Row label="언어">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
            <option value="ko">한국어</option>
          </select>
          <span className="text-xs text-gray-400 ml-2">현재 한국어만 지원</span>
        </Row>

        {/* Currency */}
        <Row label="통화">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
            <option value="KRW">KRW (₩)</option>
          </select>
          <span className="text-xs text-gray-400 ml-2">현재 원화만 지원</span>
        </Row>

        {/* Default view */}
        <Row label="기본 화면">
          <div className="flex gap-4">
            {([["dashboard", "대시보드"], ["transactions", "거래내역"], ["calendar", "캘린더"]] as const).map(
              ([val, lbl]) => (
                <RadioRow key={val} label={lbl} name="defaultView" value={val}
                  current={settings.defaultView} onChange={(v) => patch({ defaultView: v as AppSettings["defaultView"] })} />
              )
            )}
          </div>
        </Row>

        {/* First day of week */}
        <Row label="주 시작 요일">
          <div className="flex gap-4">
            <RadioRow label="일요일" name="firstDay" value="sun"
              current={settings.firstDayOfWeek} onChange={(v) => patch({ firstDayOfWeek: v as "sun" | "mon" })} />
            <RadioRow label="월요일" name="firstDay" value="mon"
              current={settings.firstDayOfWeek} onChange={(v) => patch({ firstDayOfWeek: v as "sun" | "mon" })} />
          </div>
        </Row>

        {/* Budget cycle start */}
        <Row label="예산 시작일">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <RadioRow label="매월 1일" name="budgetStart" value="first"
                current={settings.budgetStartType} onChange={(v) => patch({ budgetStartType: v as "first" | "custom" })} />
              <RadioRow label="급여일 (직접 입력)" name="budgetStart" value="custom"
                current={settings.budgetStartType} onChange={(v) => patch({ budgetStartType: v as "first" | "custom" })} />
            </div>
            {settings.budgetStartType === "custom" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">매월</span>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={settings.budgetStartDay}
                  onChange={(e) => patch({ budgetStartDay: Math.min(28, Math.max(1, Number(e.target.value))) })}
                  className="w-16 border border-amber-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-sm text-gray-600">일</span>
              </div>
            )}
          </div>
        </Row>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? "저장됨!" : "저장"}
        </button>
      </CardContent>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
      <span className="w-32 text-sm font-medium text-gray-700 pt-2 shrink-0">{label}</span>
      <div className="flex-1 flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
