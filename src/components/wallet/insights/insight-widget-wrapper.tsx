"use client";

/**
 * InsightWidgetWrapper — client component that fetches insights and
 * renders InsightWidget. Used inside server-rendered dashboard pages.
 */
import { useInsights } from "@/hooks/wallet/use-insights";
import { InsightWidget } from "./insight-widget";

export function InsightWidgetWrapper() {
  const { insights, isLoading } = useInsights();
  return <InsightWidget insights={insights} isLoading={isLoading} />;
}
