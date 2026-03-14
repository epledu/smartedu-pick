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
          <p className="text-base text-text-secondary md:text-lg">
            AI 교육 트렌드와 활용법, 학습 가이드를 만나보세요.
          </p>
        </div>

        {/* Article List with Category Filter */}
        <ArticleListClient articles={articles} />
      </div>
    </div>
  );
}
