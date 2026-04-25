"use client";

/**
 * BankSelector — CODEF-based bank/card registration modal.
 *
 * Step flow:
 *  1. org     — choose financial institution (OrgGrid)
 *  2. method  — choose ID/PW or 간편인증 (AuthMethodPicker)
 *  3a. idpw   — enter credentials (CredentialForm)
 *  3b. simple — enter personal info + approve via phone (SimpleAuthForm)
 */

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Organization } from "@/lib/wallet/codef/organizations";
import OrgGrid from "./org-grid";
import AuthMethodPicker, { type AuthMethod } from "./auth-method-picker";
import CredentialForm from "./credential-form";
import SimpleAuthForm from "./simple-auth-form";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BankSelectorProps {
  onSuccess: (account: unknown) => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Step type
// ---------------------------------------------------------------------------

type Step = "org" | "method" | "idpw" | "simple";

const STEP_TITLES: Record<Step, string> = {
  org: "은행/카드사 선택",
  method: "인증 방식 선택",
  idpw: "로그인 정보 입력",
  simple: "간편인증 연결",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function BankSelector({ onSuccess, onCancel }: BankSelectorProps) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selected, setSelected] = useState<Organization | null>(null);
  const [step, setStep] = useState<Step>("org");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/codef/organizations")
      .then((r) => r.json())
      .then((data: Organization[]) => setOrgs(data))
      .catch(() => setError("기관 목록을 불러오지 못했습니다."));
  }, []);

  // ── Navigation helpers ────────────────────────────────────────────────────

  function handleOrgSelect(org: Organization) {
    setSelected(org);
    setError(null);
    setStep("method");
  }

  function handleMethodSelect(method: AuthMethod) {
    setStep(method === "idpw" ? "idpw" : "simple");
    setError(null);
  }

  function goToMethod() { setStep("method"); setError(null); }
  function goToOrg()    { setSelected(null); setStep("org"); setError(null); }

  // ── ID/PW submit ──────────────────────────────────────────────────────────

  async function handleIdPwSubmit(data: {
    bankId: string;
    bankPassword: string;
    accountName: string;
    accountNum: string;
  }) {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/codef/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: selected.code,
          businessType: selected.type,
          loginType: "1",
          bankId: data.bankId,
          bankPassword: data.bankPassword,
          accountName: data.accountName,
          accountNum: data.accountNum,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { error: string }).error ?? "연동 실패");
      onSuccess((json as { account: unknown }).account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "연결 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{STEP_TITLES[step]}</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {step === "org" && (
            <>
              {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
              <OrgGrid orgs={orgs} onSelect={handleOrgSelect} />
            </>
          )}

          {step === "method" && selected && (
            <AuthMethodPicker org={selected} onSelect={handleMethodSelect} onBack={goToOrg} />
          )}

          {step === "idpw" && selected && (
            <CredentialForm
              org={selected}
              onBack={goToMethod}
              onSubmit={handleIdPwSubmit}
              loading={loading}
              error={error}
            />
          )}

          {step === "simple" && selected && (
            <SimpleAuthForm org={selected} onBack={goToMethod} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
