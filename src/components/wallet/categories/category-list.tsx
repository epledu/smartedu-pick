"use client";

/**
 * CategoryList — grid view of all categories.
 *
 * Each card shows:
 *  - Colored icon
 *  - Category name
 *  - Transaction count badge
 *  - Lock icon for default (non-deletable) categories
 *  - Edit button on every card
 *  - Delete button (custom categories only) with confirmation dialog
 *
 * A trailing "새 카테고리 추가" dashed card is always rendered.
 */

import React, { useState } from "react";
import {
  Utensils, Car, ShoppingBag, Film, Heart, GraduationCap, Home,
  Coffee, Smartphone, Gift, Plane, Dumbbell, Bus, BookOpen,
  HeartPulse, Ticket, MoreHorizontal, Lock, Pencil, Trash2, Plus,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { cn } from "@/lib/wallet/utils";
import type { Category } from "@/hooks/wallet/use-categories";

// ---------------------------------------------------------------------------
// Icon resolver
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils, Car, ShoppingBag, Film, Heart, GraduationCap, Home,
  Coffee, Smartphone, Gift, Plane, Dumbbell, Bus, BookOpen,
  HeartPulse, Ticket, MoreHorizontal,
  UtensilsCrossed: Utensils,
};

function resolveIcon(name: string | null): LucideIcon {
  return (name && ICON_MAP[name]) ? ICON_MAP[name] : MoreHorizontal;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAdd: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const IconComponent = resolveIcon(category.icon);
  const txCount = category._count?.transactions ?? 0;

  const handleDeleteClick = () => setConfirmOpen(true);

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete(category);
  };

  return (
    <div className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Lock badge for default categories */}
      {category.isDefault && (
        <span className="absolute right-3 top-3 text-gray-400" aria-label="기본 카테고리">
          <Lock className="h-3.5 w-3.5" />
        </span>
      )}

      {/* Icon circle */}
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: category.color ?? "#9CA3AF" }}
      >
        <IconComponent className="h-5 w-5 text-white" />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-800 truncate">{category.name}</p>

      {/* Transaction count badge */}
      <span className="mt-1 text-xs text-gray-500">{txCount}건</span>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(category)}
          aria-label="편집"
          className="h-7 px-2"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        {!category.isDefault && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDeleteClick}
            aria-label="삭제"
            className="h-7 px-2 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Inline confirmation dialog */}
      {confirmOpen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/95 p-4 text-center">
          <p className="text-sm font-medium text-gray-800 mb-3">
            삭제하면 해당 거래가 &apos;미분류&apos;로 이동됩니다.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              취소
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              삭제
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CategoryList({ categories, onEdit, onDelete, onAdd }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Add new category card */}
      <button
        onClick={onAdd}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl",
          "border-2 border-dashed border-gray-300 p-4",
          "text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors",
          "min-h-[140px]"
        )}
      >
        <Plus className="mb-1 h-6 w-6" />
        <span className="text-xs font-medium">새 카테고리 추가</span>
      </button>
    </div>
  );
}
