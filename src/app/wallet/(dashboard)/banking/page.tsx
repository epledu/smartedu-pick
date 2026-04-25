"use client";

/**
 * Banking integration page (/banking) — CODEF real-data flow.
 *
 * Shows the CODEF environment banner, lists connected accounts
 * (fetched from DB via /api/accounts), and provides:
 *  - "새 연동 추가" → BankSelector modal (CODEF credential form)
 *  - "지금 동기화" per account → POST /api/codef/sync
 *  - Disconnect button per account → DELETE /api/accounts/:id
 */

import { useState, useEffect, useCallback } from "react";
import { Building2, Plus, AlertTriangle, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { useBanking, type ConnectedAccount, type SyncResult } from "@/hooks/wallet/use-banking";
import BankSelector from "@/components/wallet/banking/bank-selector";
import ConnectionCard from "@/components/wallet/banking/connection-card";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Determine the CODEF environment label for the dev banner (client-side). */
function getEnvLabel(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CODEF_ENV) {
    return process.env.NEXT_PUBLIC_CODEF_ENV;
  }
  return "demo";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BankingPage() {
  const { syncAccount, getConnectedAccounts, syncLoading, error } = useBanking();

  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [lastSyncMap, setLastSyncMap] = useState<Record<string, string>>({});
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const envLabel = getEnvLabel();
  const isDemoOrSandbox = envLabel !== "production";

  // ---------------------------------------------------------------------------
  // Load accounts
  // ---------------------------------------------------------------------------

  const loadAccounts = useCallback(async () => {
    setPageLoading(true);
    const list = await getConnectedAccounts();
    setAccounts(list);
    setPageLoading(false);

    // Use account.lastSyncedAt directly — no extra endpoint needed
    const map: Record<string, string> = {};
    for (const a of list) {
      if (a.lastSyncedAt) map[a.id] = a.lastSyncedAt;
    }
    setLastSyncMap(map);
  }, [getConnectedAccounts]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleConnectSuccess = (account: unknown) => {
    setShowSelector(false);
    setAccounts((prev) => [...prev, account as ConnectedAccount]);
  };

  const handleSync = async (accountId: string) => {
    setSyncingId(accountId);
    const result = await syncAccount(accountId);
    setSyncingId(null);
    if (result) {
      setSyncResult(result);
      setLastSyncMap((prev) => ({ ...prev, [accountId]: new Date().toISOString() }));
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm("이 계좌 연동을 해제하시겠습니까? 기존 거래 내역은 유지됩니다.")) return;
    await fetch(`/api/accounts/${accountId}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">은행/카드 연동</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 연동 추가
        </button>
      </div>

      {/* CODEF environment disclaimer */}
      {isDemoOrSandbox && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">
              CODEF {envLabel === "sandbox" ? "Sandbox" : "Demo"} 환경
            </p>
            <p className="mt-0.5 text-amber-700">
              실제 거래는 가져오지 않습니다 (테스트용 가상 데이터). 운영 환경 전환 후 실제 데이터가 동기화됩니다.
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Sync result banner */}
      {syncResult && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800 flex-1">
            <p className="font-semibold">동기화 완료</p>
            <p className="mt-0.5">
              {syncResult.imported}건 가져옴, {syncResult.skipped}건 중복 스킵
              {syncResult.errors.length > 0 && (
                <span className="ml-1 text-red-600">
                  · 오류 {syncResult.errors.length}건
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSyncResult(null)}
            className="text-green-600 hover:text-green-800 text-xs"
          >
            닫기
          </button>
        </div>
      )}

      {/* Connected accounts list */}
      {pageLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          불러오는 중...
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">연동된 계좌가 없습니다.</p>
          <button
            type="button"
            onClick={() => setShowSelector(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-indigo-300 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 계좌 연동하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              연동된 계좌 <span className="text-indigo-600">{accounts.length}개</span>
            </p>
            <button
              type="button"
              onClick={loadAccounts}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className="w-3 h-3" />
              새로고침
            </button>
          </div>

          {accounts.map((account) => (
            <ConnectionCard
              key={account.id}
              account={account}
              lastSyncedAt={lastSyncMap[account.id]}
              onSync={handleSync}
              onDisconnect={handleDisconnect}
              syncLoading={syncLoading && syncingId === account.id}
            />
          ))}
        </div>
      )}

      {/* Bank selector modal */}
      {showSelector && (
        <BankSelector
          onSuccess={handleConnectSuccess}
          onCancel={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
