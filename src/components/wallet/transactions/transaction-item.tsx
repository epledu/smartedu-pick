"use client";

/**
 * TransactionItem
 *
 * Renders a single transaction row with category icon, description,
 * amount, and edit/delete action buttons.
 */
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/wallet/utils";
import type { Transaction } from "@/hooks/wallet/use-transactions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

// ---------------------------------------------------------------------------
// Category icon circle
// ---------------------------------------------------------------------------

function CategoryIcon({ icon, color }: { icon?: string | null; color?: string | null }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base shrink-0"
      style={{ backgroundColor: color ?? "#9CA3AF" }}
    >
      {icon ? (
        // Render the icon name as a text label if no actual icon component is resolved
        <span className="text-xs font-bold leading-none">
          {icon.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <span className="text-xs font-bold">?</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransactionItem({ transaction, onEdit, onDelete }: Props) {
  const [showActions, setShowActions] = useState(false);

  const isIncome = transaction.type === "INCOME";
  const amount = Number(transaction.amount);

  const primaryLabel = transaction.merchantName || transaction.memo || "내역 없음";
  const secondaryLabel = transaction.category?.name ?? "미분류";
  const dateLabel = formatDate(transaction.date, "MM.dd HH:mm");

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
      onClick={() => setShowActions((v) => !v)}
    >
      {/* Category icon */}
      <CategoryIcon
        icon={transaction.category?.icon}
        color={transaction.category?.color}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{primaryLabel}</p>
        <p className="text-xs text-gray-400 truncate">
          {secondaryLabel}
          <span className="mx-1">·</span>
          {transaction.account.name}
          <span className="mx-1">·</span>
          {dateLabel}
        </p>
      </div>

      {/* Amount */}
      <span
        className={`text-sm font-semibold shrink-0 ${
          isIncome ? "text-blue-500" : "text-red-500"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(amount)}
      </span>

      {/* Action buttons — visible on tap (mobile) or hover (desktop), 44px tap targets */}
      {showActions && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-white shadow-lg border border-gray-100 rounded-lg p-1 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
              onEdit();
            }}
            className="flex items-center justify-center w-11 h-11 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
            aria-label="편집"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
              onDelete();
            }}
            className="flex items-center justify-center w-11 h-11 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            aria-label="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
