/**
 * API route: /api/ocr/status
 *
 * Returns current OCR configuration so the UI can render the correct banner.
 */
import { NextResponse } from "next/server";

export async function GET() {
  const hasGoogleVision = !!process.env.GOOGLE_VISION_API_KEY;

  return NextResponse.json({
    provider: hasGoogleVision ? "google-vision" : "mock",
    configured: hasGoogleVision,
  });
}
