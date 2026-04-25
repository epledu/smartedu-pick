"use client";

/**
 * useRecurring — custom hook for recurring expense CRUD and processing.
 *
 * Manages local state and wraps all /api/recurring endpoints.
 * Follows the same pattern as use-categories.ts.
 */

import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecurringCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface RecurringAccount {
  id: string;
  name: string;
  type: string;
}

export type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface RecurringExpense {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  frequency: Frequency;
  dayOfMonth: number | null;
  nextDueDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: RecurringCategory | null;
  account: RecurringAccount | null;
}

export interface CreateRecurringData {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  frequency: Frequency;
  dayOfMonth?: number;
  nextDueDate: string;
  isActive?: boolean;
}

export interface UpdateRecurringData {
  amount?: number;
  description?: string;
  isActive?: boolean;
  nextDueDate?: string;
  categoryId?: string;
  accountId?: string;
  dayOfMonth?: number | null;
}

export interface RunResult {
  processed: number;
  transactions: Array<{
    id: string;
    recurringExpenseId: string;
    description: string;
    amount: number;
    accountId: string;
    categoryId: string;
    date: string;
  }>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useRecurring() {
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch all recurring expenses for the current user. */
  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recurring");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to fetch recurring expenses");
      }
      const data: RecurringExpense[] = await res.json();
      setRecurring(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Create a new recurring expense. */
  const createRecurring = useCallback(
    async (data: CreateRecurringData): Promise<RecurringExpense | null> => {
      setError(null);
      try {
        const res = await fetch("/api/recurring", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to create recurring expense");
        }
        const created: RecurringExpense = await res.json();
        setRecurring((prev) =>
          [...prev, created].sort(
            (a, b) =>
              new Date(a.nextDueDate).getTime() -
              new Date(b.nextDueDate).getTime()
          )
        );
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      }
    },
    []
  );

  /** Update an existing recurring expense. */
  const updateRecurring = useCallback(
    async (
      id: string,
      data: UpdateRecurringData
    ): Promise<RecurringExpense | null> => {
      setError(null);
      try {
        const res = await fetch(`/api/recurring/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to update recurring expense");
        }
        const updated: RecurringExpense = await res.json();
        setRecurring((prev) => prev.map((e) => (e.id === id ? updated : e)));
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      }
    },
    []
  );

  /** Delete a recurring expense. */
  const deleteRecurring = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to delete recurring expense");
      }
      setRecurring((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, []);

  /** Trigger processing of all due recurring expenses. */
  const runRecurring = useCallback(async (): Promise<RunResult | null> => {
    setError(null);
    try {
      const res = await fetch("/api/recurring/run", { method: "POST" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to run recurring expenses");
      }
      const result: RunResult = await res.json();
      // Refresh local state after processing
      await fetchRecurring();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  }, [fetchRecurring]);

  return {
    recurring,
    loading,
    error,
    fetchRecurring,
    createRecurring,
    updateRecurring,
    deleteRecurring,
    runRecurring,
  };
}
