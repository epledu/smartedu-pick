"use client";

/**
 * /notifications page
 *
 * Full notifications list with type filter, mark-all-read button,
 * and per-item delete. Triggers notification generation on load.
 */
import { useState, useEffect } from "react";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/wallet/use-notifications";
import NotificationItem from "@/components/wallet/notifications/notification-item";
import type { NotificationType } from "@/hooks/wallet/use-notifications";

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

const FILTER_OPTIONS: { label: string; value: "ALL" | NotificationType }[] = [
  { label: "전체", value: "ALL" },
  { label: "예산 경고", value: "BUDGET_WARNING" },
  { label: "예산 초과", value: "BUDGET_EXCEEDED" },
  { label: "고정 지출", value: "RECURRING_DUE" },
  { label: "목표 달성", value: "GOAL_PROGRESS" },
  { label: "인사이트", value: "INSIGHT" },
  { label: "시스템", value: "SYSTEM" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"ALL" | NotificationType>("ALL");
  const [generating, setGenerating] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications({ pollEnabled: false });

  // Generate notifications once on page mount, then refresh
  useEffect(() => {
    async function generateAndRefresh() {
      setGenerating(true);
      try {
        await fetch("/api/notifications/generate", { method: "POST" });
        await refresh();
      } finally {
        setGenerating(false);
      }
    }
    generateAndRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  async function handleDeleteAll() {
    if (!confirm("모든 알림을 삭제하시겠습니까?")) return;
    await Promise.all(notifications.map((n) => deleteNotification(n.id)));
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">읽지 않은 알림 {unreadCount}개</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              모두 읽음
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${
                filter === opt.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading || generating ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">
          알림을 불러오는 중...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Bell className="w-10 h-10 opacity-30" />
          <p className="text-sm">
            {filter === "ALL" ? "알림이 없습니다." : "해당 유형의 알림이 없습니다."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
