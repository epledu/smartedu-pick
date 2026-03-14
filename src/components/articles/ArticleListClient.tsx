'use client';

import { useState } from 'react';
import type { ArticleMeta } from '@/lib/articles';
import CategoryFilter from './CategoryFilter';
import ArticleCard from './ArticleCard';

interface ArticleListClientProps {
  articles: ArticleMeta[];
}

export default function ArticleListClient({ articles }: ArticleListClientProps) {
  const [category, setCategory] = useState('all');

  const filtered =
    category === 'all'
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <>
      <CategoryFilter selected={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-text-secondary">해당 카테고리의 아티클이 없습니다.</p>
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
