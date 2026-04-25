"use client";

/**
 * useBudgets — SWR-backed hook for budget CRUD operations.
 *
 * The SWR key is parameterised by year/month so navigating between months
 * uses the cache immediately. Deduping interval is 2 minutes (budgets
 * change infrequently but are financial data — moderate freshness needed).
 *
 * Usage patterns:
 *   A) useBudgets(year, month)         — key known at mount time
 *   B) useBudgets() + fetchBudgets(y,m) — key set imperatively (legacy pattern)
 */
import useSWR, { useSWRConfig } from "swr";
import { useCallback, useState } from "react";
import type { BudgetStatus } from "@/lib/wallet/budget";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface Budget {
  id: string;
  categoryId: string;
  category: BudgetCategory;
  amount: number;
  spent: number;
  remaining: number;
  percent: number;
  status: BudgetStatus;
  month: number;
  year: number;
}

export interface CreateBudgetData {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface UpdateBudgetData {
  amount: number;
}

/** Returns the SWR cache key for a given year/month. */
export function budgetsKey(year: number, month: number): string {
  return `/api/budgets?year=${year}&month=${month}`;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBudgets(initialYear?: number, initialMonth?: number) {
  const { mutate: globalMutate } = useSWRConfig();

  // Internal year/month state — enables the legacy fetchBudgets(y, m) pattern
  const [activeYear, setActiveYear] = useState<number | undefined>(initialYear);
  const [activeMonth, setActiveMonth] = useState<number | undefined>(initialMonth);

  // Derive SWR key; null suspends fetching until year+month are known
  const key =
    activeYear != null && activeMonth != null
      ? budgetsKey(activeYear, activeMonth)
      : null;

  const { data, error, isLoading, mutate } = useSWR<Budget[]>(key, {
    // Budget data: moderate freshness — 2-minute dedupe
    dedupingInterval: 2 * 60 * 1000,
  });

  /**
   * Fetch budgets for the given year/month.
   * Updates internal state so the SWR key changes and a fresh fetch is triggered.
   * Matches the original hook's imperative call pattern.
   */
  const fetchBudgets = useCallback(
    async (year: number, month: number) => {
      setActiveYear(year);
      setActiveMonth(month);
      // If the key hasn't changed (same y/m), force a revalidation
      if (year === activeYear && month === activeMonth) {
        await globalMutate(budgetsKey(year, month));
      }
    },
    [activeYear, activeMonth, globalMutate]
  );

  /** Create or update a budget (upsert), then revalidate computed fields. */
  const createBudget = useCallback(
    async (payload: CreateBudgetData): Promise<Budget | null> => {
      try {
        const res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to create budget");
        }
        // Revalidate to get server-computed fields (spent, remaining, percent)
        await mutate();
        return null;
      } catch (err) {
        throw err;
      }
    },
    [mutate]
  );

  /** Update a budget's amount, then revalidate computed fields. */
  const updateBudget = useCallback(
    async (
      id: string,
      payload: UpdateBudgetData,
      _year: number, // eslint-disable-line @typescript-eslint/no-unused-vars
      _month: number // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<boolean> => {
      try {
        const res = await fetch(`/api/budgets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to update budget");
        }
        await mutate();
        return true;
      } catch (err) {
        throw err;
      }
    },
    [mutate]
  );

  /** Delete a budget by id. */
  const deleteBudget = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (id: string, _year: number, _month: number): Promise<boolean> => {
      try {
        const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to delete budget");
        }
        await mutate(
          (prev) => prev?.filter((b) => b.id !== id),
          { revalidate: false }
        );
        return true;
      } catch (err) {
        await mutate();
        throw err;
      }
    },
    [mutate]
  );

  return {
    budgets: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    /** Expose raw SWR mutate for advanced use cases. */
    refetch: () => mutate(),
  };
}
