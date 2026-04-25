"use client";

/**
 * PointCard — displays a single point provider balance.
 *
 * Shows provider icon (colored), name, balance, last-updated relative time,
 * and an expiry warning when expiresAt is within 30 days.
 * Clicking the card triggers the onSelect callback.
 */

import { AlertTriangle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Point } from "@/hooks/wallet/use-points";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNumber(val: number | string): number {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}

function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

/** Resolve a Lucide icon by its PascalCase name string. */
function resolveIcon(iconName: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName];
  return icon ?? LucideIcons.Circle;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PointCardProps {
  point: Point;
  /** Provider metadata from POINT_PROVIDERS constant. */
  providerMeta?: {
    name: string;
    icon: string;
    color: string;
    type: "pay" | "points" | "convenience";
  };
  onSelect: (point: Point) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PointCard({ point, providerMeta, onSelect }: PointCardProps) {
  const balance = toNumber(point.balance);
  const iconName = providerMeta?.icon ?? "Coins";
  const color = providerMeta?.color ?? (point.type === "APPTECH" ? "#3B82F6" : "#F97316");
  const name = providerMeta?.name ?? point.provider;

  const Icon = resolveIcon(iconName);

  // Expiry warning: less than 30 days remaining
  const expiringDays = point.expiresAt ? daysUntil(point.expiresAt) : null;
  const isExpiringSoon = expiringDays !== null && expiringDays <= 30 && expiringDays >= 0;
  const isExpired = expiringDays !== null && expiringDays < 0;

  // Color palette based on type
  const cardBg =
    point.type === "APPTECH"
      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
      : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100";

  return (
    <button
      type="button"
      onClick={() => onSelect(point)}
      className={`w-full text-left rounded-2xl border ${cardBg} p-4 shadow-sm
        hover:shadow-md transition-all duration-150 focus:outline-none
        focus:ring-2 focus:ring-indigo-400`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>

        {/* Expiry badge */}
        {isExpired && (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            <AlertTriangle className="w-3 h-3" />
            만료됨
          </span>
        )}
        {isExpiringSoon && !isExpired && (
          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
            <AlertTriangle className="w-3 h-3" />
            {expiringDays}일 후 만료
          </span>
        )}
      </div>

      {/* Provider name */}
      <p className="text-sm font-medium text-gray-600 mb-1">{name}</p>

      {/* Balance */}
      <p className="text-2xl font-bold text-gray-900">{formatKRW(balance)}</p>

      {/* Last updated */}
      <p className="mt-1.5 text-xs text-gray-400">
        {relativeTime(point.lastUpdated)} 업데이트
      </p>
    </button>
  );
}
