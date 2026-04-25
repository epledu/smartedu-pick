"use client";

/**
 * AccountForm — create or edit a financial account.
 *
 * Fields:
 *  - Account name (text input)
 *  - Account type selector (BANK / CARD / CASH / EPAY with icons)
 *  - Initial balance (number input, disabled when editing)
 *  - Color picker (12-color palette)
 *  - Icon picker (Building2 / CreditCard / Banknote / Smartphone)
 */

import React, { useState } from "react";
import {
  Building2,
  CreditCard,
  Banknote,
  Smartphone,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { Input } from "@/components/wallet/ui/input";
import { cn } from "@/lib/wallet/utils";
import type {
  Account,
  AccountType,
  CreateAccountData,
  UpdateAccountData,
} from "@/hooks/wallet/use-accounts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: { value: AccountType; label: string; Icon: LucideIcon }[] = [
  { value: "BANK", label: "은행", Icon: Building2 },
  { value: "CARD", label: "카드", Icon: CreditCard },
  { value: "CASH", label: "현금", Icon: Banknote },
  { value: "EPAY", label: "간편결제", Icon: Smartphone },
];

const ICON_OPTIONS: { name: string; Component: LucideIcon }[] = [
  { name: "Building2", Component: Building2 },
  { name: "CreditCard", Component: CreditCard },
  { name: "Banknote", Component: Banknote },
  { name: "Smartphone", Component: Smartphone },
];

/** Default icon name per account type. */
const DEFAULT_ICON_FOR_TYPE: Record<AccountType, string> = {
  BANK: "Building2",
  CARD: "CreditCard",
  CASH: "Banknote",
  EPAY: "Smartphone",
};

const COLOR_PALETTE = [
  "#F97316", "#EF4444", "#EC4899", "#8B5CF6",
  "#6366F1", "#3B82F6", "#0EA5E9", "#10B981",
  "#84CC16", "#EAB308", "#D97706", "#9CA3AF",
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AccountFormProps {
  /** Called with form data when the user saves. */
  onSubmit: (data: CreateAccountData | UpdateAccountData) => Promise<void>;
  /** Called when the user cancels. */
  onCancel: () => void;
  /** Pre-populated values for edit mode. */
  initialData?: Partial<Account>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AccountForm({ onSubmit, onCancel, initialData }: AccountFormProps) {
  const isEditing = Boolean(initialData?.id);

  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState<AccountType>(initialData?.type ?? "BANK");
  const [balance, setBalance] = useState(
    initialData?.balance !== undefined ? String(initialData.balance) : "0"
  );
  const [color, setColor] = useState(initialData?.color ?? "#6366F1");
  const [icon, setIcon] = useState(
    initialData?.icon ?? DEFAULT_ICON_FOR_TYPE[initialData?.type ?? "BANK"]
  );
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  // Sync icon default when type changes (only if user hasn't customized icon)
  const handleTypeChange = (newType: AccountType) => {
    setType(newType);
    // Auto-select the default icon for this type
    setIcon(DEFAULT_ICON_FOR_TYPE[newType]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("계좌명을 입력해주세요.");
      return;
    }
    setNameError("");
    setSaving(true);

    const data: CreateAccountData | UpdateAccountData = isEditing
      ? { name: name.trim(), type, color, icon }
      : {
          name: name.trim(),
          type,
          balance: parseFloat(balance) || 0,
          currency: "KRW",
          color,
          icon,
        };

    try {
      await onSubmit(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">계좌명</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 국민은행 입출금, 신한카드"
        />
        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
      </div>

      {/* Account type selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">계좌 유형</label>
        <div className="grid grid-cols-4 gap-2">
          {TYPE_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleTypeChange(value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors",
                type === value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Initial balance (create mode only) */}
      {!isEditing && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">초기 잔액 (원)</label>
          <Input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="0"
            min="0"
            step="1000"
          />
        </div>
      )}

      {/* Icon picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">아이콘</label>
        <div className="flex gap-2">
          {ICON_OPTIONS.map(({ name: iconName, Component }) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setIcon(iconName)}
              className={cn(
                "flex items-center justify-center rounded-lg border p-2.5 transition-colors",
                icon === iconName
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Component className="h-5 w-5 text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">색상</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => setColor(hex)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform",
                color === hex ? "border-gray-800 scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: hex }}
              aria-label={hex}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          취소
        </Button>
        <Button type="submit" isLoading={saving} loadingText="저장 중...">
          저장
        </Button>
      </div>
    </form>
  );
}
