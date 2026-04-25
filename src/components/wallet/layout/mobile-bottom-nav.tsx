"use client";

/**
 * Mobile-only bottom navigation bar.
 *
 * Fixed to the bottom of the viewport on screens smaller than md (768px).
 * Hidden on md+ breakpoints where the sidebar handles navigation.
 * Respects iOS safe-area-inset-bottom for notch/home indicator clearance.
 *
 * Items:
 *  홈       → /
 *  거래      → /transactions
 *  추가 (FAB) → /transactions?new=true
 *  통계      → /statistics
 *  더보기    → opens sidebar drawer
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ArrowLeftRight,
  Plus,
  BarChart3,
  Menu,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MobileBottomNavProps {
  /** Callback to open the sidebar drawer from the "더보기" button */
  onMoreClick: () => void;
}

// ---------------------------------------------------------------------------
// Nav item definitions
// ---------------------------------------------------------------------------

// Kept for documentation purposes — describes the conceptual nav item union
type _NavItem =
  | { kind: "link"; label: string; href: string; icon: React.ReactNode; match: string }
  | { kind: "fab" }
  | { kind: "action"; label: string; icon: React.ReactNode; onClick: () => void };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MobileBottomNav({ onMoreClick }: MobileBottomNavProps) {
  const pathname = usePathname();

  function isActive(match: string) {
    return match === "/wallet" ? pathname === "/wallet" : pathname.startsWith(match);
  }

  const activeClass = "text-indigo-600 dark:text-indigo-400";
  const inactiveClass = "text-gray-400 dark:text-gray-500";

  return (
    <nav
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-30
        bg-white dark:bg-[#2a211c]
        border-t border-gray-200 dark:border-white/10
        flex items-stretch
      "
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="모바일 하단 네비게이션"
    >
      {/* 홈 */}
      <Link
        href="/wallet"
        className={`
          flex-1 flex flex-col items-center justify-center gap-0.5
          py-2 text-[10px] font-medium min-h-[56px]
          ${isActive("/wallet") ? activeClass : inactiveClass}
        `}
        aria-label="홈"
      >
        <Home className="w-5 h-5" />
        <span>홈</span>
      </Link>

      {/* 거래 */}
      <Link
        href="/wallet/transactions"
        className={`
          flex-1 flex flex-col items-center justify-center gap-0.5
          py-2 text-[10px] font-medium min-h-[56px]
          ${isActive("/wallet/transactions") ? activeClass : inactiveClass}
        `}
        aria-label="거래내역"
      >
        <ArrowLeftRight className="w-5 h-5" />
        <span>거래</span>
      </Link>

      {/* 추가 — prominent center FAB */}
      <div className="flex-1 flex items-center justify-center">
        <Link
          href="/wallet/transactions?new=true"
          className="
            flex items-center justify-center
            w-12 h-12 rounded-full
            bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg
            active:scale-95 transition-transform
          "
          aria-label="새 거래 추가"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      {/* 통계 */}
      <Link
        href="/wallet/statistics"
        className={`
          flex-1 flex flex-col items-center justify-center gap-0.5
          py-2 text-[10px] font-medium min-h-[56px]
          ${isActive("/wallet/statistics") ? activeClass : inactiveClass}
        `}
        aria-label="통계"
      >
        <BarChart3 className="w-5 h-5" />
        <span>통계</span>
      </Link>

      {/* 더보기 — opens sidebar drawer */}
      <button
        type="button"
        onClick={onMoreClick}
        className={`
          flex-1 flex flex-col items-center justify-center gap-0.5
          py-2 text-[10px] font-medium min-h-[56px]
          ${inactiveClass}
        `}
        aria-label="전체 메뉴"
      >
        <Menu className="w-5 h-5" />
        <span>더보기</span>
      </button>
    </nav>
  );
}
