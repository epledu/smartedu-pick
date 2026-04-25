"use client";

/**
 * NotificationItem
 *
 * Reusable row component for a single notification.
 * Displays type icon, title/body text, relative timestamp,
 * and an unread indicator dot. Clicking marks it as read.
 */
import { AlertTriangle, AlertCircle, Repeat, Target, Lightbulb, Info } from "lucide-react";
import type { AppNotification, NotificationType } from "@/hooks/wallet/use-notifications";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getIcon(type: NotificationType) {
  const base = "w-5 h-5 flex-shrink-0";
  switch (type) {
    case "BUDGET_WARNING":
      return <AlertTriangle className={`${base} text-yellow-500`} />;
    case "BUDGET_EXCEEDED":
      return <AlertCircle className={`${base} text-red-500`} />;
    case "RECURRING_DUE":
      return <Repeat className={`${base} text-blue-500`} />;
    case "GOAL_PROGRESS":
      return <Target className={`${base} text-green-500`} />;
    case "INSIGHT":
      return <Lightbulb className={`${base} text-purple-500`} />;
    default:
      return <Info className={`${base} text-gray-400`} />;
  }
}

/** Format a timestamp as a relative Korean string (e.g. "3분 전"). */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = Math.floor((now - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  /** If true, render in compact mode (for dropdown). */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const { id, type, title, body, isRead, createdAt } = notification;

  function handleClick() {
    if (!isRead) onMarkAsRead(id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`
        flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
        ${isRead ? "bg-white hover:bg-gray-50" : "bg-indigo-50/60 hover:bg-indigo-50"}
        ${compact ? "" : "border-b border-gray-100 last:border-0"}
      `}
    >
      {/* Type icon */}
      <div className="mt-0.5">{getIcon(type)}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isRead ? "font-normal text-gray-700" : "font-semibold text-gray-900"}`}>
          {title}
        </p>
        <p className={`text-xs mt-0.5 ${compact ? "line-clamp-1" : "line-clamp-2"} text-gray-500`}>
          {body}
        </p>
        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(createdAt)}</p>
      </div>

      {/* Actions area */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {/* Unread dot */}
        {!isRead && (
          <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1" aria-label="읽지 않음" />
        )}

        {/* Delete button — shown in full mode */}
        {!compact && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="text-gray-300 hover:text-red-400 transition-colors text-xs mt-1"
            aria-label="삭제"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
