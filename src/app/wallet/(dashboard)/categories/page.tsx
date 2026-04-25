"use client";

/**
 * Categories management page — /categories
 *
 * Layout:
 *  - Header: "카테고리 관리"
 *  - Tab bar: 전체 / 기본 / 사용자 정의
 *  - CategoryList with filtered categories
 *  - Modal overlay for CategoryForm (add / edit)
 */

import React, { useEffect, useState } from "react";
import { CategoryList } from "@/components/wallet/categories/category-list";
import { CategoryForm } from "@/components/wallet/categories/category-form";
import { useCategories } from "@/hooks/wallet/use-categories";
import type { Category, CreateCategoryData, UpdateCategoryData } from "@/hooks/wallet/use-categories";
import { cn } from "@/lib/wallet/utils";

// ---------------------------------------------------------------------------
// Tab types
// ---------------------------------------------------------------------------

type Tab = "all" | "default" | "custom";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "default", label: "기본" },
  { id: "custom", label: "사용자 정의" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const filtered = categories.filter((cat) => {
    if (activeTab === "default") return cat.isDefault;
    if (activeTab === "custom") return !cat.isDefault;
    return true;
  });

  // Parent categories for the subcategory selector (top-level only)
  const topLevel = categories.filter((c) => !c.parentId);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditTarget(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSubmit = async (data: CreateCategoryData | UpdateCategoryData) => {
    if (editTarget) {
      await updateCategory(editTarget.id, data as UpdateCategoryData);
    } else {
      await createCategory(data as CreateCategoryData);
    }
    closeModal();
  };

  const handleDelete = async (category: Category) => {
    await deleteCategory(category.id);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">카테고리 관리</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          지출 및 수입 카테고리를 관리합니다.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tab bar */}
      {/* Tab bar — dark mode: border and inactive text */}
      <div className="mb-5 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          불러오는 중...
        </div>
      ) : (
        <CategoryList
          categories={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openAdd}
        />
      )}

      {/* Modal overlay — dark mode: inner card */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editTarget ? "카테고리 편집" : "새 카테고리"}
            </h2>
            <CategoryForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              initialData={editTarget ?? undefined}
              parentCategories={topLevel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
