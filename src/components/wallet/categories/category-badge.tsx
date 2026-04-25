"use client";

/**
 * CategoryBadge — compact inline representation of a category.
 *
 * Renders a small coloured icon circle next to the category name.
 * Used in transaction lists, filter dropdowns, and summary rows.
 *
 * Sizes:
 *  - sm  : 20 px icon circle, text-xs label
 *  - md  : 28 px icon circle, text-sm label  (default)
 */

import React from "react";
import {
  Utensils, Car, ShoppingBag, Film, Heart, GraduationCap, Home,
  Coffee, Smartphone, Gift, Plane, Dumbbell, Bus, BookOpen,
  HeartPulse, Ticket, MoreHorizontal, LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Icon resolver
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils, Car, ShoppingBag, Film, Heart, GraduationCap, Home,
  Coffee, Smartphone, Gift, Plane, Dumbbell, Bus, BookOpen,
  HeartPulse, Ticket, MoreHorizontal,
  UtensilsCrossed: Utensils,
};

function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name && ICON_MAP[name]) ? ICON_MAP[name] : MoreHorizontal;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CategoryBadgeProps {
  category: {
    name: string;
    icon?: string | null;
    color?: string | null;
  };
  /** Visual size: "sm" (compact) | "md" (default) */
  size?: "sm" | "md";
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CategoryBadge({
  category,
  size = "md",
  className,
}: CategoryBadgeProps) {
  const IconComponent = resolveIcon(category.icon);

  const circleSize = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={category.name}
    >
      {/* Coloured icon circle */}
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full",
          circleSize
        )}
        style={{ backgroundColor: category.color ?? "#9CA3AF" }}
      >
        <IconComponent className={cn("text-white", iconSize)} />
      </span>

      {/* Category name */}
      <span className={cn("font-medium text-gray-700", textSize)}>
        {category.name}
      </span>
    </span>
  );
}
