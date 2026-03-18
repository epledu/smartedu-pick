'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ArticleMeta } from '@/lib/articles';
import { getCategoryById, categories } from '@/data/categories';

interface ArticleListClientProps {
  articles: ArticleMeta[];
}

/* ── Featured Card (큰 카드) ── */
function FeaturedCard({ article }: { article: ArticleMeta }) {
  const cat = getCategoryById(article.category);
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl md:flex-row"
    >
      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <div className="mb-3 flex items-center gap-2">
          {cat && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {cat.emoji} {cat.label}
            </span>
          )}
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">추천</span>
        </div>
        <h2 className="mb-2 text-xl font-bold leading-snug text-text-primary group-hover:text-primary md:text-2xl">
          {article.title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span>{article.publishedAt.replace(/-/g, '.')}</span>
          <span>{article.readingTime} 읽기</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Small Card ── */
function SmallCard({ article }: { article: ArticleMeta }) {
  const cat = getCategoryById(article.category);
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {cat && (
        <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          {cat.emoji} {cat.label}
        </span>
      )}
      <h3 className="mb-2 text-base font-bold leading-snug text-text-primary group-hover:text-primary">
        {article.title}
      </h3>
      <p className="mb-3 flex-1 text-sm text-text-secondary line-clamp-2">{article.description}</p>
      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <span>{article.publishedAt.replace(/-/g, '.')}</span>
        <span>{article.readingTime} 읽기</span>
      </div>
    </Link>
  );
}

/* ── Category Section ── */
function CategorySection({ catId, emoji, label, articles }: { catId: string; emoji: string; label: string; articles: ArticleMeta[] }) {
  const [expanded, setExpanded] = useState(false);
  const display = expanded ? articles : articles.slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section id={`cat-${catId}`} className="scroll-mt-20">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary md:text-2xl">
          {emoji} {label} <span className="text-base font-normal text-text-secondary">({articles.length})</span>
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((a) => (
          <SmallCard key={a.slug} article={a} />
        ))}
      </div>
      {articles.length > 3 && !expanded && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex h-10 items-center rounded-full border-2 border-border px-5 text-sm font-semibold text-text-secondary transition-all hover:border-primary hover:text-primary"
          >
            더보기 ({articles.length - 3}개) →
          </button>
        </div>
      )}
    </section>
  );
}

/* ── Main Inner ── */
function ArticleListInner({ articles }: ArticleListClientProps) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag') || '';
  const [search, setSearch] = useState('');

  // Featured articles
  const featured = articles.filter((a) => a.featured).slice(0, 2);

  // Tag cloud
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => a.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15);
  }, [articles]);

  // Filter by search & tag
  const filtered = useMemo(() => {
    let result = articles;
    if (tagParam) {
      result = result.filter((a) => a.tags.some((t) => t === tagParam));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [articles, tagParam, search]);

  // Group by category
  const grouped = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      articles: filtered.filter((a) => a.category === cat.id),
    }));
  }, [filtered]);

  const isFiltered = !!tagParam || !!search.trim();

  return (
    <>
      {/* Tag filter banner */}
      {tagParam && (
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">#{tagParam}</span>
          <span className="text-sm text-text-secondary">태그로 필터 중 ({filtered.length}개)</span>
          <a href="/articles" className="ml-auto text-xs text-text-secondary transition-colors hover:text-primary">필터 해제 ×</a>
        </div>
      )}

      {/* Search bar */}
      <div className="mb-8">
        <div className="relative mx-auto max-w-lg">
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="아티클 제목이나 태그로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-surface py-3 pl-12 pr-5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tag cloud */}
      {!isFiltered && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tagCounts.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-surface px-3 py-1 text-text-secondary transition-all hover:bg-primary/10 hover:text-primary"
              style={{ fontSize: count >= 4 ? '14px' : count >= 2 ? '13px' : '12px', fontWeight: count >= 3 ? 600 : 400 }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Featured section */}
      {!isFiltered && featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 text-xl font-bold text-text-primary">
            <span className="text-accent">추천</span> 아티클
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {featured.map((a) => (
              <FeaturedCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Category nav pills */}
      {!isFiltered && (
        <div className="mb-8 flex flex-wrap gap-2">
          {grouped.filter((g) => g.articles.length > 0).map((g) => (
            <a
              key={g.id}
              href={`#cat-${g.id}`}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text-secondary transition-all hover:border-primary hover:text-primary"
            >
              {g.emoji} {g.label} ({g.articles.length})
            </a>
          ))}
        </div>
      )}

      {/* Search results or category sections */}
      {isFiltered ? (
        filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="mb-4 block text-4xl">🔍</span>
            <p className="text-lg text-text-secondary">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <SmallCard key={a.slug} article={a} />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-12">
          {grouped.map((g) => (
            <CategorySection
              key={g.id}
              catId={g.id}
              emoji={g.emoji}
              label={g.label}
              articles={g.articles}
            />
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
