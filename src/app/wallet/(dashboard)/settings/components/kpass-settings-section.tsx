"use client";

/**
 * KpassSettingsSection — shows and allows inline editing of the K-Pass user type.
 * The value is stored in localStorage under "kpass_user_type" (same key used
 * by the K-Pass detail page) so changes are immediately reflected site-wide.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Train, ChevronRight, Pencil, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";

const STORAGE_KEY = "kpass_user_type";

type KpassUserType = "일반" | "청년" | "저소득층";

const USER_TYPES: { value: KpassUserType; label: string; desc: string; discount: string }[] = [
  { value: "일반",    label: "일반",    desc: "만 19세 이상 성인",             discount: "20% 환급" },
  { value: "청년",    label: "청년",    desc: "만 19~34세 청년",               discount: "30% 환급" },
  { value: "저소득층", label: "저소득층", desc: "기초생활수급자 및 차상위계층", discount: "53% 환급" },
];

export default function KpassSettingsSection() {
  const [userType, setUserType] = useState<KpassUserType>("일반");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<KpassUserType>("일반");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as KpassUserType | null;
    if (stored && USER_TYPES.some((t) => t.value === stored)) {
      setUserType(stored);
      setDraft(stored);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, draft);
    setUserType(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(userType);
    setEditing(false);
  };

  const current = USER_TYPES.find((t) => t.value === userType)!;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-800">K-패스 설정</CardTitle>
          <Link
            href="/wallet/kpass"
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800"
          >
            K-패스 페이지 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <Train className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-600">
              K-패스는 대중교통을 월 15회 이상 이용 시 이용금액 일부를 적립금으로
              환급해주는 교통카드 혜택 프로그램입니다.
            </p>
          </div>
        </div>

        {/* Current type display */}
        {!editing ? (
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">현재 사용자 유형</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-semibold text-gray-800">{current.label}</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {current.discount}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{current.desc}</p>
            </div>
            <button
              onClick={() => { setDraft(userType); setEditing(true); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 border border-amber-200"
            >
              <Pencil className="w-3.5 h-3.5" />
              변경
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">사용자 유형 선택</p>
            {USER_TYPES.map((t) => (
              <label
                key={t.value}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  draft === t.value
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 hover:border-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="kpassType"
                    value={t.value}
                    checked={draft === t.value}
                    onChange={() => setDraft(t.value)}
                    className="accent-amber-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.label}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-600">{t.discount}</span>
              </label>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600">
                <Check className="w-4 h-4" /> 저장
              </button>
              <button onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                <X className="w-4 h-4" /> 취소
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
