import Link from 'next/link';
import type { ArticleMeta } from '@/lib/articles';
import { getCategoryById } from '@/data/categories';

interface RelatedArticlesProps {
  articles: ArticleMeta[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">📰 관련 아티클</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {articles.slice(0, 3).map((article) => {
          const cat = getCategoryById(article.category);
          return (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {cat && (
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {cat.emoji} {cat.label}
                </span>
              )}
              <h3 className="mb-2 text-base font-bold leading-snug text-text-primary group-hover:text-primary line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-text-secondary">
                📅 {article.publishedAt.replace(/-/g, '.')} · ⏱ {article.readingTime}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
