/**
 * K-Pass transit refund calculation utilities.
 *
 * K-Pass is a Korean government program (launched May 2024) that refunds
 * a portion of public transit fares to users who ride 15+ times per month.
 *
 * Rules:
 *   - Category must be "교통" (transport)
 *   - Minimum 15 uses per month to qualify
 *   - Maximum 60 uses counted per month
 *   - Refund = totalSpent (up to 60 uses) * refundRate
 */
import { K_PASS_REFUND_RATES } from "@/lib/wallet/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KPassUserType = "regular" | "youth" | "low_income";

/** Shape of a transaction sufficient for K-Pass calculation. */
export interface KPassTransaction {
  amount: number;
  date: string | Date;
  category?: { name: string } | null;
}

/** Result of calculateKPassRefund. */
export interface KPassRefundResult {
  /** Number of transport uses counted (capped at 60). */
  eligibleUses: number;
  /** Total amount spent across eligible uses. */
  totalSpent: number;
  /** Refund amount in KRW (0 if < 15 uses). */
  refundAmount: number;
  /** Whether the 15-use threshold has been met. */
  isEligible: boolean;
}

/** Monthly K-Pass status with progress toward threshold. */
export interface MonthlyKPassStatus extends KPassRefundResult {
  year: number;
  month: number;
  /** Remaining uses needed before eligibility (null if already eligible). */
  remaining: number | null;
  /** Progress ratio toward 15-use threshold (0.0–1.0, capped at 1.0). */
  progress: number;
  /** Refund amount user would get if the month ended now. */
  projectedRefund: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_USES = 15;
const MAX_USES = 60;
const TRANSPORT_CATEGORY = "교통";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Filters transactions to only those matching the transport category
 * in the specified calendar month, sorted by date ascending.
 */
function filterTransportTransactions(
  transactions: KPassTransaction[],
  year: number,
  month: number
): KPassTransaction[] {
  return transactions.filter((tx) => {
    if (tx.category?.name !== TRANSPORT_CATEGORY) return false;
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

// ---------------------------------------------------------------------------
// Core calculation
// ---------------------------------------------------------------------------

/**
 * Calculates K-Pass refund for a set of transactions.
 *
 * @param transactions - All transactions (will be filtered for 교통 category)
 * @param userType     - User's K-Pass tier (regular | youth | low_income)
 * @param year         - Target year
 * @param month        - Target month (1-12)
 */
export function calculateKPassRefund(
  transactions: KPassTransaction[],
  userType: KPassUserType,
  year: number,
  month: number
): KPassRefundResult {
  const transport = filterTransportTransactions(transactions, year, month);

  // Cap at MAX_USES (60)
  const cappedTransactions = transport.slice(0, MAX_USES);
  const eligibleUses = cappedTransactions.length;
  const totalSpent = cappedTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const isEligible = eligibleUses >= MIN_USES;
  const rate = K_PASS_REFUND_RATES[userType];
  const refundAmount = isEligible ? Math.floor(totalSpent * rate) : 0;

  return { eligibleUses, totalSpent, refundAmount, isEligible };
}

// ---------------------------------------------------------------------------
// Monthly status
// ---------------------------------------------------------------------------

/**
 * Returns the full monthly K-Pass status including progress toward threshold
 * and projected refund for the current state of the month.
 */
export function getMonthlyKPassStatus(
  transactions: KPassTransaction[],
  userType: KPassUserType,
  year: number,
  month: number
): MonthlyKPassStatus {
  const base = calculateKPassRefund(transactions, userType, year, month);
  const { eligibleUses, isEligible, totalSpent } = base;

  const remaining = isEligible ? null : MIN_USES - eligibleUses;
  const progress = Math.min(1, eligibleUses / MIN_USES);

  // Projected refund = same as current since we count what we have
  const rate = K_PASS_REFUND_RATES[userType];
  const projectedRefund = isEligible ? Math.floor(totalSpent * rate) : 0;

  return {
    ...base,
    year,
    month,
    remaining,
    progress,
    projectedRefund,
  };
}

// ---------------------------------------------------------------------------
// Yearly projection
// ---------------------------------------------------------------------------

/**
 * Estimates yearly K-Pass refund based on monthly average usage and spending.
 *
 * @param monthlyAverages - Array of per-month { uses, totalSpent } objects
 * @param userType        - User's K-Pass tier
 */
export function projectYearlyKPass(
  monthlyAverages: Array<{ uses: number; totalSpent: number }>,
  userType: KPassUserType
): number {
  if (monthlyAverages.length === 0) return 0;

  const rate = K_PASS_REFUND_RATES[userType];

  const monthlyRefunds = monthlyAverages.map(({ uses, totalSpent }) => {
    const cappedUses = Math.min(uses, MAX_USES);
    if (cappedUses < MIN_USES) return 0;
    // Prorate totalSpent to the capped use ratio
    const ratio = uses > 0 ? cappedUses / uses : 0;
    return Math.floor(totalSpent * ratio * rate);
  });

  // Average monthly refund * 12
  const avg = monthlyRefunds.reduce((s, v) => s + v, 0) / monthlyAverages.length;
  return Math.floor(avg * 12);
}
