"use client";

/**
 * usePoints — SWR-backed hook for point CRUD operations.
 *
 * Fetches all points for the current user with a 2-minute deduping
 * window. Points are split into apptech/loyalty arrays for convenience.
 * Mutations optimistically update the cache.
 */

import useSWR from "swr";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PointType = "APPTECH" | "LOYALTY";
export type PointHistoryType = "EARN" | "USE" | "EXPIRE";

export interface PointHistory {
  id: string;
  pointId: string;
  amount: number | string;
  type: PointHistoryType;
  date: string;
  description: string | null;
  createdAt: string;
}

export interface Point {
  id: string;
  userId: string;
  provider: string;
  type: PointType;
  balance: number | string;
  lastUpdated: string;
  expiresAt: string | null;
  createdAt: string;
  history?: PointHistory[];
  _count?: { history: number };
}

export interface CreatePointData {
  provider: string;
  type: PointType;
  balance?: number;
  expiresAt?: string | null;
  description?: string;
}

export interface UpdatePointData {
  balance: number;
  expiresAt?: string | null;
  description?: string;
}

/** Returns the SWR key for points, supporting optional type filter. */
function pointsKey(type?: PointType): string {
  return type ? `/api/points?type=${type}` : "/api/points";
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePoints(filterType?: PointType) {
  const key = pointsKey(filterType);

  const { data, error, isLoading, mutate } = useSWR<Point[]>(key, {
    // Point balances: moderate freshness — 2-minute dedupe
    dedupingInterval: 2 * 60 * 1000,
  });

  /**
   * Manually trigger a refetch.
   * Keeps the same call signature as the original hook.
   */
  const fetchPoints = useCallback(
    async (_type?: PointType) => { // eslint-disable-line @typescript-eslint/no-unused-vars
      await mutate();
    },
    [mutate]
  );

  /** Create or upsert a point entry. */
  const createPoint = useCallback(
    async (payload: CreatePointData): Promise<Point | null> => {
      try {
        const res = await fetch("/api/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to create point");
        }
        const created: Point = await res.json();

        await mutate(
          (prev) => {
            if (!prev) return [created];
            // Replace if the provider already exists in local state
            const exists = prev.some((p) => p.id === created.id);
            return exists
              ? prev.map((p) => (p.id === created.id ? created : p))
              : [...prev, created];
          },
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

  /** Update point balance. Internally computes delta for history. */
  const updatePoint = useCallback(
    async (id: string, payload: UpdatePointData): Promise<Point | null> => {
      try {
        const res = await fetch(`/api/points/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to update point");
        }
        const updated: Point = await res.json();

        await mutate(
          (prev) => prev?.map((p) => (p.id === id ? updated : p)),
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

  /** Delete a point entry and its history. */
  const deletePoint = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/points/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to delete point");
        }

        await mutate(
          (prev) => prev?.filter((p) => p.id !== id),
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

  // Derived lists split by type
  const points = data ?? [];
  const apptechPoints = points.filter((p) => p.type === "APPTECH");
  const loyaltyPoints = points.filter((p) => p.type === "LOYALTY");

  return {
    points,
    apptechPoints,
    loyaltyPoints,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    fetchPoints,
    createPoint,
    updatePoint,
    deletePoint,
    /** Expose raw SWR mutate for advanced use cases. */
    refetch: () => mutate(),
  };
}
