'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE, NAV_ITEMS, FOOTER_LINKS } from '@/lib/constants';

export default function Footer() {
  const pathname = usePathname();

  // Wallet section uses its own chrome — skip the marketing footer.
  if (pathname?.startsWith('/wallet')) return null;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-lg font-bold text-primary">
              🎯 {SITE.name}
            </Link>
            <p className="mt-2 text-sm text-text-secondary">{SITE.slogan}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">콘텐츠</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">정보</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">채널</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={SITE.links.blogA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors hover:text-primary"
                >
                  📝 교육AI 블로그
                </a>
              </li>
              <li>
                <a
                  href={SITE.links.blogB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors hover:text-primary"
                >
                  📝 AI활용 블로그
                </a>
              </li>
              <li>
                <a
                  href={SITE.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors hover:text-primary"
                >
                  🎬 유튜브
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 사람 냄새 나는 한 줄 */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="mb-3 text-sm text-text-secondary">
            에듀테크 현직자가 퇴근 후 만드는 사이트입니다 ☕
          </p>
          <p className="text-xs text-text-secondary/60">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
