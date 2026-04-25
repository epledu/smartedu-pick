"use client";

/**
 * useKPass and useUserType hooks.
 *
 * useKPass  - Fetches K-Pass status for a given year/month from the API.
 * useUserType - Reads and writes the user's K-Pass tier from localStorage.
 */
import { useState, useEffect, useCallback } from "react";
import type { KPassUserType } from "@/lib/wallet/kpass";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KPassMonthData {
  year: number;
  month: number;
  uses: number;
  eligibleUses: number;
  totalSpent: number;
  refundAmount: number;
  isEligible: boolean;
  remaining: number | null;
  progress: number;
}

export interface KPassHistoryItem {
  year: number;
  month: number;
  refundAmount: number;
  uses: number;
}

export interface KPassData {
  currentMonth: KPassMonthData;
  settings: { userType: KPassUserType; refundRate: number };
  history: KPassHistoryItem[];
  yearlyProjection: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "kpass_user_type";
const DEFAULT_USER_TYPE: KPassUserType = "regular";

// ---------------------------------------------------------------------------
// useKPass
// ---------------------------------------------------------------------------

/**
 * Fetches K-Pass status for the given month.
 * Re-fetches automatically when year, month, or userType changes.
 */
export function useKPass(year: number, month: number, userType: KPassUserType = "regular") {
  const [data, setData] = useState<KPassData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        year: String(year),
        month: String(month),
        userType,
      });
      const res = await fetch(`/api/kpass?${params.toString()}`);
      if (!res.ok) throw new Error("K-Pass 데이터를 불러오지 못했습니다.");
      const json: KPassData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [year, month, userType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ---------------------------------------------------------------------------
// useUserType
// ---------------------------------------------------------------------------

/**
 * Reads and persists the user's K-Pass tier to localStorage.
 * Falls back to "regular" when no value is stored.
 */
export function useUserType() {
  const [userType, setUserTypeState] = useState<KPassUserType>(DEFAULT_USER_TYPE);

  // Initialise from localStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "regular" || stored === "youth" || stored === "low_income") {
        setUserTypeState(stored);
      }
    } catch {
      // localStorage may be unavailable in SSR or private mode
    }
  }, []);

  const setUserType = useCallback((type: KPassUserType) => {
    try {
      localStorage.setItem(STORAGE_KEY, type);
    } catch {
      // ignore write errors
    }
    setUserTypeState(type);
  }, []);

  return { userType, setUserType };
}
