'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ArticleMeta } from '@/lib/articles';
import CategoryFilter from './CategoryFilter';
import ArticleCard from './ArticleCard';

interface ArticleListClientProps {
  articles: ArticleMeta[];
}

function ArticleListInner({ articles }: ArticleListClientProps) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag') || '';
  const [category, setCategory] = useState('all');

  useEffect(() => {
    if (tagParam) setCategory('all');
  }, [tagParam]);

  let filtered = category === 'all'
    ? articles
    : articles.filter((a) => a.category === category);

  if (tagParam) {
    filtered = filtered.filter((a) => a.tags.some((t) => t === tagParam));
  }

  return (
    <>
      {tagParam && (
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            #{tagParam}
          </span>
          <span className="text-sm text-text-secondary">
            태그로 필터 중 ({filtered.length}개)
          </span>
          <a
            href="/articles"
            className="ml-auto text-xs text-text-secondary transition-colors hover:text-primary"
          >
            필터 해제 ×
          </a>
        </div>
      )}

      <CategoryFilter selected={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-text-secondary">해당 조건의 아티클이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  );
}

export default function ArticleListClient({ articles }: ArticleListClientProps) {
  return (
    <Suspense fallback={
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-border" />
        ))}
      </div>
    }>
      <ArticleListInner articles={articles} />
    </Suspense>
  );
}
