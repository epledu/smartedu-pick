/**
 * POST /api/ocr
 *
 * Accepts a multipart form upload containing a receipt image, runs OCR
 * (Google Vision when configured, otherwise mock), and returns the recognised
 * data along with an imageUrl.
 *
 * Storage strategy:
 *  - Local dev: writes the image to /public/uploads/ and returns the path.
 *  - Vercel serverless (read-only filesystem): falls back to a base64 data URL
 *    so the receipt thumbnail still works on the receipts page.
 */
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { extractReceipt } from "@/lib/wallet/ocr";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generates a URL-safe unique filename while preserving the original extension. */
function uniqueFilename(originalName: string): string {
  const ext = path.extname(originalName) || ".jpg";
  const uid = crypto.randomUUID().replace(/-/g, "");
  return `receipt_${uid}${ext}`;
}

/** Convert a Node.js Buffer to a base64 string (no data-URL prefix). */
function bufferToBase64(buf: Buffer): string {
  return buf.toString("base64");
}

/**
 * Try to persist the image to /public/uploads/. In Vercel serverless the
 * filesystem is read-only, so we silently fall back to a data URL.
 *
 * @returns A URL the browser can render — either /uploads/xxx or data:image/...
 */
async function persistImage(file: File, buffer: Buffer): Promise<string> {
  const filename = uniqueFilename(file.name);
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    // Ensure the directory exists in dev (it's git-tracked but missing on
    // first clone).
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    // Read-only filesystem (Vercel) — fall back to inline data URL.
    console.warn(
      "[OCR] Image save skipped, using base64 fallback:",
      err instanceof Error ? err.message : err
    );
    const mime = file.type || "image/jpeg";
    return `data:${mime};base64,${bufferToBase64(buffer)}`;
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "image 필드에 파일을 첨부해주세요." },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    // Limit file size to 10 MB
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "파일 크기는 10MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // Read file bytes once; reuse for both save and OCR
    const buffer = Buffer.from(await file.arrayBuffer());

    // Persist (or fallback to data URL) — must NOT throw the request
    const imageUrl = await persistImage(file, buffer);

    // Run OCR — pass base64 so Google Vision can consume it without re-reading
    const imageBase64 = bufferToBase64(buffer);
    const ocrResult = await extractReceipt(file, imageBase64);

    return NextResponse.json({
      imageUrl,
      ocrResult,
      provider: ocrResult.provider,
    });
  } catch (err) {
    console.error("[OCR] Error processing receipt:", err);
    const detail = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `영수증 인식 중 오류가 발생했습니다: ${detail}` },
      { status: 500 }
    );
  }
}
