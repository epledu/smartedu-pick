"use client";

/**
 * NotificationSettingsSection — toggles for each notification type.
 * State is persisted to localStorage under "notification_settings".
 */
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";
import { Save } from "lucide-react";

const STORAGE_KEY = "notification_settings";

interface NotifSettings {
  budgetWarning: boolean;    // alert at 80% budget usage
  budgetExceeded: boolean;   // alert when budget is exceeded
  recurringDue: boolean;     // alert 3 days before recurring expense
  goalAchieved: boolean;     // alert on goal completion
  weeklySummary: boolean;    // weekly summary push
  monthlyReport: boolean;    // monthly report push
}

const DEFAULT: NotifSettings = {
  budgetWarning: true,
  budgetExceeded: true,
  recurringDue: true,
  goalAchieved: true,
  weeklySummary: false,
  monthlyReport: false,
};

const ITEMS: { key: keyof NotifSettings; label: string; desc: string }[] = [
  { key: "budgetWarning",  label: "예산 80% 도달 알림",    desc: "월 예산의 80%에 도달했을 때 알림을 보냅니다." },
  { key: "budgetExceeded", label: "예산 초과 알림",         desc: "월 예산을 초과했을 때 즉시 알림을 보냅니다." },
  { key: "recurringDue",   label: "고정 지출 3일 전 알림", desc: "등록된 고정 지출 3일 전에 미리 알림을 보냅니다." },
  { key: "goalAchieved",   label: "목표 달성 알림",         desc: "저축 목표를 달성했을 때 알림을 보냅니다." },
  { key: "weeklySummary",  label: "주간 요약 알림",         desc: "매주 월요일 지난 주 지출 요약을 보냅니다." },
  { key: "monthlyReport",  label: "월간 리포트 알림",       desc: "매월 1일 지난 달 리포트를 보냅니다." },
];

export default function NotificationSettingsSection() {
  const [settings, setSettings] = useState<NotifSettings>(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT, ...JSON.parse(stored) });
    } catch { /* ignore */ }
  }, []);

  const toggle = (key: keyof NotifSettings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800">알림 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ITEMS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            {/* Toggle switch (Tailwind-only) */}
            <button
              type="button"
              role="switch"
              aria-checked={settings[key]}
              onClick={() => toggle(key)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                settings[key] ? "bg-amber-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                  settings[key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}

        <div className="pt-2">
          <p className="text-xs text-gray-400 mb-3">
            * 브라우저 알림 권한이 허용된 경우에만 푸시 알림이 작동합니다.
          </p>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? "저장됨!" : "저장"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
