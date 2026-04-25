/**
 * payment-benefits.ts
 *
 * Hardcoded benefit database for the Korean payment ecosystem.
 * Covers major merchants and categories with realistic 2024 benefit data.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentBenefit {
  id: string;
  merchantPattern?: string; // e.g. "CU", "스타벅스"
  category?: string; // e.g. "편의점", "카페"
  paymentMethod: string; // e.g. "카카오페이", "삼성카드"
  benefitType: "point" | "cashback" | "discount";
  benefitValue: number; // amount or percent
  benefitUnit: "fixed" | "percent";
  description: string; // human-readable e.g. "200원 적립"
  conditions?: string; // e.g. "월 3만원 이상 사용 시"
  priority: number; // higher = show first
}

// ---------------------------------------------------------------------------
// Benefit Database
// ---------------------------------------------------------------------------

export const PAYMENT_BENEFITS: PaymentBenefit[] = [
  // ── 편의점: CU ──────────────────────────────────────────────────────────
  { id: "cu-kakao", merchantPattern: "CU", category: "편의점", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 200, benefitUnit: "fixed", description: "200원 적립", priority: 10 },
  { id: "cu-naver", merchantPattern: "CU", category: "편의점", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 적립", priority: 8 },
  { id: "cu-samsung", merchantPattern: "CU", category: "편의점", paymentMethod: "삼성페이", benefitType: "cashback", benefitValue: 100, benefitUnit: "fixed", description: "100원 캐시백", priority: 7 },
  { id: "cu-hyundai", merchantPattern: "CU", category: "편의점", paymentMethod: "현대카드", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 포인트 적립", conditions: "월 30만원 이상 사용 시", priority: 6 },

  // ── 편의점: GS25 ─────────────────────────────────────────────────────────
  { id: "gs25-kakao", merchantPattern: "GS25", category: "편의점", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 150, benefitUnit: "fixed", description: "150원 적립", priority: 10 },
  { id: "gs25-naver", merchantPattern: "GS25", category: "편의점", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 적립", priority: 8 },
  { id: "gs25-shinhan", merchantPattern: "GS25", category: "편의점", paymentMethod: "신한카드", benefitType: "discount", benefitValue: 5, benefitUnit: "percent", description: "5% 할인", conditions: "GS25 앱 연동 시", priority: 9 },

  // ── 편의점: 세븐일레븐 ──────────────────────────────────────────────────
  { id: "7-eleven-kakao", merchantPattern: "세븐일레븐", category: "편의점", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 100, benefitUnit: "fixed", description: "100원 적립", priority: 9 },
  { id: "7-eleven-lotte", merchantPattern: "세븐일레븐", category: "편의점", paymentMethod: "롯데카드", benefitType: "discount", benefitValue: 3, benefitUnit: "percent", description: "3% 할인", priority: 8 },

  // ── 편의점: 이마트24 ────────────────────────────────────────────────────
  { id: "emart24-ssg", merchantPattern: "이마트24", category: "편의점", paymentMethod: "SSG페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% SSG포인트 적립", priority: 10 },
  { id: "emart24-samsung", merchantPattern: "이마트24", category: "편의점", paymentMethod: "삼성카드", benefitType: "cashback", benefitValue: 1, benefitUnit: "percent", description: "1% 캐시백", priority: 7 },

  // ── 카페: 스타벅스 ──────────────────────────────────────────────────────
  { id: "starbucks-samsung", merchantPattern: "스타벅스", category: "카페", paymentMethod: "삼성카드 taptap", benefitType: "discount", benefitValue: 5, benefitUnit: "percent", description: "5% 할인", priority: 10 },
  { id: "starbucks-kakao", merchantPattern: "스타벅스", category: "카페", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 별 적립", priority: 9 },
  { id: "starbucks-hyundai", merchantPattern: "스타벅스", category: "카페", paymentMethod: "현대카드 Z", benefitType: "cashback", benefitValue: 5, benefitUnit: "percent", description: "5% 캐시백", conditions: "월 50만원 이상 사용 시", priority: 8 },
  { id: "starbucks-app", merchantPattern: "스타벅스", category: "카페", paymentMethod: "스타벅스 앱", benefitType: "point", benefitValue: 10, benefitUnit: "percent", description: "별 10개 적립", priority: 11 },

  // ── 카페: 투썸플레이스 ──────────────────────────────────────────────────
  { id: "twosome-kakao", merchantPattern: "투썸플레이스", category: "카페", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 9 },
  { id: "twosome-kb", merchantPattern: "투썸플레이스", category: "카페", paymentMethod: "KB국민카드", benefitType: "discount", benefitValue: 3, benefitUnit: "percent", description: "3% 할인", priority: 8 },

  // ── 카페: 이디야 ────────────────────────────────────────────────────────
  { id: "ediya-naver", merchantPattern: "이디야", category: "카페", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 9 },
  { id: "ediya-kakao", merchantPattern: "이디야", category: "카페", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 적립", priority: 7 },

  // ── 카페: 메가커피 / 컴포즈커피 ────────────────────────────────────────
  { id: "mega-kakao", merchantPattern: "메가커피", category: "카페", paymentMethod: "카카오페이", benefitType: "cashback", benefitValue: 100, benefitUnit: "fixed", description: "100원 캐시백", priority: 9 },
  { id: "compose-naver", merchantPattern: "컴포즈커피", category: "카페", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 적립", priority: 8 },

  // ── 배달: 배달의민족 ────────────────────────────────────────────────────
  { id: "baemin-kakao", merchantPattern: "배달의민족", category: "배달", paymentMethod: "카카오페이", benefitType: "discount", benefitValue: 2000, benefitUnit: "fixed", description: "2,000원 할인", conditions: "2만원 이상 주문 시", priority: 10 },
  { id: "baemin-naver", merchantPattern: "배달의민족", category: "배달", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 9 },
  { id: "baemin-hyundai", merchantPattern: "배달의민족", category: "배달", paymentMethod: "현대카드", benefitType: "cashback", benefitValue: 3, benefitUnit: "percent", description: "3% 캐시백", priority: 8 },

  // ── 배달: 요기요 ────────────────────────────────────────────────────────
  { id: "yogiyo-kb", merchantPattern: "요기요", category: "배달", paymentMethod: "KB국민카드", benefitType: "discount", benefitValue: 1000, benefitUnit: "fixed", description: "1,000원 할인", conditions: "1만원 이상 주문 시", priority: 9 },
  { id: "yogiyo-samsung", merchantPattern: "요기요", category: "배달", paymentMethod: "삼성카드", benefitType: "cashback", benefitValue: 2, benefitUnit: "percent", description: "2% 캐시백", priority: 8 },

  // ── 배달: 쿠팡이츠 ──────────────────────────────────────────────────────
  { id: "coupangeats-rocket", merchantPattern: "쿠팡이츠", category: "배달", paymentMethod: "로켓페이", benefitType: "discount", benefitValue: 3, benefitUnit: "percent", description: "3% 할인", priority: 10 },
  { id: "coupangeats-naver", merchantPattern: "쿠팡이츠", category: "배달", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 적립", priority: 7 },

  // ── 마트: 이마트 ────────────────────────────────────────────────────────
  { id: "emart-ssg", merchantPattern: "이마트", category: "마트", paymentMethod: "SSG페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% SSG포인트 적립", priority: 10 },
  { id: "emart-samsung", merchantPattern: "이마트", category: "마트", paymentMethod: "삼성카드", benefitType: "discount", benefitValue: 5, benefitUnit: "percent", description: "5% 즉시 할인", conditions: "이마트 삼성카드 전용", priority: 9 },
  { id: "emart-kb", merchantPattern: "이마트", category: "마트", paymentMethod: "KB국민카드", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 포인트 적립", priority: 7 },

  // ── 마트: 홈플러스 ──────────────────────────────────────────────────────
  { id: "homeplus-shinhan", merchantPattern: "홈플러스", category: "마트", paymentMethod: "신한카드", benefitType: "cashback", benefitValue: 3, benefitUnit: "percent", description: "3% 캐시백", priority: 9 },
  { id: "homeplus-kakao", merchantPattern: "홈플러스", category: "마트", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 8 },

  // ── 마트: 롯데마트 ──────────────────────────────────────────────────────
  { id: "lottemart-lotte", merchantPattern: "롯데마트", category: "마트", paymentMethod: "롯데카드", benefitType: "discount", benefitValue: 5, benefitUnit: "percent", description: "5% 할인", priority: 10 },
  { id: "lottemart-lpay", merchantPattern: "롯데마트", category: "마트", paymentMethod: "L.pay", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% L포인트 적립", priority: 9 },

  // ── 마트: 코스트코 ──────────────────────────────────────────────────────
  { id: "costco-hyundai", merchantPattern: "코스트코", category: "마트", paymentMethod: "현대카드", benefitType: "cashback", benefitValue: 1, benefitUnit: "percent", description: "1% 캐시백", conditions: "현대카드 전용 제휴", priority: 10 },

  // ── 쇼핑: 올리브영 ──────────────────────────────────────────────────────
  { id: "oliveyoung-naver", merchantPattern: "올리브영", category: "쇼핑", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 9 },
  { id: "oliveyoung-kakao", merchantPattern: "올리브영", category: "쇼핑", paymentMethod: "카카오페이", benefitType: "cashback", benefitValue: 500, benefitUnit: "fixed", description: "500원 캐시백", conditions: "1만원 이상 결제 시", priority: 8 },

  // ── 쇼핑: 다이소 ────────────────────────────────────────────────────────
  { id: "daiso-kakao", merchantPattern: "다이소", category: "쇼핑", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 적립", priority: 8 },
  { id: "daiso-samsung", merchantPattern: "다이소", category: "쇼핑", paymentMethod: "삼성페이", benefitType: "cashback", benefitValue: 100, benefitUnit: "fixed", description: "100원 캐시백", priority: 7 },

  // ── 쇼핑: 무신사 ────────────────────────────────────────────────────────
  { id: "musinsa-naver", merchantPattern: "무신사", category: "쇼핑", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 적립", priority: 9 },
  { id: "musinsa-kakao", merchantPattern: "무신사", category: "쇼핑", paymentMethod: "카카오페이", benefitType: "discount", benefitValue: 2000, benefitUnit: "fixed", description: "2,000원 할인", conditions: "3만원 이상 결제 시", priority: 8 },

  // ── 교통: K-패스 ────────────────────────────────────────────────────────
  { id: "kpass-kb", merchantPattern: "K-패스", category: "교통", paymentMethod: "KB국민카드", benefitType: "cashback", benefitValue: 20, benefitUnit: "percent", description: "20% 환급", conditions: "월 15회 이상 대중교통 이용 시", priority: 10 },
  { id: "kpass-shinhan", merchantPattern: "K-패스", category: "교통", paymentMethod: "신한카드", benefitType: "cashback", benefitValue: 20, benefitUnit: "percent", description: "20% 환급", conditions: "월 15회 이상 대중교통 이용 시", priority: 10 },
  { id: "kpass-woori", merchantPattern: "K-패스", category: "교통", paymentMethod: "우리카드", benefitType: "cashback", benefitValue: 20, benefitUnit: "percent", description: "20% 환급", conditions: "월 15회 이상 대중교통 이용 시", priority: 10 },

  // ── 교통: 카카오T ───────────────────────────────────────────────────────
  { id: "kakaot-kakao", merchantPattern: "카카오T", category: "교통", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 적립", priority: 10 },
  { id: "kakaot-hyundai", merchantPattern: "카카오T", category: "교통", paymentMethod: "현대카드", benefitType: "cashback", benefitValue: 5, benefitUnit: "percent", description: "5% 캐시백", priority: 9 },

  // ── 교통: 기차 (코레일) ─────────────────────────────────────────────────
  { id: "korail-shinhan", merchantPattern: "코레일", category: "교통", paymentMethod: "신한카드", benefitType: "discount", benefitValue: 5, benefitUnit: "percent", description: "5% 할인", priority: 9 },
  { id: "korail-kb", merchantPattern: "코레일", category: "교통", paymentMethod: "KB국민카드", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 8 },

  // ── 문화: CGV ───────────────────────────────────────────────────────────
  { id: "cgv-hyundai", merchantPattern: "CGV", category: "문화", paymentMethod: "현대카드 M", benefitType: "discount", benefitValue: 2000, benefitUnit: "fixed", description: "2,000원 할인", conditions: "온라인 예매 시", priority: 10 },
  { id: "cgv-kakao", merchantPattern: "CGV", category: "문화", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 적립", priority: 8 },
  { id: "cgv-kb", merchantPattern: "CGV", category: "문화", paymentMethod: "KB국민카드", benefitType: "discount", benefitValue: 1500, benefitUnit: "fixed", description: "1,500원 할인", conditions: "주중 예매 시", priority: 9 },

  // ── 문화: 메가박스 ──────────────────────────────────────────────────────
  { id: "megabox-samsung", merchantPattern: "메가박스", category: "문화", paymentMethod: "삼성카드", benefitType: "discount", benefitValue: 2000, benefitUnit: "fixed", description: "2,000원 할인", priority: 9 },
  { id: "megabox-naver", merchantPattern: "메가박스", category: "문화", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 8 },

  // ── 문화: 교보문고 ──────────────────────────────────────────────────────
  { id: "kyobo-naver", merchantPattern: "교보문고", category: "문화", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 적립", priority: 10 },
  { id: "kyobo-kb", merchantPattern: "교보문고", category: "문화", paymentMethod: "KB국민카드", benefitType: "cashback", benefitValue: 2, benefitUnit: "percent", description: "2% 캐시백", priority: 8 },

  // ── 문화: YES24 ─────────────────────────────────────────────────────────
  { id: "yes24-naver", merchantPattern: "YES24", category: "문화", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 적립", priority: 10 },
  { id: "yes24-kakao", merchantPattern: "YES24", category: "문화", paymentMethod: "카카오페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 8 },

  // ── 온라인: 쿠팡 ────────────────────────────────────────────────────────
  { id: "coupang-rocket", merchantPattern: "쿠팡", category: "온라인쇼핑", paymentMethod: "로켓페이", benefitType: "point", benefitValue: 1, benefitUnit: "percent", description: "1% 쿠팡캐시 적립", priority: 10 },
  { id: "coupang-samsung", merchantPattern: "쿠팡", category: "온라인쇼핑", paymentMethod: "삼성카드", benefitType: "cashback", benefitValue: 3, benefitUnit: "percent", description: "3% 캐시백", priority: 9 },
  { id: "coupang-hyundai", merchantPattern: "쿠팡", category: "온라인쇼핑", paymentMethod: "현대카드", benefitType: "cashback", benefitValue: 2, benefitUnit: "percent", description: "2% 캐시백", priority: 8 },

  // ── 온라인: 네이버쇼핑 ──────────────────────────────────────────────────
  { id: "naver-naver", merchantPattern: "네이버쇼핑", category: "온라인쇼핑", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 3, benefitUnit: "percent", description: "3% 적립", priority: 10 },
  { id: "naver-hyundai", merchantPattern: "네이버쇼핑", category: "온라인쇼핑", paymentMethod: "현대카드 X", benefitType: "cashback", benefitValue: 5, benefitUnit: "percent", description: "5% 캐시백", conditions: "월 30만원 이상 사용 시", priority: 9 },

  // ── 온라인: 11번가 ──────────────────────────────────────────────────────
  { id: "11st-amazon", merchantPattern: "11번가", category: "온라인쇼핑", paymentMethod: "아마존페이", benefitType: "discount", benefitValue: 5, benefitUnit: "percent", description: "5% 할인", priority: 9 },
  { id: "11st-naver", merchantPattern: "11번가", category: "온라인쇼핑", paymentMethod: "네이버페이", benefitType: "point", benefitValue: 2, benefitUnit: "percent", description: "2% 적립", priority: 8 },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Find best payment methods for a given merchant or category.
 * Matches are case-insensitive and use substring matching for merchant patterns.
 * Returns results sorted by priority (desc) then by benefit value (desc).
 */
