/**
 * Shared TypeScript types used across the application.
 *
 * Prisma-generated types are imported where possible so that
 * these definitions stay in sync with the database schema.
 */

// ---------------------------------------------------------------------------
// Re-export convenience aliases from Prisma
// ---------------------------------------------------------------------------

// Prisma model types will be available once `prisma generate` has been run.
// Until then we define shapes manually so the rest of the codebase can compile.

/**
 * AccountType mirrors the Prisma AccountType enum.
 * Values: BANK | CARD | CASH | EPAY
 */
export type AccountType = "BANK" | "CARD" | "CASH" | "EPAY";

/** TransactionType mirrors the Prisma TransactionType enum. */
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

// ---------------------------------------------------------------------------
// Enriched / joined types
// ---------------------------------------------------------------------------

/** A transaction record with its related Category and Account. */
export interface TransactionWithRelations {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: Date;
  categoryId: string | null;
  accountId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
  account: {
    id: string;
    name: string;
    type: AccountType;
  };
}

/** A category record augmented with the count of associated transactions. */
export interface CategoryWithCount {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  userId: string;
  _count: {
    transactions: number;
  };
}

/** A budget record augmented with the total amount already spent. */
export interface BudgetWithSpent {
  id: string;
  name: string;
  amount: number;
  period: string;
  categoryId: string | null;
  userId: string;
  startDate: Date;
  endDate: Date | null;
  /** Aggregated total of expense transactions within this budget period. */
  spent: number;
}

// ---------------------------------------------------------------------------
// Aggregate / stats types
// ---------------------------------------------------------------------------

/** Monthly financial summary. */
export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  /** totalIncome - totalExpense */
  balance: number;
  transactionCount: number;
}

// ---------------------------------------------------------------------------
// UI helper types
// ---------------------------------------------------------------------------

/** Single data point for chart rendering. */
export interface ChartDataPoint {
  label: string;
  value: number;
  /** Hex or Tailwind colour string, e.g. "#3B82F6". */
  color?: string;
}

/** Inclusive date range. */
export interface DateRange {
  start: Date;
  end: Date;
}
