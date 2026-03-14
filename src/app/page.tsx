import Link from 'next/link';
import CTASection from '@/components/home/CTASection';
import { getAllArticles } from '@/lib/articles';
import { getCategoryById } from '@/data/categories';

const PICK_TESTS = [
  {
    emoji: '📋',
    title: '나의 학습유형 테스트',
    desc: '나에게 딱 맞는 공부법을 찾아보세요',
    href: '/test/learning-style',
    badge: 'PICK',
  },
  {
    emoji: '🤖',
    title: 'AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    href: '/test/ai-literacy',
    badge: 'HOT',
  },
  {
    emoji: '👶',
    title: '우리 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    href: '/test/child-type',
    badge: 'NEW',
  },
];

const AI_TOOLS = [
  {
    emoji: '✍️',
    title: '뤼튼 (Wrtn)',
    desc: '한국어 특화 AI 글쓰기 도구',
    category: '글쓰기',
  },
  {
    emoji: '🎨',
    title: '캔바 AI',
    desc: 'AI로 교육 자료 디자인 자동 제작',
    category: '디자인',
  },
  {
    emoji: '📊',
    title: '감마 (Gamma)',
    desc: 'AI 프레젠테이션 자동 생성 도구',
    category: '발표자료',
  },
];

export default function Home() {
  const articles = getAllArticles().slice(0, 3);
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-bg to-secondary/5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-4 text-sm font-semibold tracking-wide text-secondary">
            현직 에듀테크 전문가가 만드는 AI 교육 정보 플랫폼
          </p>
          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-text-primary md:text-5xl">
            AI가 골라주는
            <br />
            <span className="text-primary">나에게 딱 맞는 교육</span>
          </h1>
          <p className="mx-auto mb-10 max-w-lg text-base text-text-secondary md:text-lg">
            학습유형 테스트, AI 도구 추천, 교육 AI 가이드까지.
            <br />
            당신에게 딱 맞는 교육을 <strong className="text-accent">픽</strong>해드립니다.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/test"
              className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
            >
              내 유형 알아보기 →
            </Link>
            <Link
              href="/tools"
              className="inline-flex h-12 items-center rounded-full border-2 border-secondary px-8 text-base font-semibold text-secondary transition-all hover:bg-secondary hover:text-white"
            >
              AI 도구 추천받기 →
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/5" />
      </section>

      {/* Pick Tests Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              🎯 오늘의 <span className="text-accent">픽</span>
            </h2>
            <p className="text-text-secondary">인기 테스트로 나에게 맞는 교육을 찾아보세요</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PICK_TESTS.map((test) => (
              <Link
                key={test.title}
                href={test.href}
                className="group relative rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {test.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    {test.badge}
                  </span>
                )}
                <span className="mb-4 block text-4xl">{test.emoji}</span>
                <h3 className="mb-2 text-lg font-bold text-text-primary group-hover:text-primary">
                  {test.title}
                </h3>
                <p className="text-sm text-text-secondary">{test.desc}</p>
                <span className="mt-4 inline-block text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  테스트 시작하기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              🤖 AI 도구 <span className="text-primary">픽</span>
            </h2>
            <p className="text-text-secondary">이번 달 가장 인기 있는 AI 교육 도구</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AI_TOOLS.map((tool) => (
              <div
                key={tool.title}
                className="rounded-2xl border border-border bg-bg p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{tool.emoji}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {tool.category}
                  </span>
                </div>
                <h3 className="mb-1 text-lg font-bold text-text-primary">{tool.title}</h3>
                <p className="text-sm text-text-secondary">{tool.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary-dark"
            >
              더 많은 AI 도구 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              📰 최신 아티클
            </h2>
            <p className="text-text-secondary">교육 AI 트렌드와 활용법</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const cat = getCategoryById(article.category);
              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {cat && (
                    <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {cat.emoji} {cat.label}
                    </span>
                  )}
                  <h3 className="mb-2 text-base font-bold leading-snug text-text-primary group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mb-3 text-sm text-text-secondary line-clamp-2">
                    {article.description}
                  </p>
                  <span className="text-xs text-text-secondary">
                    📅 {article.publishedAt.replace(/-/g, '.')} · ⏱ {article.readingTime} 읽기
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary-dark"
            >
              모든 아티클 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Trust Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-text-primary md:text-3xl">
            현직 에듀테크 전문가가 만듭니다
          </h2>
          <p className="mb-10 text-text-secondary">
            현장 경험을 바탕으로 진짜 도움이 되는 교육 AI 정보를 제공합니다.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <span className="mb-3 block text-3xl">🏫</span>
              <h3 className="mb-1 text-lg font-bold text-text-primary">200+ 학교</h3>
              <p className="text-sm text-text-secondary">AI 교육 솔루션 도입 지원</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <span className="mb-3 block text-3xl">🧠</span>
              <h3 className="mb-1 text-lg font-bold text-text-primary">AI 코스웨어</h3>
              <p className="text-sm text-text-secondary">맞춤학습 플랫폼 개발 경험</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <span className="mb-3 block text-3xl">📝</span>
              <h3 className="mb-1 text-lg font-bold text-text-primary">콘텐츠 채널</h3>
              <p className="text-sm text-text-secondary">블로그 · 유튜브 운영</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
