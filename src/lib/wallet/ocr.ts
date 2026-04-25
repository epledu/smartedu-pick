/**
 * Unified OCR interface.
 *
 * Selects the Google Vision backend when GOOGLE_VISION_API_KEY is set;
 * otherwise falls back to the mock implementation transparently.
 *
 * All callers should import from this module rather than the individual
 * backend modules so that the provider switch is centralised.
 */

import { extractReceiptData as extractMock } from "./ocr-mock";
import { extractReceiptDataGoogleVision } from "./ocr-google-vision";
import type { OCRResult } from "./ocr-mock";

export type { OCRResult };

/** Identifies which OCR backend produced the result. */
export type OCRProvider = "google-vision" | "mock";

export type OCRResultWithProvider = OCRResult & { provider: OCRProvider };

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract receipt data from an uploaded image.
 *
 * Strategy:
 *  1. If GOOGLE_VISION_API_KEY is set and imageBase64 is provided → try Vision.
 *  2. If Vision fails (network error, quota, etc.) → fall back to mock.
 *  3. Otherwise → use mock directly.
 *
 * @param imageFile   - Original File object (used by the mock backend).
 * @param imageBase64 - Base64-encoded image bytes (used by Google Vision).
 */
export async function extractReceipt(
  imageFile: File,
  imageBase64?: string
): Promise<OCRResultWithProvider> {
  const hasGoogleKey = !!process.env.GOOGLE_VISION_API_KEY;

  if (hasGoogleKey && imageBase64) {
    try {
      const result = await extractReceiptDataGoogleVision(imageBase64);
      return { ...result, provider: "google-vision" };
    } catch (error) {
      console.error("[OCR] Google Vision failed, falling back to mock:", error);
      // Fall through to mock
    }
  }

  const mockResult = await extractMock(imageFile);
  return { ...mockResult, provider: "mock" };
}
