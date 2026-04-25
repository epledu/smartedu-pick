"use client";

/**
 * TransactionList
 *
 * Renders transactions grouped by relative date (오늘, 어제, 이번 주, 이번 달).
 * Shows an empty state when there are no transactions and skeleton rows while loading.
 */
import React, { useState } from "react";
import { formatDate, formatCurrency } from "@/lib/wallet/utils";
import TransactionItem from "./transaction-item";
import type { Transaction } from "@/hooks/wallet/use-transactions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Date grouping helpers
// ---------------------------------------------------------------------------

function getGroupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays <= 7) return "이번 주";
  if (diffDays <= 31) return "이번 달";
  return formatDate(date, "yyyy년 MM월");
}

function groupByDate(transactions: Transaction[]): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>();
  const order: string[] = [];

  for (const tx of transactions) {
    const label = getGroupLabel(tx.date);
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(tx);
  }

  return order.map((label) => [label, map.get(label)!]);
}

// ---------------------------------------------------------------------------
// Skeleton row
// ---------------------------------------------------------------------------

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-16" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransactionList({ transactions, loading, onEdit, onDelete }: Props) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">📭</span>
        <p className="text-gray-500 text-sm leading-relaxed">
          아직 거래 내역이 없습니다.
          <br />
          첫 거래를 기록해보세요!
        </p>
      </div>
    );
  }

  const groups = groupByDate(transactions);

  function handleDeleteRequest(id: string) {
    setConfirmDeleteId(id);
  }

  function handleDeleteConfirm() {
    if (confirmDeleteId) {
      onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  }

  // Compute daily total per group for display
  function groupTotal(txs: Transaction[]): number {
    return txs.reduce((sum, t) => {
      const signed = t.type === "INCOME" ? Number(t.amount) : -Number(t.amount);
      return sum + signed;
    }, 0);
  }

  return (
    <>
      {/* Delete confirmation overlay */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm shadow-xl">
            <p className="text-sm text-gray-700 text-center mb-5">
              이 거래를 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {groups.map(([label, txs]) => (
          <div key={label}>
            {/* Group header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 sticky top-0">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}
              </span>
              <span
                className={
                  groupTotal(txs) >= 0
                    ? "text-xs font-medium text-blue-500"
                    : "text-xs font-medium text-red-500"
                }
              >
                {groupTotal(txs) >= 0 ? "+" : ""}
                {formatCurrency(groupTotal(txs))}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {txs.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onEdit={() => onEdit(tx)}
                  onDelete={() => handleDeleteRequest(tx.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
