"use client";

/**
 * NotificationDropdown
 *
 * Dropdown panel showing the most recent 10 notifications.
 * Includes "모두 읽음" button and "전체 보기" link.
 */
import Link from "next/link";
import { Bell } from "lucide-react";
import NotificationItem from "./notification-item";
import type { AppNotification } from "@/hooks/wallet/use-notifications";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NotificationDropdownProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const recent = notifications.slice(0, 10);
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">알림</span>
        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-96 overflow-y-auto">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-sm">새 알림이 없습니다</p>
          </div>
        ) : (
          recent.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={(id) => {
                onMarkAsRead(id);
              }}
              compact
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-2 text-center">
        <Link
          href="/wallet/notifications"
          onClick={onClose}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          전체 보기
        </Link>
      </div>
    </div>
  );
}
