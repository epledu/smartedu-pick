"use client";

/**
 * ConnectionCard component.
 *
 * Displays a single CODEF-connected bank/card account with:
 *  - Organization logo tile (color from CODEF org list)
 *  - Account name and last sync timestamp
 *  - "지금 동기화" button
 *  - Disconnect button
 */

import { RefreshCw, Trash2, Loader2 } from "lucide-react";
import { findOrganization } from "@/lib/wallet/codef/organizations";
import type { ConnectedAccount } from "@/hooks/wallet/use-banking";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ConnectionCardProps {
  account: ConnectedAccount;
  lastSyncedAt?: string | null;
  onSync: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
  syncLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSyncTime(isoString: string | null | undefined): string {
  if (!isoString) return "동기화 기록 없음";
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}시간 전`;
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConnectionCard({
  account,
  lastSyncedAt,
  onSync,
  onDisconnect,
  syncLoading = false,
}: ConnectionCardProps) {
  // icon field stores the CODEF org code when connected via CODEF
  const orgCode = account.icon ?? "";
  const org = findOrganization(orgCode);

  // Fall back to first two characters of the account name as avatar text
  const avatarText = org ? org.name.slice(0, 2) : orgCode.slice(0, 2) || "?";
  const avatarColor = org?.color ?? "#6b7280";

  // Strip the "[연동] " prefix for a cleaner display name
  const displayName = account.name.replace(/^\[연동\]\s*/, "");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      {/* Organization logo tile */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: avatarColor }}
      >
        {avatarText}
      </div>

      {/* Account info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          마지막 동기화: {formatSyncTime(lastSyncedAt)}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => onSync(account.id)}
          disabled={syncLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          title="지금 동기화"
        >
          {syncLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">동기화</span>
        </button>

        <button
          type="button"
          onClick={() => onDisconnect(account.id)}
          disabled={syncLoading}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="연동 해제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
