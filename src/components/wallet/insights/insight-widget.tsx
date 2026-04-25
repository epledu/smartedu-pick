"use client";

/**
 * InsightWidget — compact dashboard widget showing top 3 insights.
 *
 * Renders severity-colored icons with brief messages.
 * Includes a "더 보기" link to the full insights page.
 */
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Calendar,
  Store,
  AlertTriangle,
  Info,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import type { Insight, InsightSeverity } from "@/lib/wallet/insights";

// ---------------------------------------------------------------------------
// Icon registry
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
// Severity dot colors
// ---------------------------------------------------------------------------

const SEVERITY_DOT: Record<InsightSeverity, string> = {
  critical: "bg-red-500",
  warning: "bg-yellow-400",
  info: "bg-blue-400",
  positive: "bg-green-500",
};

const SEVERITY_ICON: Record<InsightSeverity, string> = {
  critical: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  positive: "text-green-500",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface InsightWidgetProps {
  insights: Insight[];
  isLoading?: boolean;
}

export function InsightWidget({ insights, isLoading }: InsightWidgetProps) {
  const top3 = insights.slice(0, 3);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-semibold text-gray-800">소비 인사이트</h2>
        </div>
        <Link href="/wallet/insights" className="text-xs text-blue-500 hover:underline">
          더 보기
        </Link>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : top3.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            더 많은 거래를 기록하면 인사이트가 표시됩니다.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {top3.map((insight, idx) => {
              const IconComponent = ICON_MAP[insight.icon] ?? Info;
              return (
                <li key={idx} className="flex items-start gap-2.5">
                  {/* Severity dot */}
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[insight.severity]}`}
                  />
                  {/* Icon */}
                  <IconComponent
                    className={`mt-0.5 w-4 h-4 shrink-0 ${SEVERITY_ICON[insight.severity]}`}
                  />
                  {/* Message */}
                  <p className="text-xs text-gray-700 leading-snug line-clamp-2">
                    {insight.message}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
