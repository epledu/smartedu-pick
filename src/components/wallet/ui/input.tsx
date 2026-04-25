"use client";

/**
 * Reusable Input component with optional label and error message display.
 *
 * Accepts all standard HTML input attributes via forwarded ref.
 */
import * as React from "react";
import { cn } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional visible label rendered above the input. */
  label?: string;
  /** When provided, renders a red error message below the input. */
  error?: string;
  /** Wrapper className for the outer div. */
  wrapperClassName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, wrapperClassName, id, ...props }, ref) => {
    // Generate a stable id for label→input association when none is provided.
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none text-foreground"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border",
            "border-gray-300 dark:border-white/15",
            "bg-white dark:bg-[#2a211c]",
            "px-3 py-2 text-sm",
            "text-gray-900 dark:text-[#F5E6D3]",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400",
            "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1a1411]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
