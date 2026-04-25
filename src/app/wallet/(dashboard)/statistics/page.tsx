"use client";

/**
 * Statistics page
 *
 * Displays aggregated spending/income analytics for a chosen period.
 * Supports month, last-month, year, and custom month/year selection.
 */
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useStatistics, type StatPeriod } from "@/hooks/wallet/use-statistics";
import StatSummaryCards from "@/components/wallet/charts/stat-summary-cards";
import MonthComparison from "@/components/wallet/charts/month-comparison";
import CategoryPieChart from "@/components/wallet/charts/category-pie-chart";
import DailyTrendChart from "@/components/wallet/charts/daily-trend-chart";
import { formatCurrency } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Period presets
// ---------------------------------------------------------------------------

type PresetKey = "this-month" | "last-month" | "this-year" | "custom";

interface PeriodState {
  period: StatPeriod;
  year: number;
  month: number;
}

function getPresetState(key: PresetKey, customYear: number, customMonth: number): PeriodState {
  const now = new Date();
  if (key === "this-month") {
    return { period: "month", year: now.getFullYear(), month: now.getMonth() + 1 };
  }
  if (key === "last-month") {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { period: "month", year: prev.getFullYear(), month: prev.getMonth() + 1 };
  }
  if (key === "this-year") {
    return { period: "year", year: now.getFullYear(), month: 1 };
  }
  return { period: "month", year: customYear, month: customMonth };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StatisticsPage() {
  const now = new Date();

  const [preset, setPreset] = useState<PresetKey>("this-month");
  const [customYear, setCustomYear] = useState(now.getFullYear());
  const [customMonth, setCustomMonth] = useState(now.getMonth() + 1);

  const periodState = getPresetState(preset, customYear, customMonth);
  const { data, loading, error, refetch } = useStatistics(
    periodState.period,
    periodState.year,
    periodState.month
  );

  // Build year options (5 years back)
  const yearOptions = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  const PRESETS: { key: PresetKey; label: string }[] = [
    { key: "this-month", label: "이번 달" },
    { key: "last-month", label: "지난 달" },
    { key: "this-year", label: "올해" },
    { key: "custom", label: "직접 선택" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-0 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">통계</h1>
        <button
          onClick={refetch}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-40 transition-colors"
          aria-label="새로고침"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              preset === p.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}

        {preset === "custom" && (
          <div className="flex items-center gap-2 ml-2">
            <select
              value={customYear}
              onChange={(e) => setCustomYear(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select
              value={customMonth}
              onChange={(e) => setCustomMonth(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 border border-red-200">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="space-y-3 sm:space-y-4 animate-pulse">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 sm:h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="h-28 sm:h-32 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="h-56 sm:h-64 bg-gray-100 rounded-xl" />
            <div className="h-56 sm:h-64 bg-gray-100 rounded-xl" />
          </div>
        </div>
      )}

      {/* Main content */}
      {data && (
        <>
          {/* Summary cards */}
          <StatSummaryCards summary={data.summary} />

          {/* Month comparison */}
          {periodState.period === "month" && (
            <MonthComparison
              thisMonth={data.monthOverMonth.thisMonth}
              lastMonth={data.monthOverMonth.lastMonth}
              changePercent={data.monthOverMonth.changePercent}
            />
          )}

          {/* Charts grid — single column on mobile, 2 cols on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Category pie */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">카테고리별 지출</h2>
              <CategoryPieChart data={data.byCategory} />
            </div>

            {/* Daily trend */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">일별 수입/지출</h2>
              <DailyTrendChart data={data.dailyTrend} />
            </div>
          </div>

          {/* Account breakdown table */}
          {data.byAccount.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">계좌별 지출</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 font-medium text-gray-500 text-xs">계좌</th>
                      <th className="text-right py-2 font-medium text-gray-500 text-xs">지출 합계</th>
                      <th className="text-right py-2 pl-4 font-medium text-gray-500 text-xs">비중</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byAccount.map((acc) => {
                      const pct = data.summary.totalExpense > 0
                        ? Math.round((acc.total / data.summary.totalExpense) * 100)
                        : 0;
                      return (
                        <tr key={acc.accountId} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 pr-4">
                            <span className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: acc.color ?? "#94a3b8" }}
                              />
                              {acc.name}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-medium text-gray-800">
                            {formatCurrency(acc.total)}
                          </td>
                          <td className="py-2.5 pl-4 text-right text-gray-500">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
