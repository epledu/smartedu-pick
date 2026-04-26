/**
 * InsightWidgetServer — Server Component variant that runs the insights
 * computation on the request thread instead of going through /api/insights.
 *
 * The dashboard wraps this in a <Suspense> boundary so the rest of the
 * page paints immediately while insights stream in. Removing the client
 * fetch eliminates an entire serverless cold start from the critical path.
 */
import { loadInsights } from "@/lib/wallet/insights-loader";
import { InsightWidget } from "./insight-widget";

export async function InsightWidgetServer({ userId }: { userId: string }) {
  const insights = await loadInsights(userId);
  return <InsightWidget insights={insights} />;
}
