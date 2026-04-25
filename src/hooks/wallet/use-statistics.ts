"use client";

/**
 * useStatistics
 *
 * Fetches aggregated statistics from /api/statistics.
 * Supports monthly and yearly periods.
 */
import { useState, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CategoryStat {
  categoryId: string;
  name: string;
  color: string | null;
  total: number;
  percent: number;
  count: number;
}

export interface AccountStat {
  accountId: string;
  name: string;
  color: string | null;
  total: number;
}

export interface DailyStat {
  date: string; // "yyyy-MM-dd"
  income: number;
  expense: number;
}

export interface StatSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionCount: number;
  avgDailyExpense: number;
}

export interface MonthOverMonth {
  thisMonth: number;
  lastMonth: number;
  changePercent: number;
}

export interface StatisticsData {
  byCategory: CategoryStat[];
  byAccount: AccountStat[];
  dailyTrend: DailyStat[];
  summary: StatSummary;
  monthOverMonth: MonthOverMonth;
}

export type StatPeriod = "month" | "year";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useStatistics(period: StatPeriod, year: number, month: number) {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ period, year: String(year), month: String(month) });
      const res = await fetch(`/api/statistics?${params.toString()}`);
      if (!res.ok) throw new Error("통계 데이터를 불러오지 못했습니다.");
      const json: StatisticsData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, [period, year, month]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}
