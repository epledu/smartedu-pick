"use client";

/**
 * CategoryPieChart
 *
 * Recharts PieChart showing expense breakdown by category.
 * Displays top 5 categories + "기타" for the rest.
 * Tooltip and legend text adapt to the current light/dark theme.
 */
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CategoryStat } from "@/hooks/wallet/use-statistics";
import { formatCurrency } from "@/lib/wallet/utils";
import { useTheme } from "@/components/wallet/providers/theme-provider";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

const OTHER_COLOR = "#94a3b8";
const MAX_SLICES = 5;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  data: CategoryStat[];
}

interface ChartEntry {
  name: string;
  value: number;
  percent: number;
  color: string;
}

// ---------------------------------------------------------------------------
// Custom Legend
// ---------------------------------------------------------------------------

/** Renders a color-dot + label + value list below the pie. */
function CustomLegend({ items, isDark }: { items: ChartEntry[]; isDark: boolean }) {
  return (
    <ul className="mt-2 space-y-1 text-xs">
      {items.map((entry) => (
        <li key={entry.name} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 truncate">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            {/* Label text adapts to theme */}
            <span className={`truncate ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {entry.name}
            </span>
          </span>
          <span className={`flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {entry.percent}% · {formatCurrency(entry.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CategoryPieChart({ data }: Props) {
  // Detect current theme — must be called inside the component (hook rules)
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        데이터가 없습니다.
      </div>
    );
  }

  // Build chart data: top MAX_SLICES + others aggregated
  const sorted = [...data].sort((a, b) => b.total - a.total);
  const top = sorted.slice(0, MAX_SLICES);
  const rest = sorted.slice(MAX_SLICES);

  const chartData: ChartEntry[] = top.map((c, i) => ({
    name: c.name,
    value: c.total,
    percent: c.percent,
    // Slice colors come from category data (brand-defined) — kept unchanged
    color: c.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));

  if (rest.length > 0) {
    const otherTotal = rest.reduce((s, c) => s + c.total, 0);
    const otherPercent = rest.reduce((s, c) => s + c.percent, 0);
    chartData.push({ name: "기타", value: otherTotal, percent: otherPercent, color: OTHER_COLOR });
  }

  // Theme-aware tooltip container styles (passed via contentStyle — no custom component needed)
  const tooltipStyle: React.CSSProperties = {
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
    borderRadius: 8,
    color: isDark ? "#f3f4f6" : "#111827",
    fontSize: 12,
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* Use contentStyle for theme-aware tooltip without custom component type issues */}
          <Tooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: isDark ? "#d1d5db" : "#4b5563" }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Custom legend below chart */}
      <CustomLegend items={chartData} isDark={isDark} />
    </div>
  );
}
