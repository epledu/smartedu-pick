"use client";

/**
 * Points management page — /points
 *
 * Layout:
 *  - Header: "포인트 관리" + 새 포인트 추가 button
 *  - PointSummary: total cards across all providers
 *  - Tab bar: 앱테크 / 적립 포인트 / 전체
 *  - Grid of PointCards
 *  - PointDetailModal (when a card is clicked)
 *  - PointAddModal (when 새 포인트 추가 is clicked)
 */

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PointSummary } from "@/components/wallet/points/point-summary";
import { PointCard } from "@/components/wallet/points/point-card";
import { PointDetailModal } from "@/components/wallet/points/point-detail-modal";
import { PointAddModal } from "@/components/wallet/points/point-add-modal";
import { usePoints } from "@/hooks/wallet/use-points";
import { POINT_PROVIDERS } from "@/lib/wallet/constants";
import type { Point } from "@/hooks/wallet/use-points";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "all" | "apptech" | "loyalty";

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function PointsPage() {
  const {
    points,
    apptechPoints,
    loyaltyPoints,
    loading,
    error,
    fetchPoints,
    createPoint,
    updatePoint,
    deletePoint,
  } = usePoints();

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const visiblePoints =
    activeTab === "apptech"
      ? apptechPoints
      : activeTab === "loyalty"
        ? loyaltyPoints
        : points;

  const existingProviderIds = points.map((p) => p.provider);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleUpdate = async (
    id: string,
    balance: number,
    description: string
  ) => {
    await updatePoint(id, { balance, description });
  };

  const handleDelete = async (id: string) => {
    await deletePoint(id);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "apptech", label: "앱테크" },
    { key: "loyalty", label: "적립 포인트" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">포인트 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            앱테크 포인트 및 오프라인 적립금을 한곳에서 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5
            text-sm font-medium text-white hover:bg-indigo-700 transition-colors
            flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          새 포인트 추가
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6">
        <PointSummary
          apptechPoints={apptechPoints}
          loyaltyPoints={loyaltyPoints}
        />
      </div>

      {/* Tab bar */}
      <div className="mb-5 flex gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors
              ${activeTab === key
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Point grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          불러오는 중...
        </div>
      ) : visiblePoints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-sm">등록된 포인트가 없습니다.</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-3 text-sm text-indigo-600 underline underline-offset-2"
          >
            포인트 추가하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePoints.map((point) => {
            const meta = POINT_PROVIDERS.find((p) => p.id === point.provider);
            return (
              <PointCard
                key={point.id}
                point={point}
                providerMeta={meta}
                onSelect={setSelectedPoint}
              />
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selectedPoint && (
        <PointDetailModal
          point={selectedPoint}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setSelectedPoint(null)}
        />
      )}

      {/* Add modal */}
      {addModalOpen && (
        <PointAddModal
          existingProviderIds={existingProviderIds}
          onSubmit={async (data) => { await createPoint(data); }}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
}
