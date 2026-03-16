'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { SITE, NAV_ITEMS, FOOTER_LINKS } from '@/lib/constants';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="메뉴 닫기"
      />

      {/* Panel — 명시적 bg-white로 본문 완전 차단 */}
      <div className="absolute right-0 top-0 h-full w-72 animate-slide-in-right bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <span className="text-lg font-bold text-primary">🎯 {SITE.name}</span>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-lg text-text-secondary hover:bg-primary/5"
            aria-label="메뉴 닫기"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Nav items — 터치 타겟 48px+ 보장 */}
        <nav className="flex flex-col overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex min-h-[48px] items-center rounded-lg px-4 py-3 text-base font-medium text-text-primary transition-colors hover:bg-primary/5 hover:text-primary active:bg-primary/10"
            >
              {item.label}
            </Link>
          ))}
          <hr className="my-3 border-border" />
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex min-h-[48px] items-center rounded-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary active:bg-primary/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
