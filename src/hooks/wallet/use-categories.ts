"use client";

/**
 * useCategories — SWR-backed hook for category CRUD operations.
 *
 * List fetching uses useSWR with a 5-minute deduping window (categories
 * rarely change). Mutations call the REST API directly, then call
 * mutate() to keep the SWR cache in sync without a full refetch.
 */

import useSWR, { mutate as globalMutate } from "swr";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
  parentId: string | null;
  sortOrder: number;
  userId: string | null;
  _count?: { transactions: number };
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

// SWR cache key for the categories list
const CATEGORIES_KEY = "/api/categories";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    CATEGORIES_KEY,
    {
      // Categories rarely change — extend dedupe to 5 minutes
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  /** Trigger a manual refetch of the categories list. */
  const fetchCategories = useCallback(async () => {
    await mutate();
  }, [mutate]);

  /** Create a new custom category. */
  const createCategory = useCallback(
    async (payload: CreateCategoryData): Promise<Category | null> => {
      try {
        const res = await fetch(CATEGORIES_KEY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to create category");
        }

        const created: Category = await res.json();

        // Optimistically update cache and sort by sortOrder
        await mutate(
          (prev) =>
            [...(prev ?? []), created].sort((a, b) => a.sortOrder - b.sortOrder),
          { revalidate: false }
        );

        return created;
      } catch (err) {
        // Revalidate to ensure consistency on error
        await mutate();
        throw err;
      }
    },
    [mutate]
  );

  /** Update an existing category. */
  const updateCategory = useCallback(
    async (id: string, payload: UpdateCategoryData): Promise<Category | null> => {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to update category");
        }

        const updated: Category = await res.json();

        await mutate(
          (prev) => prev?.map((c) => (c.id === id ? updated : c)),
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

  /** Delete a custom category (transactions are moved to "미분류"). */
  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to delete category");
        }

        await mutate(
          (prev) => prev?.filter((c) => c.id !== id),
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
    categories: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    /** Expose raw SWR mutate for advanced use cases. */
    refetch: () => mutate(),
  };
}

/** Prefetch categories into the SWR cache (call on hover/focus). */
export function prefetchCategories() {
  globalMutate(CATEGORIES_KEY);
}
