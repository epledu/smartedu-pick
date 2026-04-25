/**
 * Google Vision API OCR service (REST-based, no SDK required).
 * v3 — robust parser for real Korean receipts.
 *
 * Key improvements over v2:
 *  - "합 계: \n 61,300원" pattern: joins broken label/value across lines.
 *  - Strict comma handling: prefers "61,300" over the trailing "300".
 *  - Card number / phone number / ID filtering (context-aware).
 *  - Items extractor disabled by default (too noisy on real receipts).
 *  - Debug info exposed via returned OCRResult._debug (kept optional).
 */

import type { OCRResult } from "./ocr-mock";

// ---------------------------------------------------------------------------
// Google Vision REST types
// ---------------------------------------------------------------------------

interface VisionRequest {
  requests: Array<{
    image: { content: string };
    features: Array<{ type: string; maxResults: number }>;
    imageContext: { languageHints: string[] };
  }>;
}

interface VisionResponse {
  responses?: Array<{
    fullTextAnnotation?: { text: string };
    error?: { message: string };
  }>;
}

export interface OCRDebugInfo {
  rawText: string;
  candidates: Array<{ value: number; priority: number; reason: string }>;
}

export type OCRResultWithDebug = OCRResult & { _debug?: OCRDebugInfo };

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export async function extractReceiptDataGoogleVision(
  imageBase64: string
): Promise<OCRResultWithDebug> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_VISION_API_KEY not set");

  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const body: VisionRequest = {
    requests: [
      {
        image: { content: imageBase64 },
        features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
        imageContext: { languageHints: ["ko", "en"] },
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Vision API error: ${response.status} ${errText}`);
  }

  const data: VisionResponse = await response.json();
  const visionError = data.responses?.[0]?.error;
  if (visionError) throw new Error(`Vision API returned error: ${visionError.message}`);

  const fullText = data.responses?.[0]?.fullTextAnnotation?.text ?? "";

  if (process.env.DEBUG_OCR === "true") {
    console.log("========== OCR RAW TEXT ==========");
    console.log(fullText);
    console.log("==================================");
  }

  return parseReceiptText(fullText);
}

// ---------------------------------------------------------------------------
// Receipt text parser v3
// ---------------------------------------------------------------------------

function parseReceiptText(text: string): OCRResultWithDebug {
  const rawLines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Step 1: Join broken number tokens across lines.
  // Some OCR results split "61,300원" into "61", ",", "300", "원"
  const lines = joinBrokenTokens(rawLines);

  const merchantName = extractMerchant(lines);
  const { amount, candidates } = extractAmount(lines);
  const date = extractDate(lines);

  const foundFields = [merchantName !== "알 수 없음", amount > 0, date !== ""].filter(Boolean).length;
  const confidence = 0.6 + foundFields * 0.1;

  return {
    amount,
    merchantName,
    date: date || new Date().toISOString().split("T")[0],
    confidence: Math.min(confidence, 0.95),
    _debug:
      process.env.NODE_ENV === "development"
        ? { rawText: text, candidates }
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// Token joiner — re-assembles "61,300원" when OCR splits it
// ---------------------------------------------------------------------------

/**
 * Combines adjacent lines that together form a single number.
 * E.g. ["61", ",", "300", "원"] → ["61,300원"]
 * E.g. ["15", "000원"] → ["15000원"]
 */
function joinBrokenTokens(lines: string[]): string[] {
  const joined: string[] = [];
  let buffer = "";

  for (const line of lines) {
    // If line is ONLY digits/comma/원/₩, append to buffer
    if (/^[\d,원₩\s]+$/.test(line) && line.length <= 10) {
      buffer += line.replace(/\s+/g, "");
    } else {
      if (buffer) {
        joined.push(buffer);
        buffer = "";
      }
      joined.push(line);
    }
  }
  if (buffer) joined.push(buffer);

  return joined;
}

// ---------------------------------------------------------------------------
// Merchant extractor
// ---------------------------------------------------------------------------

function extractMerchant(lines: string[]): string {
  const skipPattern = /^(\d{2,4}[-.\s]\d{3,4}[-.\s]\d{4}|TEL|FAX|\d{5}|사업자|대표자|주소|http|www\.|영수증|카드전표)/i;

  for (const line of lines.slice(0, 8)) {
    if (line.length < 2) continue;
    if (skipPattern.test(line)) continue;
    if (/^[가-힣A-Za-z0-9\s()&.,'-]{2,30}$/.test(line)) return line;
  }
  return lines[0] ?? "알 수 없음";
}

// ---------------------------------------------------------------------------
// Amount extractor — v3 with multi-line lookahead and strict exclusions
// ---------------------------------------------------------------------------

const AMOUNT_KEYWORDS: Array<{ pattern: RegExp; priority: number; name: string }> = [
  { pattern: /결제\s*금액|결\s*제\s*금\s*액/, priority: 100, name: "결제금액" },
  { pattern: /승인\s*금액|승\s*인\s*금\s*액/, priority: 95, name: "승인금액" },
  { pattern: /받을\s*금액|받\s*을\s*금\s*액/, priority: 90, name: "받을금액" },
  { pattern: /청구\s*금액/, priority: 85, name: "청구금액" },
  { pattern: /총\s*합\s*계|총합계/, priority: 80, name: "총합계" },
  { pattern: /총\s*액/, priority: 75, name: "총액" },
  { pattern: /^\s*합\s*계\s*[:：]?/, priority: 70, name: "합계" },
  { pattern: /총\s*계/, priority: 65, name: "총계" },
  { pattern: /판매\s*총액/, priority: 60, name: "판매총액" },
];

/** Keywords that indicate the number on this line is NOT the total. */
const EXCLUDE_KEYWORDS =
  /부\s*가\s*세|부가가치세|VAT|공급\s*가액|과세\s*물품|비과세|소\s*계|할인|적립|포인트|쿠폰|잔돈|거스름|카드번호|승인번호|영수증번호|사업자|BIZ|일련번호|TEL|FAX|우편|지번|전표번호|전화|테이블/i;

/** Strict price token: must have thousand separator OR be a pure 3-7 digit number with 원/₩ context. */
const COMMA_PRICE_RE = /(\d{1,3}(?:,\d{3})+)(?:\s*원|\s*₩)?/g;
const WON_PREFIX_RE = /₩\s*(\d{1,3}(?:,\d{3})+|\d{3,7})/g;

/**
 * Try every extraction strategy, rank candidates, pick highest priority.
 */
function extractAmount(lines: string[]): {
  amount: number;
  candidates: Array<{ value: number; priority: number; reason: string }>;
} {
  const candidates: Array<{ value: number; priority: number; reason: string }> = [];

  // Strategy 1: keyword + next-line lookahead (most reliable for Korean receipts)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip lines with exclusion keywords entirely (e.g. "부가세 5,572원")
    if (EXCLUDE_KEYWORDS.test(line)) continue;

    for (const { pattern, priority, name } of AMOUNT_KEYWORDS) {
      if (!pattern.test(line)) continue;

      // Same-line value
      const sameLineNum = extractPriceFromLine(line);
      if (sameLineNum !== null && isReasonableAmount(sameLineNum)) {
        candidates.push({
          value: sameLineNum,
          priority,
          reason: `${name}:sameline("${line}")`,
        });
      }

      // Next 1-3 lines
      for (let offset = 1; offset <= 3; offset++) {
        const nextLine = lines[i + offset];
        if (!nextLine) break;
        if (EXCLUDE_KEYWORDS.test(nextLine)) continue;
        if (AMOUNT_KEYWORDS.some((k) => k.pattern.test(nextLine))) break; // hit another keyword

        const nextNum = extractPriceFromLine(nextLine);
        if (nextNum !== null && isReasonableAmount(nextNum)) {
          candidates.push({
            value: nextNum,
            priority: priority - offset,
            reason: `${name}:next+${offset}("${nextLine}")`,
          });
          break;
        }
      }
    }
  }

  // Strategy 2: "₩" prefix anywhere (strong signal in receipts)
  for (const line of lines) {
    if (EXCLUDE_KEYWORDS.test(line)) continue;
    const matches = Array.from(line.matchAll(WON_PREFIX_RE));
    for (const m of matches) {
      const val = parseInt(m[1].replace(/,/g, ""), 10);
      if (isReasonableAmount(val)) {
        candidates.push({ value: val, priority: 50, reason: `₩prefix("${line}")` });
      }
    }
  }

  // Strategy 3: comma-separated numbers anywhere (like "61,300원")
  for (const line of lines) {
    if (EXCLUDE_KEYWORDS.test(line)) continue;
    const matches = Array.from(line.matchAll(COMMA_PRICE_RE));
    for (const m of matches) {
      const val = parseInt(m[1].replace(/,/g, ""), 10);
      if (isReasonableAmount(val)) {
        candidates.push({ value: val, priority: 40, reason: `comma("${line}")` });
      }
    }
  }

  // Sort and pick
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.priority - a.priority || b.value - a.value);
    if (process.env.DEBUG_OCR === "true") {
      console.log("[OCR] amount candidates (top 10):", candidates.slice(0, 10));
    }
    return { amount: candidates[0].value, candidates };
  }

  return { amount: 0, candidates };
}

/**
 * Extract a SINGLE best price from one line.
 * Priority: comma-separated number > ₩-prefixed number > simple 원-suffixed number.
 */
function extractPriceFromLine(line: string): number | null {
  // 1. Comma-separated (61,300)
  const commaMatch = line.match(/(\d{1,3}(?:,\d{3})+)/);
  if (commaMatch) {
    const val = parseInt(commaMatch[1].replace(/,/g, ""), 10);
    if (!isNaN(val)) return val;
  }

  // 2. ₩-prefixed
  const wonPrefix = line.match(/₩\s*(\d{1,3}(?:,\d{3})+|\d{3,7})/);
  if (wonPrefix) {
    const val = parseInt(wonPrefix[1].replace(/,/g, ""), 10);
    if (!isNaN(val)) return val;
  }

  // 3. Simple N원
  const wonSuffix = line.match(/(\d{3,7})\s*원/);
  if (wonSuffix) {
    const val = parseInt(wonSuffix[1], 10);
    if (!isNaN(val)) return val;
  }

  return null;
}

/** 500원 ~ 5,000,000원 — plausible receipt range. Blocks card numbers, phone digits, etc. */
function isReasonableAmount(value: number): boolean {
  return value >= 500 && value <= 5_000_000;
}

// ---------------------------------------------------------------------------
// Date extractor
// ---------------------------------------------------------------------------

function extractDate(lines: string[]): string {
  const isoRe = /(\d{4})[-./](\d{1,2})[-./](\d{1,2})/;
  const korRe = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
  const shortRe = /(\d{2})[-./](\d{2})[-./](\d{2})/;

  for (const line of lines) {
    const kor = line.match(korRe);
    if (kor) {
      const [, y, m, d] = kor;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    const iso = line.match(isoRe);
    if (iso) {
      const [, y, m, d] = iso;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }

  for (const line of lines) {
    const short = line.match(shortRe);
    if (short) {
      const [, y, m, d] = short;
      const yy = parseInt(y, 10);
      const fullYear = yy < 50 ? 2000 + yy : 1900 + yy;
      return `${fullYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }

  return "";
}

export type { OCRResult };
