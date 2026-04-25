/**
 * Application-wide constants.
 *
 * Keep this file free of runtime logic — only literal values and
 * derived constant arrays/records.
 */

import type { TransactionType } from "@/types/wallet";
import type { AccountType } from "@/hooks/wallet/use-accounts";

// ---------------------------------------------------------------------------
// Default categories
// ---------------------------------------------------------------------------

/** Preset spending categories shipped with a new account. */
export const DEFAULT_CATEGORIES: Array<{
  name: string;
  /** Lucide icon component name (PascalCase). */
  icon: string;
  color: string;
}> = [
  { name: "식비", icon: "UtensilsCrossed", color: "#F97316" },
  { name: "교통", icon: "Bus", color: "#3B82F6" },
  { name: "쇼핑", icon: "ShoppingBag", color: "#EC4899" },
  { name: "문화/여가", icon: "Ticket", color: "#8B5CF6" },
  { name: "의료/건강", icon: "HeartPulse", color: "#EF4444" },
  { name: "교육", icon: "BookOpen", color: "#10B981" },
  { name: "주거/통신", icon: "Home", color: "#6366F1" },
  { name: "카페/간식", icon: "Coffee", color: "#D97706" },
  { name: "미분류", icon: "MoreHorizontal", color: "#9CA3AF" },
];

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

/** Korean display labels for each AccountType value. */
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  BANK: "은행",
  CARD: "카드",
  CASH: "현금",
  EPAY: "간편결제",
};

/** Korean display labels for each TransactionType value. */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "수입",
  EXPENSE: "지출",
  TRANSFER: "이체",
};

// ---------------------------------------------------------------------------
// Point / pay providers
// ---------------------------------------------------------------------------

/** Supported point and pay providers for the point tracker feature. */
export const POINT_PROVIDERS: Array<{
  id: string;
  name: string;
  /** Category of the provider. */
  type: "pay" | "points" | "convenience";
  /** Lucide icon name or a custom identifier resolved in the UI layer. */
  icon: string;
  color: string;
}> = [
  { id: "naver_pay", name: "네이버페이", type: "pay", icon: "Wallet", color: "#03C75A" },
  { id: "toss", name: "토스", type: "pay", icon: "Smartphone", color: "#0064FF" },
  { id: "kakao_pay", name: "카카오페이", type: "pay", icon: "MessageCircle", color: "#FAE100" },
  { id: "daiso", name: "다이소", type: "points", icon: "Tag", color: "#E4002B" },
  { id: "olive_young", name: "올리브영", type: "points", icon: "Leaf", color: "#00A650" },
  { id: "ok_cashbag", name: "OK캐쉬백", type: "points", icon: "Star", color: "#FF6600" },
  { id: "cu", name: "CU", type: "convenience", icon: "Store", color: "#6C2E8E" },
  { id: "gs25", name: "GS25", type: "convenience", icon: "Store", color: "#003B8E" },
];

// ---------------------------------------------------------------------------
// K-pass refund rates
// ---------------------------------------------------------------------------

/**
 * Monthly transit refund rates for K-pass participants.
 * Values represent the fraction of eligible fares refunded (e.g. 0.20 = 20 %).
 */
export const K_PASS_REFUND_RATES: Record<
  "regular" | "youth" | "low_income",
  number
> = {
  regular: 0.2,
  youth: 0.3,
  low_income: 0.53,
};

// ---------------------------------------------------------------------------
// Budget thresholds
// ---------------------------------------------------------------------------

/**
 * Fraction of budget consumed at which a warning is shown.
 * 0.8 means 80 % spent.
 */
export const BUDGET_WARNING_THRESHOLD = 0.8;

/**
 * Fraction of budget consumed at which the budget is considered exceeded.
 * 1.0 means 100 % (fully used).
 */
export const BUDGET_EXCEEDED_THRESHOLD = 1.0;
