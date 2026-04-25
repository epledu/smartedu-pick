"use client";

/**
 * Toast notification UI component.
 * Rendered by ToastProvider; not used directly by consumers.
 */
import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/wallet/utils";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  /** Auto-dismiss delay in ms. Default 4000. */
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 shrink-0" />,
  info: <Info className="w-4 h-4 shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const ICON_STYLES: Record<ToastType, string> = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
};

/** Individual toast item with enter/exit animation */
export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const delay = toast.duration ?? 4000;
    const exitTimer = setTimeout(() => setExiting(true), delay - 200);
    const removeTimer = setTimeout(() => onDismiss(toast.id), delay);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 min-w-[280px] max-w-sm",
        "rounded-xl border px-4 py-3 shadow-md",
        STYLES[toast.type],
        exiting ? "toast-exit" : "toast-enter"
      )}
    >
      <span className={cn("mt-0.5", ICON_STYLES[toast.type])}>
        {ICONS[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => { setExiting(true); setTimeout(() => onDismiss(toast.id), 200); }}
        className="mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="알림 닫기"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
