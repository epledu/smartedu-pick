"use client";

/**
 * CategoryForm — create or edit a spending category.
 *
 * Renders:
 *  - Text input for category name
 *  - Icon picker (grid of Lucide icons)
 *  - Color picker (12-color palette)
 *  - Optional parent category selector (for subcategories)
 *  - Save / Cancel action buttons
 */

import React, { useState } from "react";
import {
  Utensils, Car, ShoppingBag, Film, Heart, GraduationCap, Home,
  Coffee, Smartphone, Gift, Plane, Dumbbell, Bus, BookOpen,
  HeartPulse, Ticket, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { Input } from "@/components/wallet/ui/input";
import { cn } from "@/lib/wallet/utils";
import type { Category, CreateCategoryData, UpdateCategoryData } from "@/hooks/wallet/use-categories";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_OPTIONS = [
  { name: "Utensils", Component: Utensils },
  { name: "Car", Component: Car },
  { name: "ShoppingBag", Component: ShoppingBag },
  { name: "Film", Component: Film },
  { name: "Heart", Component: Heart },
  { name: "GraduationCap", Component: GraduationCap },
  { name: "Home", Component: Home },
  { name: "Coffee", Component: Coffee },
  { name: "Smartphone", Component: Smartphone },
  { name: "Gift", Component: Gift },
  { name: "Plane", Component: Plane },
  { name: "Dumbbell", Component: Dumbbell },
  { name: "Bus", Component: Bus },
  { name: "BookOpen", Component: BookOpen },
  { name: "HeartPulse", Component: HeartPulse },
  { name: "Ticket", Component: Ticket },
  { name: "MoreHorizontal", Component: MoreHorizontal },
] as const;

const COLOR_PALETTE = [
  "#F97316", "#EF4444", "#EC4899", "#8B5CF6",
  "#6366F1", "#3B82F6", "#0EA5E9", "#10B981",
  "#84CC16", "#EAB308", "#D97706", "#9CA3AF",
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CategoryFormProps {
  /** Called with form data when the user saves. */
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => Promise<void>;
  /** Called when the user cancels. */
  onCancel: () => void;
  /** Pre-populated values for edit mode. */
  initialData?: Partial<Category>;
  /** Available parent categories (top-level only). */
  parentCategories?: Category[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CategoryForm({
  onSubmit,
  onCancel,
  initialData,
  parentCategories = [],
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [icon, setIcon] = useState<string>(initialData?.icon ?? "MoreHorizontal");
  const [color, setColor] = useState<string>(initialData?.color ?? "#9CA3AF");
  const [parentId, setParentId] = useState<string>(initialData?.parentId ?? "");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const isDefault = initialData?.isDefault ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("카테고리 이름을 입력해주세요.");
      return;
    }
    setNameError("");
    setSaving(true);

    const data: CreateCategoryData | UpdateCategoryData = isDefault
      ? { icon, color }
      : {
          name: name.trim(),
          icon,
          color,
          ...(parentId ? { parentId } : {}),
        };

    try {
      await onSubmit(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">카테고리 이름</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 운동, 취미"
          disabled={isDefault}
        />
        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        {isDefault && (
          <p className="text-xs text-gray-400">기본 카테고리는 이름을 변경할 수 없습니다.</p>
        )}
      </div>

      {/* Icon picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">아이콘</label>
        <div className="grid grid-cols-6 gap-2">
          {ICON_OPTIONS.map(({ name: iconName, Component }) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setIcon(iconName)}
              className={cn(
                "flex items-center justify-center rounded-lg p-2 border transition-colors",
                icon === iconName
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Component className="h-5 w-5 text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">색상</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => setColor(hex)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform",
                color === hex ? "border-gray-800 scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: hex }}
              aria-label={hex}
            />
          ))}
        </div>
      </div>

      {/* Parent category selector */}
      {!isDefault && parentCategories.length > 0 && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">상위 카테고리 (선택)</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">없음</option>
            {parentCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          취소
        </Button>
        <Button type="submit" isLoading={saving} loadingText="저장 중...">
          저장
        </Button>
      </div>
    </form>
  );
}
