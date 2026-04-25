"use client";

/**
 * Insights page — displays all spending pattern insights grouped by severity.
 */
import { Sparkles } from "lucide-react";
import { useInsights } from "@/hooks/wallet/use-insights";
import { InsightList } from "@/components/wallet/insights/insight-list";

export default function InsightsPage() {
  const { insights, isLoading, error } = useInsights();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page header */}
      <header className="bg-white px-4 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h1 className="text-xl font-bold text-gray-900">소비 인사이트</h1>
        </div>
        <p className="text-sm text-gray-500">
          지출 패턴을 분석해 맞춤 인사이트를 제공합니다.
        </p>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">
        <InsightList insights={insights} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
