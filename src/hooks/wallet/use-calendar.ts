"use client";

/**
 * useCalendar hook
 *
 * Fetches monthly calendar data from /api/calendar and exposes
 * month-navigation helpers (nextMonth, prevMonth, setMonth, today).
 */
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DayData {
  income: number;
  expense: number;
  count: number;
}

export interface CalendarData {
  days: Record<string, DayData>;
  monthTotal: { income: number; expense: number };
}

interface UseCalendarReturn {
  data: CalendarData | null;
  loading: boolean;
  error: string | null;
  year: number;
  month: number;
  nextMonth: () => void;
  prevMonth: () => void;
  setMonth: (year: number, month: number) => void;
  goToday: () => void;
  refetch: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCalendar(
  initialYear?: number,
  initialMonth?: number
): UseCalendarReturn {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth() + 1);
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar data for current year/month
  const fetchData = useCallback(
    async (y: number, m: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/calendar?year=${y}&month=${m}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const json: CalendarData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Re-fetch whenever year or month changes
  useEffect(() => {
    fetchData(year, month);
  }, [year, month, fetchData]);

  // Navigation helpers — clamp to valid month range
  const nextMonth = useCallback(() => {
    setYear((y) => (month === 12 ? y + 1 : y));
    setMonth((m) => (m === 12 ? 1 : m + 1));
  }, [month]);

  const prevMonth = useCallback(() => {
    setYear((y) => (month === 1 ? y - 1 : y));
    setMonth((m) => (m === 1 ? 12 : m - 1));
  }, [month]);

  const setMonthHelper = useCallback((y: number, m: number) => {
    setYear(y);
    setMonth(m);
  }, []);

  const goToday = useCallback(() => {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  }, []);

  const refetch = useCallback(() => {
    fetchData(year, month);
  }, [year, month, fetchData]);

  return {
    data,
    loading,
    error,
    year,
    month,
    nextMonth,
    prevMonth,
    setMonth: setMonthHelper,
    goToday,
    refetch,
  };
}
