"use client";

/**
 * useBanking — hook for CODEF Open Banking operations.
 *
 * Provides helpers to:
 *  - Fetch connected accounts (those with codefConnectedId in DB)
 *  - Trigger a real CODEF sync for a connected account
 *  - Disconnect (delete) a connected account
 *
 * The connect flow is handled directly in BankSelector via /api/codef/connect.
 */

import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Simple auth request/response types (mirrored from API route)
// ---------------------------------------------------------------------------

export interface SimpleAuthInitBody {
  organization: string;
  businessType: "BK" | "CD";
  loginType: string;
  userName: string;
  birthDate: string;
  phoneNo: string;
  telecom: string;
  gender: "1" | "2";
  accountName?: string;
  accountNum?: string;
}

export interface SimpleAuthCompleteBody {
  token: string;
  accountName?: string;
  accountType?: "BANK" | "CARD";
  accountNum?: string;
}

export interface SimpleAuthInitResult {
  status: "pending" | "connected";
  token?: string;
  connectedId?: string;
  error?: string;
}

export interface SimpleAuthCompleteResult {
  status: "connected";
  account?: unknown;
  error?: string;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConnectedAccount {
  id: string;
  name: string;
  type: "BANK" | "CARD";
  /** Stores the CODEF org code when connected via CODEF. */
  icon: string | null;
  balance: number | string;
  currency: string;
  isActive: boolean;
  codefConnectedId: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export interface SyncHistoryEntry {
  syncedAt: string;
  count: number;
  totalAmount: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBanking() {
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all accounts that have a CODEF connectedId (real bank connections).
   * Falls back to accounts prefixed with "[연동]" for backward compatibility
   * with mock-connected accounts that have no codefConnectedId yet.
   */
  const getConnectedAccounts = useCallback(async (): Promise<ConnectedAccount[]> => {
    setError(null);
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("계좌 목록 조회 실패");
      const all: ConnectedAccount[] = await res.json();
      // Include any account that is CODEF-connected or carries the [연동] prefix
      return all.filter(
        (a) => a.codefConnectedId || a.name.startsWith("[연동]"),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      return [];
    }
  }, []);

  /**
   * Trigger a CODEF sync for the given account.
   * Returns the sync result summary or null on failure.
   */
  const syncAccount = useCallback(async (accountId: string): Promise<SyncResult | null> => {
    setSyncLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/codef/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? "동기화 실패");
      }
      return data as SyncResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : "동기화 중 오류가 발생했습니다.");
      return null;
    } finally {
      setSyncLoading(false);
    }
  }, []);

  /**
   * Fetch per-account sync history (delegated to the banking/sync-history endpoint).
   */
  const getSyncHistory = useCallback(
    async (accountId: string): Promise<SyncHistoryEntry[]> => {
      try {
        const res = await fetch(`/api/banking/sync-history?accountId=${accountId}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data as { history?: SyncHistoryEntry[] }).history ?? [];
      } catch {
        return [];
      }
    },
    [],
  );

  /**
   * Step 1 — Request a push notification to the user's phone.
   * Returns { status: "pending", token } or { status: "connected", connectedId }.
   */
  async function initSimpleAuth(data: SimpleAuthInitBody): Promise<SimpleAuthInitResult> {
    setError(null);
    try {
      const res = await fetch("/api/codef/simple-auth?mode=init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return (await res.json()) as SimpleAuthInitResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "간편인증 요청 실패";
      setError(message);
      return { status: "pending", error: message };
    }
  }

  /**
   * Step 2 — Confirm after the user approves on their phone.
   * Returns { status: "connected", account } on success.
   */
  async function completeSimpleAuth(data: SimpleAuthCompleteBody): Promise<SimpleAuthCompleteResult> {
    setError(null);
    try {
      const res = await fetch("/api/codef/simple-auth?mode=complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return (await res.json()) as SimpleAuthCompleteResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "간편인증 완료 실패";
      setError(message);
      return { status: "connected", error: message };
    }
  }

  return {
    syncAccount,
    getConnectedAccounts,
    getSyncHistory,
    initSimpleAuth,
    completeSimpleAuth,
    syncLoading,
    error,
  };
}
