'use client';

import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTOCProps {
  headings: Heading[];
}

export default function ArticleTOC({ headings }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC - collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary"
        >
          <span>📑 목차</span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <nav className="mb-6 rounded-xl border border-border bg-surface p-4">
            <ul className="space-y-2">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block text-sm transition-colors hover:text-primary ${
                      level === 3 ? 'pl-4' : ''
                    } ${activeId === id ? 'font-semibold text-primary' : 'text-text-secondary'}`}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop TOC - sticky sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <h3 className="mb-3 text-sm font-bold text-text-primary">📑 목차</h3>
          <nav className="border-l-2 border-border">
            <ul className="space-y-1.5">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={`block border-l-2 -ml-0.5 py-1 text-[13px] transition-all hover:text-primary ${
                      level === 3 ? 'pl-6' : 'pl-3'
                    } ${
                      activeId === id
                        ? 'border-primary font-semibold text-primary'
                        : 'border-transparent text-text-secondary'
                    }`}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
