/**
 * Mock OCR service that simulates receipt image recognition.
 *
 * Produces realistic Korean receipt data for development and testing.
 * Replace `extractReceiptData` with a real OCR call (Google Vision /
 * Naver Clova) when API keys are available.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OCRResultItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OCRResult {
  /** Total payment amount in KRW */
  amount: number;
  /** Merchant / store name */
  merchantName: string;
  /** Transaction date as ISO date string (YYYY-MM-DD) */
  date: string;
  /** Individual line items when available */
  items?: OCRResultItem[];
  /** Recognition confidence 0–1 */
  confidence: number;
}

// ---------------------------------------------------------------------------
// Sample data pools
// ---------------------------------------------------------------------------

interface MerchantTemplate {
  name: string;
  minAmount: number;
  maxAmount: number;
  items: Array<{ name: string; unitPrice: number }>;
}

const MERCHANTS: MerchantTemplate[] = [
  {
    name: "스타벅스",
    minAmount: 4500,
    maxAmount: 25000,
    items: [
      { name: "아메리카노 (Tall)", unitPrice: 4500 },
      { name: "카페라떼 (Grande)", unitPrice: 5800 },
      { name: "카푸치노 (Venti)", unitPrice: 6500 },
      { name: "케이크 조각", unitPrice: 7500 },
    ],
  },
  {
    name: "배달의민족",
    minAmount: 12000,
    maxAmount: 45000,
    items: [
      { name: "치킨 반반세트", unitPrice: 22000 },
      { name: "피자 (L)", unitPrice: 28000 },
      { name: "짜장면", unitPrice: 7000 },
      { name: "배달비", unitPrice: 3000 },
    ],
  },
  {
    name: "CU",
    minAmount: 1500,
    maxAmount: 15000,
    items: [
      { name: "삼각김밥", unitPrice: 1300 },
      { name: "컵라면", unitPrice: 1200 },
      { name: "음료수", unitPrice: 1800 },
      { name: "샌드위치", unitPrice: 3500 },
    ],
  },
  {
    name: "GS25",
    minAmount: 1500,
    maxAmount: 15000,
    items: [
      { name: "핫도그", unitPrice: 1500 },
      { name: "아이스크림", unitPrice: 2000 },
      { name: "과자류", unitPrice: 2500 },
      { name: "에너지 드링크", unitPrice: 2200 },
    ],
  },
  {
    name: "이마트",
    minAmount: 15000,
    maxAmount: 120000,
    items: [
      { name: "우유 (1L)", unitPrice: 2800 },
      { name: "달걀 (30구)", unitPrice: 8900 },
      { name: "식빵", unitPrice: 3500 },
      { name: "닭가슴살 (500g)", unitPrice: 6500 },
      { name: "야채 세트", unitPrice: 4900 },
    ],
  },
  {
    name: "올리브영",
    minAmount: 8000,
    maxAmount: 80000,
    items: [
      { name: "선크림 SPF50+", unitPrice: 18000 },
      { name: "세안폼", unitPrice: 12000 },
      { name: "마스크팩 (5매)", unitPrice: 9900 },
      { name: "립밤", unitPrice: 6500 },
    ],
  },
  {
    name: "다이소",
    minAmount: 3000,
    maxAmount: 20000,
    items: [
      { name: "수납 바구니", unitPrice: 3000 },
      { name: "볼펜 세트", unitPrice: 2000 },
      { name: "주방 수세미", unitPrice: 1000 },
      { name: "메모지", unitPrice: 2000 },
    ],
  },
  {
    name: "교보문고",
    minAmount: 12000,
    maxAmount: 55000,
    items: [
      { name: "소설 (국내)", unitPrice: 15000 },
      { name: "자기계발서", unitPrice: 18000 },
      { name: "에세이", unitPrice: 13000 },
      { name: "만화책", unitPrice: 8500 },
    ],
  },
  {
    name: "맥도날드",
    minAmount: 5500,
    maxAmount: 30000,
    items: [
      { name: "빅맥 세트", unitPrice: 9200 },
      { name: "맥스파이시 상하이 세트", unitPrice: 8400 },
      { name: "감자튀김 (L)", unitPrice: 3400 },
      { name: "맥플러리", unitPrice: 3000 },
    ],
  },
  {
    name: "스시로",
    minAmount: 15000,
    maxAmount: 60000,
    items: [
      { name: "연어 스시 (2pc)", unitPrice: 3000 },
      { name: "참치 스시 (2pc)", unitPrice: 3500 },
      { name: "새우 스시 (2pc)", unitPrice: 2500 },
      { name: "우동", unitPrice: 6000 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a random integer in [min, max]. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns an ISO date string for today or up to `daysBack` days ago. */
function recentDate(daysBack = 7): string {
  const d = new Date();
  d.setDate(d.getDate() - randInt(0, daysBack));
  return d.toISOString().split("T")[0];
}

/** Selects 1–3 items from the merchant pool and computes the total. */
function buildItems(
  pool: Array<{ name: string; unitPrice: number }>
): { items: OCRResultItem[]; total: number } {
  const count = randInt(1, Math.min(3, pool.length));
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  const items = shuffled.map((p) => ({
    name: p.name,
    quantity: 1,
    price: p.unitPrice,
  }));
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { items, total };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Simulates OCR extraction from a receipt image.
 *
 * @param _imageFile - The uploaded image file (unused in mock; real
 *   implementation would send this to an OCR API).
 * @returns Extracted receipt data including amount, merchant, date, and items.
 */
export async function extractReceiptData(
  /* imageFile: File — passed to real OCR API; unused in mock */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _imageFile: File
): Promise<OCRResult> {
  // Simulate network / OCR processing time (1–2 seconds)
  const delayMs = randInt(1000, 2000);
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const merchant = MERCHANTS[randInt(0, MERCHANTS.length - 1)];

  // Build realistic items and derive the total from them
  const { items, total: itemTotal } = buildItems(merchant.items);

  // Clamp total within the merchant's expected range
  const clampedTotal = Math.max(
    merchant.minAmount,
    Math.min(merchant.maxAmount, itemTotal)
  );

  return {
    amount: clampedTotal,
    merchantName: merchant.name,
    date: recentDate(7),
    items,
    confidence: Number((Math.random() * 0.1 + 0.85).toFixed(2)), // 0.85–0.95
  };
}
