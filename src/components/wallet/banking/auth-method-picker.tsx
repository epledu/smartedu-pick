"use client";

/**
 * AuthMethodPicker — selection step between ID/PW and simple (push) auth.
 *
 * Shown after the user picks a financial institution. The user chooses
 * which authentication method to proceed with.
 */

import { KeyRound, Smartphone } from "lucide-react";
import type { Organization } from "@/lib/wallet/codef/organizations";

export type AuthMethod = "idpw" | "simple";

interface AuthMethodPickerProps {
  org: Organization;
  onSelect: (method: AuthMethod) => void;
  onBack: () => void;
}

export default function AuthMethodPicker({ org, onSelect, onBack }: AuthMethodPickerProps) {
  return (
    <div className="space-y-4">
      {/* Selected org badge */}
      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: org.color ?? "#6b7280" }}
        >
          {org.name.slice(0, 2)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{org.name}</p>
          <p className="text-xs text-gray-500">{org.type === "BK" ? "은행" : "카드사"}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-indigo-600 hover:underline"
        >
          변경
        </button>
      </div>

      {/* Method selection */}
      <p className="text-xs font-medium text-gray-700">인증 방식을 선택하세요</p>

      <button
        type="button"
        onClick={() => onSelect("idpw")}
        className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <KeyRound className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">ID / 비밀번호</p>
          <p className="text-xs text-gray-500 mt-0.5">은행 또는 카드사 웹사이트 로그인 정보</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelect("simple")}
        className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">간편인증</p>
          <p className="text-xs text-gray-500 mt-0.5">카카오톡 · PASS · 토스 · 네이버 등 앱 인증</p>
        </div>
      </button>
    </div>
  );
}
