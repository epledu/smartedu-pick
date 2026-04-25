/**
 * Shared TypeScript types for the spending insights feature.
 */

export type InsightSeverity = "positive" | "info" | "warning" | "critical";
export type InsightType =
  | "category_change"
  | "spending_velocity"
  | "top_merchant"
  | "budget_projection"
  | "positive";

export interface Insight {
  type: InsightType;
  severity: InsightSeverity;
  message: string;
  icon: string;
  data?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Input types for analysis functions
// ---------------------------------------------------------------------------

export interface CategorySpend {
  categoryId: string;
  name: string;
  total: number;
}

export interface TransactionInput {
  date: Date | string;
  amount: number;
  merchantName?: string | null;
  type: string;
}

export interface BudgetInput {
  categoryId: string;
  categoryName: string;
  amount: number;
  spent: number;
}

// ---------------------------------------------------------------------------
// Result types for analysis functions
// ---------------------------------------------------------------------------

export interface CategoryChangeResult {
  categoryId: string;
  name: string;
  changePercent: number;
  severity: InsightSeverity;
}

export interface VelocityResult {
  avgDailyLast30: number;
  avgDailyLast7: number;
  changePercent: number;
}

export interface MerchantResult {
  merchantName: string;
  count: number;
  totalAmount: number;
}

export interface DayOfWeekResult {
  day: number; // 0=Sun … 6=Sat
  label: string;
  totalAmount: number;
  count: number;
}

export interface BudgetProjectionResult {
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spent: number;
  projectedAmount: number;
  projectedPercent: number;
}

// ---------------------------------------------------------------------------
// Aggregated input for message generation
// ---------------------------------------------------------------------------

export interface AnalysisInput {
  categoryChanges: CategoryChangeResult[];
  velocity: VelocityResult;
  topMerchants: MerchantResult[];
  budgetProjections: BudgetProjectionResult[];
  avgDailySpend: number;
}
