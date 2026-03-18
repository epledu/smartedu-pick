'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ArticleItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  categoryLabel?: string;
  categoryEmoji?: string;
}

const TABS = [
  { id: 'all', label: '전체' },
  { id: 'ai-education', label: '교육AI' },
  { id: 'study-tips', label: '학습법' },
  { id: 'ai-tools', label: 'AI도구' },
];

export default function ArticleTabs({ articles }: { articles: ArticleItem[] }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered =
    activeTab === 'all'
      ? articles.slice(0, 6)
      : articles.filter((a) => a.category === activeTab).slice(0, 3);

  const display = filtered.length > 0 ? filtered : articles.slice(0, 3);

  return (
    <>
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-text-secondary hover:bg-primary/5 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            {article.categoryLabel && (
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {article.categoryEmoji} {article.categoryLabel}
              </span>
            )}
            <h3 className="mb-2 text-base font-bold leading-snug text-text-primary group-hover:text-primary">
              {article.title}
            </h3>
            <p className="mb-3 text-sm text-text-secondary line-clamp-2">
              {article.description}
            </p>
            <span className="text-xs text-text-secondary">
              {article.publishedAt.replace(/-/g, '.')} · {article.readingTime} 읽기
            </span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/articles"
          className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          모든 아티클 보기 →
        </Link>
      </div>
    </>
  );
}
