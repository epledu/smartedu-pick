"use client";

/**
 * Accounts management page — /accounts
 *
 * Layout:
 *  - Header: "계좌 관리"
 *  - Summary bar: total balance across all accounts
 *  - AccountList (grouped by type)
 *  - Modal overlay for AccountForm (add / edit)
 */

import React, { useEffect, useState } from "react";
import { AccountList } from "@/components/wallet/accounts/account-list";
import { AccountForm } from "@/components/wallet/accounts/account-form";
import { useAccounts } from "@/hooks/wallet/use-accounts";
import type {
  Account,
  CreateAccountData,
  UpdateAccountData,
} from "@/hooks/wallet/use-accounts";

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
// Page component
// ---------------------------------------------------------------------------

export default function AccountsPage() {
  const {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const totalBalance = accounts.reduce(
    (sum, a) => sum + toNumber(a.balance),
    0
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditTarget(account);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSubmit = async (data: CreateAccountData | UpdateAccountData) => {
    if (editTarget) {
      await updateAccount(editTarget.id, data as UpdateAccountData);
    } else {
      await createAccount(data as CreateAccountData);
    }
    closeModal();
  };

  const handleDelete = async (account: Account) => {
    await deleteAccount(account.id);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">계좌 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          은행 계좌, 카드, 현금, 간편결제 수단을 관리합니다.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary card */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">전체 자산 합계</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {formatKRW(totalBalance)}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          활성 계좌 {accounts.filter((a) => a.isActive).length}개
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          불러오는 중...
        </div>
      ) : (
        <AccountList
          accounts={accounts.filter((a) => a.isActive)}
          onEdit={openEdit}
          onAdd={openAdd}
        />
      )}

      {/* Delete button shown in edit mode */}
      {editTarget && modalOpen && (
        <div className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2">
          <button
            onClick={async () => {
              await handleDelete(editTarget);
              closeModal();
            }}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow hover:bg-red-100"
          >
            이 계좌 비활성화
          </button>
        </div>
      )}

      {/* Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {editTarget ? "계좌 편집" : "새 계좌 추가"}
            </h2>
            <AccountForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              initialData={editTarget ?? undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
