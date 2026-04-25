"use client";

/**
 * SimpleAuthForm — CODEF push-notification (간편인증) registration form.
 *
 * Step 1 (form): User selects provider and fills in personal info.
 * Step 2 (pending): Waiting screen while user approves on their phone.
 */

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LOGIN_TYPES, TELECOMS } from "@/lib/wallet/codef/constants";
import type { Organization } from "@/lib/wallet/codef/organizations";
import SimpleAuthPendingView from "./simple-auth-pending";

// ---------------------------------------------------------------------------
// Provider metadata (UI-only — no server imports needed)
// ---------------------------------------------------------------------------

const PROVIDERS = [
  { loginType: LOGIN_TYPES.KAKAO,   label: "카카오톡",  color: "#FFE500" },
  { loginType: LOGIN_TYPES.PASS,    label: "PASS",      color: "#FF6B35" },
  { loginType: LOGIN_TYPES.TOSS,    label: "토스",      color: "#0064FF" },
  { loginType: LOGIN_TYPES.NAVER,   label: "네이버",    color: "#03C75A" },
  { loginType: LOGIN_TYPES.PAYCO,   label: "페이코",    color: "#FF3B30" },
  { loginType: LOGIN_TYPES.SAMSUNG, label: "삼성패스",  color: "#1428A0" },
];

// ---------------------------------------------------------------------------
// Props and state types
// ---------------------------------------------------------------------------

interface SimpleAuthFormProps {
  org: Organization;
  onBack: () => void;
  onSuccess: (account: unknown) => void;
}

interface FormFields {
  loginType: string;
  providerLabel: string;
  userName: string;
  birthDate: string;
  gender: "1" | "2";
  phoneNo: string;
  telecom: string;
  accountName: string;
  accountNum: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SimpleAuthForm({ org, onBack, onSuccess }: SimpleAuthFormProps) {
  const isBank = org.type === "BK";

  const [fields, setFields] = useState<FormFields>({
    loginType: "",
    providerLabel: "",
    userName: "",
    birthDate: "",
    gender: "1",
    phoneNo: "",
    telecom: "0",
    accountName: "",
    accountNum: "",
  });
  const [step, setStep] = useState<"form" | "pending">("form");
  const [pendingToken, setPendingToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormFields) => (val: string) =>
    setFields((f) => ({ ...f, [key]: val }));

  // ── Step 1: initiate push ──────────────────────────────────────────────────

  async function handleInit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.loginType) { setError("인증 방식을 선택해주세요."); return; }
    setLoading(true);
    setError(null);

    const birthDate = fields.birthDate.replace(/-/g, "");

    try {
      const res = await fetch("/api/codef/simple-auth?mode=init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: org.code,
          businessType: org.type,
          loginType: fields.loginType,
          userName: fields.userName,
          birthDate,
          phoneNo: fields.phoneNo.replace(/-/g, ""),
          telecom: fields.telecom,
          gender: fields.gender,
          accountName: fields.accountName,
          accountNum: fields.accountNum,
        }),
      });

      const json = await res.json() as { status?: string; token?: string; connectedId?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "인증 요청 실패");

      if (json.status === "pending" && json.token) {
        setPendingToken(json.token);
        setStep("pending");
      } else if (json.status === "connected") {
        onSuccess({ connectedId: json.connectedId });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: confirm after phone approval ───────────────────────────────────

  async function handleComplete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/codef/simple-auth?mode=complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: pendingToken,
          accountName: fields.accountName,
          accountType: isBank ? "BANK" : "CARD",
          accountNum: isBank ? fields.accountNum : undefined,
        }),
      });

      const json = await res.json() as { status?: string; account?: unknown; error?: string };
      if (!res.ok) throw new Error(json.error ?? "인증 완료 실패");
      onSuccess(json.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // ── Pending screen ─────────────────────────────────────────────────────────

  if (step === "pending") {
    return (
      <SimpleAuthPendingView
        providerLabel={fields.providerLabel}
        onComplete={handleComplete}
        onRetry={() => { setStep("form"); setPendingToken(""); setError(null); }}
        loading={loading}
        error={error}
      />
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────

  return (
    <form onSubmit={handleInit} className="space-y-4">
      {/* Provider buttons */}
      <div>
        <p className="text-xs font-medium text-gray-700 mb-2">인증 방식 선택</p>
        <div className="grid grid-cols-3 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.loginType}
              type="button"
              onClick={() => setFields((f) => ({ ...f, loginType: p.loginType, providerLabel: p.label }))}
              className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                fields.loginType === p.loginType
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={fields.loginType === p.loginType ? { color: p.color } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">이름</label>
        <input type="text" value={fields.userName} onChange={(e) => set("userName")(e.target.value)}
          required disabled={loading} placeholder="홍길동"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* Birth date + gender */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">생년월일</label>
          <input type="text" value={fields.birthDate} onChange={(e) => set("birthDate")(e.target.value)}
            required disabled={loading} placeholder="19900101" maxLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="w-24">
          <label className="block text-xs font-medium text-gray-700 mb-1">성별</label>
          <select value={fields.gender} onChange={(e) => set("gender")(e.target.value)} disabled={loading}
            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="1">남</option>
            <option value="2">여</option>
          </select>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">휴대폰 번호</label>
        <input type="tel" value={fields.phoneNo} onChange={(e) => set("phoneNo")(e.target.value)}
          required disabled={loading} placeholder="01012345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* Telecom */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">통신사</label>
        <select value={fields.telecom} onChange={(e) => set("telecom")(e.target.value)} disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {TELECOMS.map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}
        </select>
      </div>

      {/* Account number (bank only) */}
      {isBank && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">계좌번호</label>
          <input type="text" value={fields.accountNum} onChange={(e) => set("accountNum")(e.target.value)}
            required disabled={loading} placeholder="'-' 없이 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      )}

      {/* Account label */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          계좌 별명 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <input type="text" value={fields.accountName} onChange={(e) => set("accountName")(e.target.value)}
          disabled={loading} placeholder="예: 생활비 통장"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={onBack} disabled={loading}
          className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
          변경
        </button>
        <button type="submit" disabled={loading}
          className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />요청 중...</> : "인증 요청"}
        </button>
      </div>
    </form>
  );
}
