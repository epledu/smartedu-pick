import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import ArticleListClient from '@/components/articles/ArticleListClient';

export const metadata: Metadata = {
  title: '아티클',
  description:
    'AI 교육 트렌드, 학습법 가이드, AI 도구 활용법 등 유용한 아티클을 제공합니다.',
  keywords: 'AI교육, 학습법, AI도구, 에듀테크, 교육트렌드',
  openGraph: {
    title: '아티클 | 스마트에듀픽',
    description:
      'AI 교육 트렌드, 학습법 가이드, AI 도구 활용법 등 유용한 아티클을 제공합니다.',
    url: 'https://smartedu-pick.com/articles',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-text-primary md:text-4xl">
            📰 아티클
          </h1>
          <p className="mb-2 text-base text-text-secondary md:text-lg">
            AI 교육 트렌드와 활용법, 학습 가이드를 만나보세요.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-text-secondary">
            <span>총 {articles.length}개의 아티클</span>
            <span className="h-4 w-px bg-border" />
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">최신순</span>
          </div>
        </div>

        {/* Article List with Category Filter */}
        <ArticleListClient articles={articles} />
      </div>
    </div>
  );
}
