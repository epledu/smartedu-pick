"use client";

/**
 * Skeleton loader components for loading states.
 * Uses CSS shimmer animation defined in globals.css.
 */
import { cn } from "@/lib/wallet/utils";

interface SkeletonProps {
  className?: string;
}

/** Base skeleton block with shimmer animation */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded-md bg-gray-200",
        className
      )}
      aria-hidden="true"
    />
  );
}

/** Single line of text placeholder */
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full rounded", className)} />;
}

/** Card-shaped placeholder */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
    </div>
  );
}

/** Row placeholder for lists */
export function SkeletonListItem({ className }: SkeletonProps) {
  return (
    <div
      className={cn("flex items-center gap-3 py-2.5", className)}
      aria-hidden="true"
    >
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/** Dashboard summary grid skeleton */
export function SkeletonSummaryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3" aria-busy="true" aria-label="로딩 중">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
