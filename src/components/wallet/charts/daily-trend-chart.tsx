"use client";

/**
 * DailyTrendChart
 *
 * Recharts BarChart showing daily income and expense for a period.
 * Blue bars = income, red bars = expense.
 * Axis, grid, and tooltip colors adapt to the current light/dark theme.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { DailyStat } from "@/hooks/wallet/use-statistics";
import { useTheme } from "@/components/wallet/providers/theme-provider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  data: DailyStat[];
}

// ---------------------------------------------------------------------------
// Y-axis tick formatter
// ---------------------------------------------------------------------------

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DailyTrendChart({ data }: Props) {
  // Detect current theme — must be called inside the component (hook rules)
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-aware colors for Recharts SVG props (cannot use Tailwind here)
  const axisColor = isDark ? "#9ca3af" : "#6b7280";   // gray-400 / gray-500
  const gridColor = isDark ? "#374151" : "#e5e7eb";   // gray-700 / gray-200

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        데이터가 없습니다.
      </div>
    );
  }

  // Only render days with a short label (day of month)
  const tickFormatter = (value: string) => {
    try {
      const d = parseISO(value);
      const day = d.getDate();
      // Show label every 5 days to avoid crowding
      return day % 5 === 1 || day === 1 ? String(day) : "";
    } catch {
      return "";
    }
  };

  // Theme-aware tooltip container styles
  const tooltipStyle: React.CSSProperties = {
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
    borderRadius: 8,
    color: isDark ? "#f3f4f6" : "#111827",
    fontSize: 12,
  };

  // Custom label formatter: ISO date string → "M월 d일"
  // label can be ReactNode per Recharts types, so we cast safely
  const labelFormatter = (label: unknown) => {
    try {
      return format(parseISO(String(label)), "M월 d일");
    } catch {
      return String(label);
    }
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          {/* contentStyle drives tooltip appearance without a custom component */}
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: isDark ? "#f3f4f6" : "#111827", fontWeight: 600 }}
            itemStyle={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            labelFormatter={labelFormatter as Parameters<typeof Tooltip>[0]["labelFormatter"]}
          />
          <Bar dataKey="income" name="수입" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={12} />
          <Bar dataKey="expense" name="지출" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={12} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend below chart — more readable on narrow screens */}
      <div className="flex justify-center gap-4 mt-2">
        <span className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />
          수입
        </span>
        <span className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
          지출
        </span>
      </div>
    </div>
  );
}
