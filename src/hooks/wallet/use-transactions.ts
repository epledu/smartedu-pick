"use client";

/**
 * useTransactions — SWR-backed hook for transaction CRUD operations.
 *
 * List fetching uses useSWR with a 30-second deduping window (transactions
 * change frequently). Mutations are imperative and invalidate the SWR cache
 * after completion. Pagination state is derived from the SWR response.
 */
import useSWR from "swr";
import { useCallback, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface TransactionAccount {
  id: string;
  name: string;
  type: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  date: string;
  memo: string | null;
  merchantName: string | null;
  createdAt: string;
  updatedAt: string;
  category: TransactionCategory | null;
  account: TransactionAccount;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  accountId?: string;
  type?: "INCOME" | "EXPENSE" | "TRANSFER";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateTransactionData {
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  date: string;
  accountId: string;
  categoryId: string;
  memo?: string;
  merchantName?: string;
}

export interface UpdateTransactionData {
  type?: "INCOME" | "EXPENSE" | "TRANSFER";
  amount?: number;
  date?: string;
  categoryId?: string;
  memo?: string;
  merchantName?: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a deterministic query string from the filter object. */
function buildQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.accountId) params.set("accountId", filters.accountId);
  if (filters.type) params.set("type", filters.type);
  if (filters.search) params.set("search", filters.search);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  return params.toString();
}

/** Derives the SWR cache key from the current filters. */
export function transactionsKey(filters: TransactionFilters = {}): string {
  const qs = buildQuery(filters);
  return qs ? `/api/transactions?${qs}` : "/api/transactions";
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTransactions(initialFilters: TransactionFilters = {}) {
  // Active filters drive the SWR key, enabling automatic refetch on change
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const key = transactionsKey(filters);

  const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(key, {
    // Transactions change often — keep dedupe window short
    dedupingInterval: 30_000,
  });

  /**
   * Apply new filters, which changes the SWR key and triggers a fresh fetch.
   * Compatible with the old fetchTransactions(filters) call pattern.
   */
  const fetchTransactions = useCallback(
    async (newFilters: TransactionFilters = {}) => {
      setFilters(newFilters);
      // SWR will auto-fetch due to key change; force revalidate if key unchanged
      if (transactionsKey(newFilters) === key) {
        await mutate();
      }
    },
    [key, mutate]
  );

  const createTransaction = useCallback(
    async (payload: CreateTransactionData): Promise<Transaction | null> => {
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to create transaction");
        }
        const { transaction } = await res.json();
        // Revalidate so pagination counts stay correct
        await mutate();
        return transaction;
      } catch (err) {
        throw err;
      }
    },
    [mutate]
  );

  const updateTransaction = useCallback(
    async (
      id: string,
      payload: UpdateTransactionData
    ): Promise<Transaction | null> => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to update transaction");
        }
        const { transaction } = await res.json();
        // Optimistically patch the cached list
        await mutate(
          (prev) =>
            prev
              ? {
                  ...prev,
                  transactions: prev.transactions.map((t) =>
                    t.id === id ? transaction : t
                  ),
                }
              : prev,
          { revalidate: false }
        );
        return transaction;
      } catch (err) {
        await mutate();
        throw err;
      }
    },
    [mutate]
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to delete transaction");
        }
        await mutate(
          (prev) =>
            prev
              ? {
                  transactions: prev.transactions.filter((t) => t.id !== id),
                  pagination: {
                    ...prev.pagination,
                    totalCount: Math.max(0, prev.pagination.totalCount - 1),
                  },
                }
              : prev,
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

  const defaultPagination: Pagination = {
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  };

  return {
    transactions: data?.transactions ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    pagination: data?.pagination ?? defaultPagination,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    /** Expose raw SWR mutate for advanced use cases. */
    refetch: () => mutate(),
  };
}
