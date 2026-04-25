"use client";

/**
 * useAccounts — SWR-backed hook for account CRUD operations.
 *
 * List fetching uses useSWR with a 5-minute deduping window (accounts
 * rarely change). Mutations call the REST API directly and update the
 * SWR cache optimistically to avoid a full network refetch.
 */

import useSWR, { mutate as globalMutate } from "swr";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AccountType = "BANK" | "CARD" | "CASH" | "EPAY";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number | string;
  currency: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { transactions: number };
}

export interface CreateAccountData {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
}

export interface UpdateAccountData {
  name?: string;
  type?: AccountType;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

/** Returns the SWR key for accounts, supporting optional all=true flag. */
function accountsKey(includeInactive = false) {
  return includeInactive ? "/api/accounts?all=true" : "/api/accounts";
}

// Default key (active accounts only)
const ACCOUNTS_KEY = accountsKey(false);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAccounts(includeInactive = false) {
  const key = accountsKey(includeInactive);

  const { data, error, isLoading, mutate } = useSWR<Account[]>(key, {
    // Accounts rarely change — extend dedupe to 5 minutes
    dedupingInterval: 5 * 60 * 1000,
  });

  /** Trigger a manual refetch of the accounts list. */
  const fetchAccounts = useCallback(
    async (_includeInactive = false) => { // eslint-disable-line @typescript-eslint/no-unused-vars
      await mutate();
    },
    [mutate]
  );

  /** Create a new financial account. */
  const createAccount = useCallback(
    async (payload: CreateAccountData): Promise<Account | null> => {
      try {
        const res = await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to create account");
        }

        const created: Account = await res.json();

        await mutate(
          (prev) => [...(prev ?? []), created],
          { revalidate: false }
        );

        return created;
      } catch (err) {
        await mutate();
        throw err;
      }
    },
    [mutate]
  );

  /** Update an existing account. */
  const updateAccount = useCallback(
    async (id: string, payload: UpdateAccountData): Promise<Account | null> => {
      try {
        const res = await fetch(`/api/accounts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to update account");
        }

        const updated: Account = await res.json();

        await mutate(
          (prev) => prev?.map((a) => (a.id === id ? updated : a)),
          { revalidate: false }
        );

        return updated;
      } catch (err) {
        await mutate();
        throw err;
      }
    },
    [mutate]
  );

  /** Delete or soft-delete an account. */
  const deleteAccount = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to delete account");
        }

        const result = await res.json();

        if (result.softDeleted) {
          // Mark inactive in local state rather than removing
          await mutate(
            (prev) =>
              prev?.map((a) => (a.id === id ? { ...a, isActive: false } : a)),
            { revalidate: false }
          );
        } else {
          await mutate(
            (prev) => prev?.filter((a) => a.id !== id),
            { revalidate: false }
          );
        }

        return true;
      } catch (err) {
        await mutate();
        throw err;
      }
    },
    [mutate]
  );

  return {
    accounts: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    /** Expose raw SWR mutate for advanced use cases. */
    refetch: () => mutate(),
  };
}

/** Prefetch active accounts into the SWR cache (call on hover/focus). */
export function prefetchAccounts() {
  globalMutate(ACCOUNTS_KEY);
}
