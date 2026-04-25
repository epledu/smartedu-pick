/**
 * Spending pattern analysis functions.
 *
 * Pure functions — no DB access. All functions accept pre-fetched data
 * and return structured analysis results used by the insights API route.
 */
import type {
  InsightSeverity,
  Insight,
  CategorySpend,
  TransactionInput,
  BudgetInput,
  CategoryChangeResult,
  VelocityResult,
  MerchantResult,
  DayOfWeekResult,
  BudgetProjectionResult,
  AnalysisInput,
} from "./insights-types";

// Re-export types so consumers can import from a single location
export type {
  InsightSeverity,
  InsightType,
  Insight,
  CategorySpend,
  TransactionInput,
  BudgetInput,
  CategoryChangeResult,
  VelocityResult,
  MerchantResult,
  DayOfWeekResult,
  BudgetProjectionResult,
  AnalysisInput,
} from "./insights-types";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// ---------------------------------------------------------------------------
// Category change analysis
// ---------------------------------------------------------------------------

/**
 * Compares this month's category spending vs last month.
 * Returns items where spending changed significantly (>= 10%).
 */
export function analyzeCategoryChange(
  thisMonth: CategorySpend[],
  lastMonth: CategorySpend[]
): CategoryChangeResult[] {
  const lastMap = new Map(lastMonth.map((c) => [c.categoryId, c.total]));
  const results: CategoryChangeResult[] = [];

  for (const cur of thisMonth) {
    const prev = lastMap.get(cur.categoryId) ?? 0;
    if (prev === 0 || cur.total === 0) continue;

    const changePercent = ((cur.total - prev) / prev) * 100;
    if (Math.abs(changePercent) < 10) continue;

    let severity: InsightSeverity = "info";
    if (changePercent >= 50) severity = "critical";
    else if (changePercent >= 20) severity = "warning";
    else if (changePercent <= -20) severity = "positive";

    results.push({ categoryId: cur.categoryId, name: cur.name, changePercent, severity });
  }

  return results.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
}

// ---------------------------------------------------------------------------
// Spending velocity analysis
// ---------------------------------------------------------------------------

/**
 * Compares last-7-day daily average against last-30-day daily average.
 * Only considers EXPENSE transactions.
 */
export function analyzeSpendingVelocity(
  transactions: TransactionInput[]
): VelocityResult {
  const now = new Date();
  const cutoff30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const cutoff7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const last30 = expenses.filter((t) => new Date(t.date) >= cutoff30);
  const last7 = expenses.filter((t) => new Date(t.date) >= cutoff7);

  const avgDailyLast30 = last30.reduce((s, t) => s + t.amount, 0) / 30;
  const avgDailyLast7 = last7.reduce((s, t) => s + t.amount, 0) / 7;
  const changePercent =
    avgDailyLast30 > 0 ? ((avgDailyLast7 - avgDailyLast30) / avgDailyLast30) * 100 : 0;

  return { avgDailyLast30, avgDailyLast7, changePercent };
}

// ---------------------------------------------------------------------------
// Top merchant analysis
// ---------------------------------------------------------------------------

/**
 * Returns the top merchants by visit frequency from EXPENSE transactions.
 */
