"use client";

/**
 * PointSummary — top-level summary cards for the points page.
 *
 * Displays:
 *  - Total apptech balance
 *  - Total loyalty balance
 *  - Combined total
 *  - Number of active providers
 */

import { Smartphone, Tag, Coins, Layers } from "lucide-react";
import type { Point } from "@/hooks/wallet/use-points";

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PointSummaryProps {
  apptechPoints: Point[];
  loyaltyPoints: Point[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PointSummary({ apptechPoints, loyaltyPoints }: PointSummaryProps) {
  const apptechTotal = apptechPoints.reduce((s, p) => s + toNumber(p.balance), 0);
  const loyaltyTotal = loyaltyPoints.reduce((s, p) => s + toNumber(p.balance), 0);
  const combined = apptechTotal + loyaltyTotal;
  const providerCount = apptechPoints.length + loyaltyPoints.length;

  const cards = [
    {
      label: "앱테크 포인트",
      value: formatKRW(apptechTotal),
      sub: `${apptechPoints.length}개 제공사`,
      icon: Smartphone,
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
      textColor: "text-blue-700",
    },
    {
      label: "적립 포인트",
      value: formatKRW(loyaltyTotal),
      sub: `${loyaltyPoints.length}개 제공사`,
      icon: Tag,
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
      textColor: "text-orange-700",
    },
    {
      label: "전체 합계",
      value: formatKRW(combined),
      sub: `총 ${providerCount}개 제공사`,
      icon: Coins,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      textColor: "text-indigo-700",
    },
    {
      label: "등록 제공사",
      value: `${providerCount}개`,
      sub: "앱테크 + 적립",
      icon: Layers,
      bg: "bg-gray-50",
      iconColor: "text-gray-500",
      textColor: "text-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon, bg, iconColor, textColor }) => (
        <div
          key={label}
          className={`rounded-xl border border-gray-100 ${bg} p-4 shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${iconColor}`} />
            <span className="text-xs font-medium text-gray-500">{label}</span>
          </div>
          <p className={`text-xl font-bold ${textColor}`}>{value}</p>
          <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
        </div>
      ))}
    </div>
  );
}
