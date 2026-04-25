"use client";

/**
 * InsightCard — renders a single spending insight.
 *
 * Left border color reflects severity:
 *   positive → green | info → blue | warning → yellow | critical → red
 *
 * The icon name maps to a lucide-react component loaded lazily.
 */
import type { Insight, InsightSeverity } from "@/lib/wallet/insights";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Calendar,
  Store,
  AlertTriangle,
  Info,
  LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Icon registry — add more as needed
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  TrendingDown,
  Zap,
  Calendar,
  Store,
  AlertTriangle,
  Info,
};

// ---------------------------------------------------------------------------
// Severity styles
// ---------------------------------------------------------------------------

const SEVERITY_STYLES: Record<InsightSeverity, { border: string; bg: string; icon: string }> = {
  positive: { border: "border-l-green-500", bg: "bg-green-50", icon: "text-green-600" },
  info: { border: "border-l-blue-400", bg: "bg-blue-50", icon: "text-blue-600" },
  warning: { border: "border-l-yellow-400", bg: "bg-yellow-50", icon: "text-yellow-600" },
  critical: { border: "border-l-red-500", bg: "bg-red-50", icon: "text-red-600" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const styles = SEVERITY_STYLES[insight.severity];
  const IconComponent = ICON_MAP[insight.icon] ?? Info;

  // Render top-merchant detail list if available
  const merchants =
    insight.type === "top_merchant" && insight.data?.merchants
      ? (insight.data.merchants as { merchantName: string; count: number; totalAmount: number }[])
      : null;

  return (
    <div
      className={`
        flex gap-3 p-4 rounded-xl border-l-4 ${styles.border} ${styles.bg}
        shadow-sm border border-gray-100
      `}
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 ${styles.icon}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug">{insight.message}</p>

        {/* Optional merchant detail */}
        {merchants && merchants.length > 0 && (
          <ul className="mt-2 space-y-1">
            {merchants.map((m) => (
              <li key={m.merchantName} className="flex justify-between text-xs text-gray-600">
                <span>{m.merchantName}</span>
                <span className="font-medium">{m.count}회</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
