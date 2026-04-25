"use client";

/**
 * Reusable empty-state component.
 * Renders an icon/illustration, title, description, and an optional CTA button.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/wallet/utils";

interface EmptyStateProps {
  /** Lucide icon or any ReactNode to display at the top */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Optional call-to-action element (e.g. a <Button> or <Link>) */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-gray-400 max-w-xs mb-5">{description}</p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Preset: no transactions found
 */
export function NoTransactionsState({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={
        <span className="text-3xl" role="img" aria-label="거래 없음">
          📋
        </span>
      }
      title="거래 내역이 없어요"
      description="새 거래를 기록해 지출을 관리해 보세요."
      action={action}
    />
  );
}

/**
 * Preset: no budgets configured
 */
export function NoBudgetsState({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={
        <span className="text-3xl" role="img" aria-label="예산 없음">
          🎯
        </span>
      }
      title="예산을 설정해 보세요"
      description="카테고리별 예산을 설정하면 지출을 효과적으로 관리할 수 있어요."
      action={action}
    />
  );
}

/**
 * Preset: search returned nothing
 */
export function NoSearchResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={
        <span className="text-3xl" role="img" aria-label="검색 결과 없음">
          🔍
        </span>
      }
      title="검색 결과가 없어요"
      description={query ? `"${query}"에 해당하는 결과를 찾지 못했어요.` : "검색어를 바꿔 다시 시도해 보세요."}
    />
  );
}
