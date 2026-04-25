"use client";

/**
 * AccountList — grid view of all user accounts grouped by type.
 *
 * Groups: 은행 / 카드 / 현금 / 간편결제
 * Shows total balance per group and overall.
 * Renders "새 계좌 추가" trailing card and empty state.
 */

import React from "react";
import { Plus } from "lucide-react";
import { AccountCard } from "@/components/wallet/accounts/account-card";
import { cn } from "@/lib/wallet/utils";
import type { Account, AccountType } from "@/hooks/wallet/use-accounts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GROUP_ORDER: AccountType[] = ["BANK", "CARD", "CASH", "EPAY"];

const GROUP_LABELS: Record<AccountType, string> = {
  BANK: "은행",
  CARD: "카드",
  CASH: "현금",
  EPAY: "간편결제",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse balance from Prisma Decimal (string) or number to float. */
function toNumber(val: number | string): number {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}

/** Format as KRW currency string. */
function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onAdd: () => void;
  onSelect?: (account: Account) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AccountList({ accounts, onEdit, onAdd, onSelect }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="mb-4 text-sm">등록된 계좌가 없습니다.</p>
        <button
          onClick={onAdd}
          className={cn(
            "flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300",
            "px-6 py-3 text-sm font-medium text-gray-400",
            "hover:border-blue-400 hover:text-blue-500 transition-colors"
          )}
        >
          <Plus className="h-4 w-4" />
          새 계좌 추가
        </button>
      </div>
    );
  }

  // Group accounts by type
  const grouped = GROUP_ORDER.reduce<Record<AccountType, Account[]>>(
    (acc, type) => {
      acc[type] = accounts.filter((a) => a.type === type);
      return acc;
    },
    { BANK: [], CARD: [], CASH: [], EPAY: [] }
  );

  return (
    <div className="space-y-8">
      {GROUP_ORDER.map((type) => {
        const group = grouped[type];
        if (group.length === 0) return null;

        const groupTotal = group.reduce(
          (sum, a) => sum + toNumber(a.balance),
          0
        );

        return (
          <section key={type}>
            {/* Group header */}
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                {GROUP_LABELS[type]}
              </h2>
              <span className="text-sm font-medium text-gray-500">
                합계 {formatKRW(groupTotal)}
              </span>
            </div>

            {/* Account cards grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {group.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={onEdit}
                  onClick={onSelect}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Add account card */}
      <button
        onClick={onAdd}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl",
          "border-2 border-dashed border-gray-300 py-4",
          "text-sm font-medium text-gray-400",
          "hover:border-blue-400 hover:text-blue-500 transition-colors"
        )}
      >
        <Plus className="h-4 w-4" />
        새 계좌 추가
      </button>
    </div>
  );
}