export function findBestPayment(
  merchant?: string,
  category?: string
): PaymentBenefit[] {
  if (!merchant && !category) return [];

  const results = PAYMENT_BENEFITS.filter((b) => {
    const merchantMatch =
      merchant &&
      b.merchantPattern &&
      merchant.toLowerCase().includes(b.merchantPattern.toLowerCase());

    const categoryMatch =
      category && b.category && b.category === category;

    return merchantMatch || categoryMatch;
  });

  // Deduplicate by paymentMethod — keep highest priority entry per method
  const methodMap = new Map<string, PaymentBenefit>();
  for (const b of results) {
    const existing = methodMap.get(b.paymentMethod);
    if (!existing || b.priority > existing.priority) {
      methodMap.set(b.paymentMethod, b);
    }
  }

  return Array.from(methodMap.values()).sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    // Secondary sort: compare normalized benefit values
    const va = a.benefitUnit === "percent" ? a.benefitValue : a.benefitValue / 100;
    const vb = b.benefitUnit === "percent" ? b.benefitValue : b.benefitValue / 100;
    return vb - va;
  });
}

/**
 * Calculate actual savings amount for a given transaction amount and benefit.
 * Returns 0 if amount is not provided.
 */
export function calculateBenefit(
  amount: number,
  benefit: PaymentBenefit
): number {
  if (!amount || amount <= 0) return 0;
  if (benefit.benefitUnit === "fixed") return benefit.benefitValue;
  // percent
  return Math.floor((amount * benefit.benefitValue) / 100);
}

/**
 * Get unique categories available in the database.
 */
export function getAvailableCategories(): string[] {
  const cats = new Set<string>();
  for (const b of PAYMENT_BENEFITS) {
    if (b.category) cats.add(b.category);
  }
  return Array.from(cats).sort();
}
