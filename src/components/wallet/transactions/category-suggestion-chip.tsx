"use client";
/**
 * CategorySuggestionChip
 *
 * Inline chip displayed below the category dropdown when the classifier
 * has a suggestion that differs from the currently selected category.
 * User can click [적용] to accept, or ignore and choose manually.
 */
import React from "react";
import type { CategorySuggestion } from "@/hooks/wallet/use-category-suggestion";

interface Props {
  suggestion: CategorySuggestion;
  onApply: (categoryId: string) => void;
}

export default function CategorySuggestionChip({ suggestion, onApply }: Props) {
  const label =
    suggestion.source === "user-history" ? "이전 분류 기반" : "자동 추천";

  return (
    <div className="flex items-center gap-2 mt-1.5 text-xs text-blue-600">
      <span>
        {"\uD83D\uDCA1"} 추천 카테고리:{" "}
        <strong>{suggestion.categoryName}</strong> ({label})
      </span>
      <button
        type="button"
        onClick={() => onApply(suggestion.categoryId)}
        className="rounded px-1.5 py-0.5 bg-blue-100 hover:bg-blue-200 font-medium"
      >
        적용
      </button>
    </div>
  );
}
