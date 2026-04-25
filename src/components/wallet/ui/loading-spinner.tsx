"use client";

/**
 * Simple animated loading spinner.
 */
import { cn } from "@/lib/wallet/utils";

interface LoadingSpinnerProps {
  /** Tailwind size class (e.g. "w-4 h-4"). Default: "w-5 h-5" */
  size?: string;
  className?: string;
  /** Screen-reader label */
  label?: string;
}

export function LoadingSpinner({
  size = "w-5 h-5",
  className,
  label = "로딩 중...",
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <svg
        className={cn("animate-spin text-current", size)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>
  );
}

/** Full-page centered loading state */
export function PageLoader({ message = "로딩 중..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-gray-400">
      <LoadingSpinner size="w-8 h-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
