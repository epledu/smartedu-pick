'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE, NAV_ITEMS } from '@/lib/constants';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Wallet section renders its own dashboard chrome (sidebar + header).
  if (pathname?.startsWith('/wallet')) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <span className="text-2xl">🎯</span>
            <span>{SITE.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <span className="mx-2 h-5 w-px bg-border" />
            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-primary"
            >
              소개
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-primary"
            >
              문의
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary/5 md:hidden"
            aria-label="메뉴 열기"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu — header 밖에서 렌더링하여 stacking context 문제 방지 */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
