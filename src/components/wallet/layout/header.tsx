"use client";

/**
 * App-wide header component.
 *
 * Left: hamburger menu (mobile) + app title (truncates on narrow screens).
 * Right: theme toggle + notification bell + user avatar dropdown.
 * All interactive targets are 44px+ for touch accessibility.
 */
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, Settings, LogOut, ChevronDown, Menu, Sun, Moon, Monitor, ExternalLink } from "lucide-react";
import type { Session } from "next-auth";
import NotificationBell from "@/components/wallet/notifications/notification-bell";
import { useTheme, type Theme } from "@/components/wallet/providers/theme-provider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HeaderProps {
  user?: Session["user"];
  onMenuClick?: () => void;
}

// ---------------------------------------------------------------------------
// ThemeToggle sub-component
// ---------------------------------------------------------------------------

/** Cycles through light → dark → system on each click. */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const icons: Record<Theme, React.ElementType> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const next: Record<Theme, Theme> = {
    light: "dark",
    dark: "system",
    system: "light",
  };
  const labels: Record<Theme, string> = {
    light: "라이트 모드",
    dark: "다크 모드",
    system: "시스템 설정",
  };

  const Icon = icons[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(next[theme])}
      aria-label={`테마 변경 (현재: ${labels[theme]})`}
      title={labels[theme]}
      className="flex items-center justify-center w-11 h-11 rounded-lg
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 text-gray-600 dark:text-gray-300
                 transition-colors flex-shrink-0"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Avatar sub-component
// ---------------------------------------------------------------------------

function Avatar({ src, name }: { src?: string | null; name?: string | null }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "User"}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export default function Header({ user, onMenuClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking or touching outside
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <header className="h-14 bg-white dark:bg-[#2a211c] border-b border-gray-200 dark:border-white/10 flex items-center px-3 sm:px-4 gap-2 flex-shrink-0">
      {/* Hamburger — 44px tap target */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 flex-shrink-0"
        aria-label="메뉴 열기"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title — truncates gracefully on narrow screens */}
      <span className="font-bold text-gray-900 dark:text-[#F5E6D3] text-sm sm:text-base flex-1 truncate min-w-0">
        📖 지갑일기
      </span>

      {/* Theme toggle button */}
      <ThemeToggle />

      {/* Notification bell */}
      <NotificationBell />

      {/* User dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 min-h-[44px] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="사용자 메뉴"
        >
          <Avatar src={user?.image} name={user?.name} />
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
            {user?.name ?? user?.email ?? "사용자"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-[#2a211c] rounded-xl shadow-lg border border-gray-100 dark:border-white/10 py-1 z-50">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[44px]"
              onClick={() => setOpen(false)}
            >
              <User className="w-4 h-4" />
              프로필
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[44px]"
              onClick={() => setOpen(false)}
            >
              <Settings className="w-4 h-4" />
              설정
            </button>
            <hr className="my-1 border-gray-100 dark:border-white/10" />
            <Link
              href="/"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[44px]"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="w-4 h-4" />
              스마트에듀픽 메인
            </Link>
            <hr className="my-1 border-gray-100 dark:border-white/10" />
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 min-h-[44px]"
              onClick={() => signOut({ callbackUrl: "/wallet/login" })}
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
