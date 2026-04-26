/**
 * GET /api/auth/providers-status
 *
 * Returns which OAuth providers have their environment variables configured.
 * Used by the login page to show "setup required" badges on unconfigured providers.
 * Does NOT expose any secrets — only boolean flags.
 *
 * Runs on the Edge runtime: no Prisma, no DB, no Node-only APIs — so cold
 * starts on the login page are an order of magnitude faster than the default
 * Node serverless function.
 */
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json(
    {
      google: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      kakao: !!process.env.KAKAO_CLIENT_ID && !!process.env.KAKAO_CLIENT_SECRET,
      naver: !!process.env.NAVER_CLIENT_ID && !!process.env.NAVER_CLIENT_SECRET,
      isDev: process.env.NODE_ENV === "development",
    },
    {
      headers: {
        // Public, immutable per deploy — cache aggressively at the CDN edge.
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
