"use client";

/**
 * CredentialForm — ID/PW entry form for CODEF bank/card registration.
 * Used as Step 3a inside BankSelector.
 */

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import type { Organization } from "@/lib/wallet/codef/organizations";

interface CredentialFormProps {
  org: Organization;
  onBack: () => void;
  onSubmit: (data: {
    bankId: string;
    bankPassword: string;
    accountName: string;
    accountNum: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function CredentialForm({ org, onBack, onSubmit, loading, error }: CredentialFormProps) {
  const [bankId, setBankId] = useState("");
  const [bankPassword, setBankPassword] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [showPw, setShowPw] = useState(false);

  const isBank = org.type === "BK";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ bankId, bankPassword, accountName, accountNum });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
          <p className="text-xs text-gray-500">{isBank ? "은행" : "카드사"}</p>
        </div>
        <button type="button" onClick={onBack} className="text-xs text-indigo-600 hover:underline">
          변경
        </button>
      </div>

      {/* Login ID */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {isBank ? "은행 로그인 아이디" : "카드사 로그인 아이디"}
        </label>
        <input
          type="text" value={bankId} onChange={(e) => setBankId(e.target.value)}
          required disabled={loading} autoComplete="username"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">비밀번호</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"} value={bankPassword}
            onChange={(e) => setBankPassword(e.target.value)}
            required disabled={loading} autoComplete="current-password"
            className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">비밀번호는 암호화 전송되며 저장되지 않습니다.</p>
      </div>

      {/* Account number — bank only */}
      {isBank && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">계좌번호</label>
          <input
            type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)}
            required disabled={loading} placeholder="'-' 없이 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Optional label */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          계좌 별명 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <input
          type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}
          disabled={loading} placeholder="예: 생활비 통장"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />연동 중...</> : "연결하기"}
      </button>
    </form>
  );
}
