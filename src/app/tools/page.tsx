import type { Metadata } from 'next';
import Link from 'next/link';
import ToolGrid from '@/components/tools/ToolGrid';

export const metadata: Metadata = {
  title: 'AI 도구 추천 | 현직 전문가가 픽한 AI 도구',
  description:
    '교사, 학생, 직장인, 학부모를 위한 AI 도구 추천. 현직 에듀테크 전문가가 직접 써보고 추천합니다.',
  keywords: 'AI도구추천, ChatGPT, Claude, 교육AI, 학습도구, AI교사도구, AI학생도구',
};

export default function ToolsPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-text-primary md:text-4xl">
            🤖 AI 도구 픽
          </h1>
          <p className="text-base text-text-secondary md:text-lg">
            현직 에듀테크 전문가가 직접 써보고 추천하는 AI 도구
          </p>
        </header>

        {/* Tool Grid with Filters */}
        <ToolGrid />

        {/* Related Content */}
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-text-primary">
            🎯 함께 보면 좋은 콘텐츠
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/test/ai-literacy"
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-2 block text-3xl">🤖</span>
              <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">
                나의 AI 활용 레벨은?
              </h3>
              <p className="mb-3 text-sm text-text-secondary">
                10문항으로 알아보는 AI 활용 능력 진단
              </p>
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                테스트 하기 →
              </span>
            </Link>
            <Link
              href="/articles/free-ai-tools-10"
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-2 block text-3xl">📰</span>
              <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">
                무료 AI 도구 10선
              </h3>
              <p className="mb-3 text-sm text-text-secondary">
                돈 한 푼 안 들이고 쓸 수 있는 AI 도구 총정리
              </p>
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                아티클 읽기 →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