export function analyzeTopMerchants(
  transactions: TransactionInput[],
  limit = 3
): MerchantResult[] {
  const map = new Map<string, { count: number; totalAmount: number }>();

  for (const tx of transactions) {
    if (tx.type !== "EXPENSE" || !tx.merchantName) continue;
    const existing = map.get(tx.merchantName) ?? { count: 0, totalAmount: 0 };
    map.set(tx.merchantName, {
      count: existing.count + 1,
      totalAmount: existing.totalAmount + tx.amount,
    });
  }

  return Array.from(map.entries())
    .map(([merchantName, stats]) => ({ merchantName, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Day-of-week pattern analysis
// ---------------------------------------------------------------------------

/**
 * Returns spending distribution across weekdays from EXPENSE transactions.
 */
export function analyzeDayOfWeekPattern(
  transactions: TransactionInput[]
): DayOfWeekResult[] {
  const buckets = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    label: WEEKDAY_LABELS[i],
    totalAmount: 0,
    count: 0,
  }));

  for (const tx of transactions) {
    if (tx.type !== "EXPENSE") continue;
    const dow = new Date(tx.date).getDay();
    buckets[dow].totalAmount += tx.amount;
    buckets[dow].count += 1;
  }

  return buckets;
}

// ---------------------------------------------------------------------------
// Budget projection analysis
// ---------------------------------------------------------------------------

/**
 * Projects end-of-month spending based on current pace.
 * Returns categories where the projection exceeds 110% of budget.
 */
export function analyzeBudgetProgress(
  budgets: BudgetInput[],
  daysElapsed: number,
  daysInMonth: number
): BudgetProjectionResult[] {
  if (daysElapsed === 0) return [];

  return budgets
    .map((b) => {
      const projectedAmount = (b.spent / daysElapsed) * daysInMonth;
      const projectedPercent = b.amount > 0 ? (projectedAmount / b.amount) * 100 : 0;
      return {
        categoryId: b.categoryId,
        categoryName: b.categoryName,
        budgetAmount: b.amount,
        spent: b.spent,
        projectedAmount,
        projectedPercent,
      };
    })
    .filter((r) => r.projectedPercent > 110)
    .sort((a, b) => b.projectedPercent - a.projectedPercent);
}

// ---------------------------------------------------------------------------
// Message generation
// ---------------------------------------------------------------------------

const SEVERITY_ORDER: Record<InsightSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  positive: 3,
};

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Generates human-readable Korean insight messages from analysis results.
 * Returns insights sorted by severity (critical → warning → info → positive).
 */
export function generateInsightMessages(analysis: AnalysisInput): Insight[] {
  const insights: Insight[] = [];

  // Category change insights
  for (const change of analysis.categoryChanges.slice(0, 3)) {
    const abs = Math.abs(change.changePercent).toFixed(0);
    if (change.changePercent > 0) {
      insights.push({
        type: "category_change",
        severity: change.severity,
        message: `지난달 대비 ${change.name} 지출이 ${abs}% 증가했습니다.`,
        icon: "TrendingUp",
        data: { categoryId: change.categoryId, changePercent: change.changePercent },
      });
    } else {
      insights.push({
        type: "positive",
        severity: "positive",
        message: `지난달 대비 ${change.name} 지출이 ${abs}% 감소했습니다. 잘 하고 계세요!`,
        icon: "TrendingDown",
        data: { categoryId: change.categoryId, changePercent: change.changePercent },
      });
    }
  }

  // Spending velocity insight
  if (analysis.velocity.changePercent >= 50) {
    const multiple = (analysis.velocity.avgDailyLast7 / analysis.velocity.avgDailyLast30).toFixed(1);
    insights.push({
      type: "spending_velocity",
      severity: "warning",
      message: `이번 주 일평균 지출이 최근 30일 평균보다 ${multiple}배 많습니다.`,
      icon: "Zap",
      data: { changePercent: analysis.velocity.changePercent },
    });
  }

  // Average daily spend insight
  if (analysis.avgDailySpend > 0) {
    insights.push({
      type: "spending_velocity",
      severity: "info",
      message: `최근 30일 평균 일일 지출: ${formatKRW(analysis.avgDailySpend)}`,
      icon: "Calendar",
      data: { avgDailySpend: analysis.avgDailySpend },
    });
  }

  // Top merchant insight
  if (analysis.topMerchants.length > 0) {
    const top = analysis.topMerchants.map((m) => `${m.merchantName} (${m.count}회)`).join(", ");
    insights.push({
      type: "top_merchant",
      severity: "info",
      message: `가장 많이 방문한 가맹점 TOP ${analysis.topMerchants.length}: ${top}`,
      icon: "Store",
      data: { merchants: analysis.topMerchants },
    });
  }

  // Budget projection insights
  for (const proj of analysis.budgetProjections.slice(0, 3)) {
    const pct = proj.projectedPercent.toFixed(0);
    const sev: InsightSeverity = proj.projectedPercent > 150 ? "critical" : "warning";
    insights.push({
      type: "budget_projection",
      severity: sev,
      message: `${proj.categoryName} 예산이 이 속도라면 이번 달 ${pct}% 초과할 것으로 예상됩니다.`,
      icon: "AlertTriangle",
      data: {
        categoryId: proj.categoryId,
        projectedPercent: proj.projectedPercent,
        budgetAmount: proj.budgetAmount,
      },
    });
  }

  return insights.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
