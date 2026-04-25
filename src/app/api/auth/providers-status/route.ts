/**
 * GET /api/auth/providers-status
 *
 * Returns which OAuth providers have their environment variables configured.
 * Used by the login page to show "setup required" badges on unconfigured providers.
 * Does NOT expose any secrets — only boolean flags.
 */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    google: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    kakao: !!process.env.KAKAO_CLIENT_ID && !!process.env.KAKAO_CLIENT_SECRET,
    naver: !!process.env.NAVER_CLIENT_ID && !!process.env.NAVER_CLIENT_SECRET,
    isDev: process.env.NODE_ENV === "development",
  });
}
