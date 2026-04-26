/**
 * GET /api/insights
 *
 * Returns the authenticated user's spending insights, computed by the
 * shared insights-loader so the dashboard Server Component widget and
 * the /wallet/insights client page execute identical logic.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import { loadInsights } from "@/lib/wallet/insights-loader";

type SessionUser = { id: string };

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const insights = await loadInsights(userId);
    return NextResponse.json(insights, {
      headers: {
        // Browser-private cache: instant within 60s, stale-while-revalidate up to 5 min.
        "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[GET /api/insights]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
