"use client";

/**
 * Reusable Button component built with class-variance-authority (CVA).
 *
 * Supports multiple visual variants and sizes, a forwarded ref,
 * disabled state, and an optional loading state with an inline spinner.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const buttonVariants = cva(
  // Base styles applied to every button
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md text-sm font-medium",
    "ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "whitespace-nowrap select-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, renders a spinner and disables the button. */
  isLoading?: boolean;
  /** Text shown next to the spinner while loading (optional). */
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {isLoading && loadingText ? loadingText : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
