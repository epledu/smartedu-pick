/**
 * Mock Open Banking data generator.
 *
 * Simulates bank/card transaction data for development and demo purposes.
 * In production, this would be replaced by real Open Banking API calls
 * after obtaining official approval from the Financial Services Commission.
 */

// ---------------------------------------------------------------------------
// Bank / card provider definitions
// ---------------------------------------------------------------------------

export interface BankProvider {
  id: string;
  name: string;
  /** Tailwind bg colour class for the logo tile */
  color: string;
  /** Emoji or letter abbreviation shown inside the tile */
  symbol: string;
  /** Supported account type in our system */
  accountType: "BANK" | "CARD";
}

export const BANK_PROVIDERS: BankProvider[] = [
  { id: "kb", name: "국민은행", color: "bg-yellow-400", symbol: "KB", accountType: "BANK" },
  { id: "shinhan", name: "신한은행", color: "bg-blue-600", symbol: "신", accountType: "BANK" },
  { id: "woori", name: "우리은행", color: "bg-blue-500", symbol: "우", accountType: "BANK" },
  { id: "hana", name: "하나은행", color: "bg-green-500", symbol: "하", accountType: "BANK" },
  { id: "samsung", name: "삼성카드", color: "bg-blue-700", symbol: "S", accountType: "CARD" },
  { id: "hyundai", name: "현대카드", color: "bg-gray-900", symbol: "H", accountType: "CARD" },
  { id: "kakao", name: "카카오뱅크", color: "bg-yellow-300", symbol: "K", accountType: "BANK" },
  { id: "toss", name: "토스뱅크", color: "bg-blue-500", symbol: "T", accountType: "BANK" },
];

// ---------------------------------------------------------------------------
// Merchant catalogue with auto-categorisation metadata
// ---------------------------------------------------------------------------

interface MerchantTemplate {
  name: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  /** Weight for random selection — higher = more frequent */
  weight: number;
}

const MERCHANT_TEMPLATES: MerchantTemplate[] = [
  // Cafe
  { name: "스타벅스", category: "카페", minAmount: 4500, maxAmount: 12000, weight: 8 },
  { name: "이디야커피", category: "카페", minAmount: 2500, maxAmount: 5500, weight: 6 },
  { name: "투썸플레이스", category: "카페", minAmount: 4000, maxAmount: 9000, weight: 5 },
  { name: "메가커피", category: "카페", minAmount: 2000, maxAmount: 4000, weight: 7 },
  // Convenience store
  { name: "CU편의점", category: "편의점", minAmount: 1500, maxAmount: 15000, weight: 9 },
  { name: "GS25", category: "편의점", minAmount: 1500, maxAmount: 15000, weight: 8 },
  { name: "세븐일레븐", category: "편의점", minAmount: 1500, maxAmount: 12000, weight: 6 },
  // Supermarket / shopping
  { name: "이마트", category: "쇼핑", minAmount: 15000, maxAmount: 150000, weight: 5 },
  { name: "홈플러스", category: "쇼핑", minAmount: 12000, maxAmount: 120000, weight: 4 },
  { name: "쿠팡", category: "쇼핑", minAmount: 10000, maxAmount: 200000, weight: 7 },
  { name: "올리브영", category: "쇼핑", minAmount: 8000, maxAmount: 60000, weight: 5 },
  // Restaurant / food delivery
  { name: "배달의민족", category: "외식", minAmount: 12000, maxAmount: 50000, weight: 8 },
  { name: "쿠팡이츠", category: "외식", minAmount: 12000, maxAmount: 45000, weight: 6 },
  { name: "맥도날드", category: "외식", minAmount: 5000, maxAmount: 18000, weight: 7 },
  { name: "BBQ치킨", category: "외식", minAmount: 17000, maxAmount: 32000, weight: 5 },
  { name: "GS칼텍스", category: "교통/주유", minAmount: 40000, maxAmount: 120000, weight: 3 },
  // Transport
  { name: "카카오택시", category: "교통", minAmount: 4000, maxAmount: 25000, weight: 6 },
  { name: "티머니", category: "교통", minAmount: 1400, maxAmount: 6000, weight: 8 },
  // Health / beauty
  { name: "약국", category: "의료", minAmount: 5000, maxAmount: 30000, weight: 3 },
  // Subscription / digital
  { name: "넷플릭스", category: "구독", minAmount: 9500, maxAmount: 17000, weight: 4 },
  { name: "유튜브프리미엄", category: "구독", minAmount: 14900, maxAmount: 14900, weight: 3 },
];

// ---------------------------------------------------------------------------
// Auto-categorisation
// ---------------------------------------------------------------------------

/** Keyword → category name mapping for merchant name matching */
const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: string }> = [
  { keywords: ["스타벅스", "이디야", "투썸", "메가커피", "커피", "카페", "cafe"], category: "카페" },
  { keywords: ["CU", "GS25", "세븐일레븐", "편의점", "미니스톱"], category: "편의점" },
  { keywords: ["이마트", "홈플러스", "쿠팡", "올리브영", "다이소"], category: "쇼핑" },
  { keywords: ["배달의민족", "쿠팡이츠", "맥도날드", "BBQ", "치킨", "식당", "음식", "버거"], category: "외식" },
  { keywords: ["카카오택시", "티머니", "지하철", "버스"], category: "교통" },
  { keywords: ["GS칼텍스", "SK주유소", "현대오일뱅크", "주유"], category: "교통/주유" },
  { keywords: ["약국", "병원", "의원", "클리닉"], category: "의료" },
  { keywords: ["넷플릭스", "유튜브", "스포티파이", "왓챠", "쿠팡플레이", "구독"], category: "구독" },
];

/**
 * Infer a category name from a merchant name string.
 * Returns "기타" when no keyword matches.
 */
export function categorizeMerchant(merchantName: string): string {
  const lower = merchantName.toLowerCase();
  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.category;
    }
  }
  return "기타";
}

// ---------------------------------------------------------------------------
// Mock transaction type
// ---------------------------------------------------------------------------

export interface MockTransaction {
  merchantName: string;
  amount: number;
  category: string;
  date: Date;
  memo: string;
}

// ---------------------------------------------------------------------------
// Transaction generator
// ---------------------------------------------------------------------------

/** Returns a random integer in [min, max] */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Weighted random selection from an array of items. */
function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

/**
 * Generate a realistic list of mock transactions for an account.
 *
 * @param accountId  The account ID (used for deterministic seeding — not implemented here).
 * @param daysBack   How many days into the past to generate transactions for.
 */
export function generateMockTransactions(
  accountId: string,
  daysBack: number = 30
): MockTransaction[] {
  // Vary count between 5 and 30 per sync
  const count = randInt(5, 30);
  const now = Date.now();
  const msBack = daysBack * 24 * 60 * 60 * 1000;

  // Suppress unused parameter warning — kept for API symmetry
  void accountId;

  return Array.from({ length: count }, () => {
    const template = weightedPick(MERCHANT_TEMPLATES);
    const amount = randInt(template.minAmount, template.maxAmount);
    // Round to nearest 100 won for realism
    const roundedAmount = Math.round(amount / 100) * 100 || 100;
    const date = new Date(now - Math.random() * msBack);

    return {
      merchantName: template.name,
      amount: roundedAmount,
      category: template.category,
      date,
      memo: `${template.name} 결제`,
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
}
