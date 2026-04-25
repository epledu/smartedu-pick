"use client";

/**
 * Dashboard sidebar navigation.
 *
 * Desktop: fixed left panel (lg+).
 * Mobile: slide-in drawer from the left with dimmed overlay backdrop.
 * Closes on route change, overlay click, or close button tap.
 * All tap targets are 44px+ for touch accessibility.
 */
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSWRConfig } from "swr";
import {
  Home,
  ArrowLeftRight,
  CalendarDays,
  Tag,
  PiggyBank,
  BarChart3,
  Coins,
  Target,
  Settings,
  X,
  Wallet,
  Repeat,
  ScanLine,
  Sparkles,
  Train,
  CreditCard,
  Bell,
  FileSpreadsheet,
  Building2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------

/**
 * Maps route hrefs to SWR cache keys prefetched on hover for instant nav.
 */
const PREFETCH_MAP: Record<string, string[]> = {
  "/wallet/transactions": ["/api/transactions"],
  "/wallet/categories": ["/api/categories"],
  "/wallet/accounts": ["/api/accounts"],
  "/wallet/points": ["/api/points"],
};

const NAV_ITEMS = [
  { label: "대시보드", href: "/wallet", icon: Home },
  { label: "거래내역", href: "/wallet/transactions", icon: ArrowLeftRight },
  { label: "캘린더", href: "/wallet/calendar", icon: CalendarDays },
  { label: "고정 지출", href: "/wallet/recurring", icon: Repeat },
  { label: "카테고리", href: "/wallet/categories", icon: Tag },
  { label: "영수증", href: "/wallet/receipts", icon: ScanLine },
  { label: "계좌", href: "/wallet/accounts", icon: Wallet },
  { label: "은행 연동", href: "/wallet/banking", icon: Building2 },
  { label: "예산", href: "/wallet/budgets", icon: PiggyBank },
  { label: "K-패스", href: "/wallet/kpass", icon: Train },
  { label: "통계", href: "/wallet/statistics", icon: BarChart3 },
  { label: "리포트", href: "/wallet/reports", icon: FileSpreadsheet },
  { label: "인사이트", href: "/wallet/insights", icon: Sparkles },
  { label: "결제 추천", href: "/wallet/payment-advisor", icon: CreditCard },
  { label: "포인트", href: "/wallet/points", icon: Coins },
  { label: "목표", href: "/wallet/goals", icon: Target },
  { label: "알림", href: "/wallet/notifications", icon: Bell },
  { label: "설정", href: "/wallet/settings", icon: Settings },
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// ---------------------------------------------------------------------------
// Nav content (shared between desktop and mobile drawer)
// ---------------------------------------------------------------------------

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { mutate } = useSWRConfig();

  // Close drawer on route change (mobile)
  useEffect(() => {
    onClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <nav className="flex flex-col h-full bg-white dark:bg-[#1a1411] border-r border-gray-200 dark:border-white/10 w-64 lg:w-56">
      {/* Brand header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 dark:border-amber-900/30 bg-[#FDF6E3] dark:bg-[#2a211c]">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label="지갑일기">📖</span>
            <span className="font-bold text-amber-900 dark:text-[#D4A574] text-base">지갑일기</span>
          </div>
          <p className="text-[10px] text-amber-700 dark:text-amber-500 pl-7">매일 쓰는 돈 일기</p>
        </div>

        {/* Close button — visible only when onClose is provided (mobile drawer) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-500 dark:text-amber-400"
            aria-label="사이드바 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links — scrollable */}
      <ul className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/wallet" ? pathname === "/wallet" : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                onMouseEnter={() => {
                  // Prefetch API data on hover for instant navigation
                  PREFETCH_MAP[href]?.forEach((key) => mutate(key));
                }}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium
                  min-h-[44px] transition-colors duration-100
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Version footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10">
        <p className="text-[10px] text-gray-300 dark:text-gray-600 text-center">v1.0.0</p>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile: slide-in drawer with animated transform */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden
          transition-all duration-300
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
        aria-hidden={!open}
      >
        {/* Dimmed overlay backdrop */}
        <div
          className={`
            absolute inset-0 bg-black transition-opacity duration-300
            ${open ? "opacity-50" : "opacity-0"}
          `}
          onClick={onClose}
        />

        {/* Drawer panel — slides in from left */}
        <div
          className={`
            relative z-50 h-full shadow-xl
            transition-transform duration-300 ease-out
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent onClose={onClose} />
        </div>
      </div>
    </>
  );
}
