"use client";

/**
 * InsightList — renders all insights grouped by severity.
 *
 * Shows an empty state prompt when no insights are available.
 * Supports loading and error states.
 */
import type { Insight, InsightSeverity } from "@/lib/wallet/insights";
import { InsightCard } from "./insight-card";

// ---------------------------------------------------------------------------
// Severity group metadata
// ---------------------------------------------------------------------------

interface SeverityGroup {
  severity: InsightSeverity;
  label: string;
}

const SEVERITY_GROUPS: SeverityGroup[] = [
  { severity: "critical", label: "즉시 확인 필요" },
  { severity: "warning", label: "주의가 필요한 항목" },
  { severity: "info", label: "소비 현황" },
  { severity: "positive", label: "잘 하고 있어요" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface InsightListProps {
  insights: Insight[];
  isLoading?: boolean;
  error?: string | null;
}

export function InsightList({ insights, isLoading, error }: InsightListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-sm text-red-500">
        인사이트를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-sm text-gray-500">
          더 많은 거래를 기록하면 맞춤 인사이트가 표시됩니다.
        </p>
      </div>
    );
  }

  // Group insights by severity
  const grouped = SEVERITY_GROUPS.map((g) => ({
    ...g,
    items: insights.filter((i) => i.severity === g.severity),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <section key={group.severity}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {group.label}
          </h3>
          <div className="space-y-3">
            {group.items.map((insight, idx) => (
              <InsightCard key={`${insight.type}-${idx}`} insight={insight} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
