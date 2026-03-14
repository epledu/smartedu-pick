import Link from 'next/link';
import type { ArticleMeta } from '@/lib/articles';
import { getCategoryById } from '@/data/categories';

interface ArticleCardProps {
  article: ArticleMeta;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const category = getCategoryById(article.category);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Category */}
      {category && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {category.emoji} {category.label}
        </span>
      )}

      {/* Title */}
      <h2 className="mb-2 text-lg font-bold leading-snug text-text-primary group-hover:text-primary md:text-xl">
        {article.title}
      </h2>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
        {article.description}
      </p>

      {/* Meta */}
      <div className="mb-3 flex items-center gap-3 text-xs text-text-secondary">
        <span>📅 {article.publishedAt.replace(/-/g, '.')}</span>
        <span>⏱ {article.readingTime} 읽기</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
