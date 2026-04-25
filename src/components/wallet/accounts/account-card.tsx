"use client";

/**
 * AccountCard — displays a single financial account summary.
 *
 * Shows:
 *  - Colored icon circle with account type icon
 *  - Account name
 *  - Type badge (은행/카드/현금/간편결제)
 *  - Formatted KRW balance
 *  - Edit button
 *  - Visual border color distinguishing account type
 */

import React from "react";
import {
  Building2,
  CreditCard,
  Banknote,
  Smartphone,
  Pencil,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { cn } from "@/lib/wallet/utils";
import type { Account, AccountType } from "@/hooks/wallet/use-accounts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default icon component per account type. */
const TYPE_ICONS: Record<AccountType, LucideIcon> = {
  BANK: Building2,
  CARD: CreditCard,
  CASH: Banknote,
  EPAY: Smartphone,
};

/** Korean display labels per account type. */
const TYPE_LABELS: Record<AccountType, string> = {
  BANK: "은행",
  CARD: "카드",
  CASH: "현금",
  EPAY: "간편결제",
};

/** Tailwind border color class per account type. */
const TYPE_BORDER_COLORS: Record<AccountType, string> = {
  BANK: "border-blue-300",
  CARD: "border-purple-300",
  CASH: "border-green-300",
  EPAY: "border-orange-300",
};

/** Tailwind badge color classes per account type. */
const TYPE_BADGE_COLORS: Record<AccountType, string> = {
  BANK: "bg-blue-100 text-blue-700",
  CARD: "bg-purple-100 text-purple-700",
  CASH: "bg-green-100 text-green-700",
  EPAY: "bg-orange-100 text-orange-700",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a numeric balance as Korean Won string. */
function formatKRW(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "₩0";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(num);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onClick?: (account: Account) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AccountCard({ account, onEdit, onClick }: AccountCardProps) {
  const IconComponent = TYPE_ICONS[account.type] ?? Building2;
  const typeLabel = TYPE_LABELS[account.type] ?? account.type;
  const borderColor = TYPE_BORDER_COLORS[account.type] ?? "border-gray-200";
  const badgeColor = TYPE_BADGE_COLORS[account.type] ?? "bg-gray-100 text-gray-700";
  const iconBg = account.color ?? "#6366F1";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border-2 bg-white p-4 shadow-sm",
        "hover:shadow-md transition-shadow",
        borderColor,
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick ? () => onClick(account) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => e.key === "Enter" && onClick(account)
          : undefined
      }
    >
      {/* Type badge */}
      <span
        className={cn(
          "absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium",
          badgeColor
        )}
      >
        {typeLabel}
      </span>

      {/* Icon circle */}
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <IconComponent className="h-5 w-5 text-white" />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-800 truncate pr-12">
        {account.name}
      </p>

      {/* Balance */}
      <p className="mt-1 text-base font-bold text-gray-900">
        {formatKRW(account.balance)}
      </p>

      {/* Transaction count */}
      {account._count !== undefined && (
        <span className="mt-0.5 text-xs text-gray-400">
          거래 {account._count.transactions}건
        </span>
      )}

      {/* Edit button */}
      <div className="mt-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(account);
          }}
          aria-label="편집"
          className="h-7 px-2"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
