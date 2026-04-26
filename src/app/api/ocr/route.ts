/**
 * POST /api/ocr
 *
 * Accepts a multipart form upload containing a receipt image, runs OCR
 * (Google Vision when configured, otherwise mock), and returns the recognised
 * data along with an imageUrl.
 *
 * Storage strategy (in priority order):
 *  1. BLOB_READ_WRITE_TOKEN set → Vercel Blob (the right answer for prod)
 *  2. Writable local filesystem → /public/uploads/ (dev convenience)
 *  3. Otherwise → 503. We deliberately stopped emitting base64 data URLs
 *     because the previous fallback bloated the DB row for every receipt
 *     and degraded long-term backup/query performance.
 */
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import { constants as fsConstants } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { extractReceipt } from "@/lib/wallet/ocr";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string };

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

/** Returned to callers when no storage backend is available. */
class StorageUnavailableError extends Error {
  constructor() {
    super("No image storage backend configured");
    this.name = "StorageUnavailableError";
  }
}

/**
 * Persist the image and return a public URL. Tries Vercel Blob first
 * (production), then a local filesystem write (dev). Throws when neither
 * is available — we used to fall back to a base64 data URL, but those got
 * stored as `receiptImageUrl` and bloated the DB.
 */
async function persistImage(file: File, buffer: Buffer): Promise<string> {
  const filename = uniqueFilename(file.name);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`receipts/${filename}`, buffer, {
      access: "public",
      contentType: file.type || "image/jpeg",
      // The filename embeds a UUID, so no collisions to worry about.
      addRandomSuffix: false,
    });
    return blob.url;
  }

  // Dev fallback: only attempt when the filesystem is actually writable.
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  try {
    await access(uploadDir, fsConstants.W_OK).catch(async () => {
      await mkdir(uploadDir, { recursive: true });
    });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.warn(
      "[OCR] Local filesystem unavailable and Vercel Blob is not configured:",
      err instanceof Error ? err.message : err,
    );
    throw new StorageUnavailableError();
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Auth gate — without this anyone could pump 10MB images through Google
  // Vision on our quota. Middleware does not protect /api/* routes.
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    let imageUrl: string;
    try {
      imageUrl = await persistImage(file, buffer);
    } catch (err) {
      if (err instanceof StorageUnavailableError) {
        return NextResponse.json(
          {
            error:
              "이미지 저장소가 설정되지 않았습니다. 운영자에게 Vercel Blob (BLOB_READ_WRITE_TOKEN) 설정을 요청해주세요.",
          },
          { status: 503 },
        );
      }
      throw err;
    }

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
