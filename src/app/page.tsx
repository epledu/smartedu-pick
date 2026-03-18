import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { getCategoryById } from '@/data/categories';
import { aiTools, PRICING_STYLE } from '@/data/ai-tools';
import ArticleTabs from '@/components/home/ArticleTabs';

const PICK_TESTS = [
  {
    emoji: '📋',
    title: '나의 학습유형 테스트',
    desc: '나에게 딱 맞는 공부법을 찾아보세요',
    href: '/test/learning-style',
    badge: 'PICK',
    meta: '약 3분 · 12문항',
    participants: '1,234명 참여',
  },
  {
    emoji: '🤖',
    title: 'AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    href: '/test/ai-literacy',
    badge: 'HOT',
    meta: '약 2분 · 10문항',
    participants: '987명 참여',
  },
  {
    emoji: '👶',
    title: '우리 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    href: '/test/child-type',
    badge: '',
    meta: '약 3분 · 10문항',
    participants: '856명 참여',
  },
  {
    emoji: '🧠',
    title: 'AI 공부법 추천',
    desc: 'AI 도구 + 학습법 조합 루틴 찾기',
    href: '/test/ai-study-method',
    badge: 'NEW',
    meta: '약 2분 · 10문항',
    participants: '524명 참여',
  },
  {
    emoji: '💼',
    title: 'AI 시대 직업 적성',
    desc: 'AI 대체 안전도 + 협업 시너지 진단',
    href: '/test/career-ai',
    badge: 'NEW',
    meta: '약 3분 · 12문항',
    participants: '712명 참여',
  },
];

const HOME_TOOLS = aiTools.slice(0, 6);

export default function Home() {
  const allArticles = getAllArticles();
  const articleItems = allArticles.map((article) => {
    const cat = getCategoryById(article.category);
    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      categoryLabel: cat?.label,
      categoryEmoji: cat?.emoji,
    };
  });

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
          <p className="mx-auto mb-8 max-w-lg text-base text-text-secondary md:text-lg">
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

          {/* Stats badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-5">
            {[
              { icon: '📋', label: '테스트 5종' },
              { icon: '📰', label: `아티클 ${allArticles.length}+` },
              { icon: '🤖', label: `AI 도구 ${aiTools.length}+` },
            ].map((stat) => (
              <span
                key={stat.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-text-secondary shadow-sm backdrop-blur-sm"
              >
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </span>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/5" />
      </section>

      {/* Pick Tests Section — 5개 모두 노출, 모바일 가로 스크롤 */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              🎯 오늘의 <span className="text-accent">픽</span>
            </h2>
            <p className="text-text-secondary">인기 테스트로 나에게 맞는 교육을 찾아보세요</p>
          </div>

          {/* 모바일: 가로 스크롤 / 데스크톱: 그리드 */}
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5">
            {PICK_TESTS.map((test) => (
              <Link
                key={test.title}
                href={test.href}
                className="group relative flex w-56 shrink-0 flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg md:w-auto"
              >
                {test.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {test.badge}
                  </span>
                )}
                <span className="mb-3 block text-3xl md:text-4xl">{test.emoji}</span>
                <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">
                  {test.title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-text-secondary">{test.desc}</p>
                <div className="mt-auto">
                  <span className="block text-[11px] text-text-secondary">{test.meta}</span>
                  <span className="block text-[11px] text-text-secondary">{test.participants}</span>
                </div>
                <span className="mt-3 inline-block rounded-full bg-primary px-3 py-1 text-center text-xs font-semibold text-white transition-all group-hover:bg-primary-dark">
                  시작하기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section — 6개 노출 + 무료/유료, 대상 태그 */}
      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              🤖 AI 도구 <span className="text-primary">픽</span>
            </h2>
            <p className="text-text-secondary">현직 전문가가 직접 써보고 추천하는 AI 도구</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_TOOLS.map((tool) => {
              const priceStyle = PRICING_STYLE[tool.pricing];
              return (
                <div
                  key={tool.id}
                  className="rounded-2xl border border-border bg-bg p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{tool.emoji}</span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                      style={{ backgroundColor: priceStyle.bg, color: priceStyle.text }}
                    >
                      {tool.pricing}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {tool.target}
                    </span>
                  </div>
                  <h3 className="mb-1 text-base font-bold text-text-primary">{tool.name}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2">{tool.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/tools"
              className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
            >
              모든 AI 도구 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section — 카테고리 탭 */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              📰 최신 아티클
            </h2>
            <p className="text-text-secondary">교육 AI 트렌드와 활용법</p>
          </div>
          <ArticleTabs articles={articleItems} />
        </div>
      </section>

      {/* Cross-promotion CTA (뉴스레터 대체) */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              이런 콘텐츠도 있어요
            </h2>
            <p className="text-blue-100">
              스마트에듀픽의 다양한 콘텐츠를 만나보세요
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/guide"
              className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <span className="mb-3 block text-3xl">📖</span>
              <h3 className="mb-1 text-base font-bold text-white group-hover:text-accent">
                AI 활용 가이드
              </h3>
              <p className="text-sm text-blue-100">
                입문자·교사·학부모를 위한 단계별 가이드
              </p>
            </Link>
            <Link
              href="/test/ai-literacy"
              className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <span className="mb-3 block text-3xl">🎯</span>
              <h3 className="mb-1 text-base font-bold text-white group-hover:text-accent">
                AI 활용 능력 진단
              </h3>
              <p className="text-sm text-blue-100">
                나의 AI 레벨을 확인하고 맞춤 학습 경로를 받으세요
              </p>
            </Link>
            <Link
              href="/test/career-ai"
              className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <span className="mb-3 block text-3xl">💼</span>
              <h3 className="mb-1 text-base font-bold text-white group-hover:text-accent">
                AI 시대 직업 적성
              </h3>
              <p className="text-sm text-blue-100">
                AI 대체 안전도와 커리어 방향을 확인해보세요
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section — 개선 */}
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
                <span className="text-3xl">🏫</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-primary">200+</h3>
              <p className="text-sm font-medium text-text-primary">학교 AI 교육 지원</p>
              <p className="mt-1 text-xs text-text-secondary">
                전국 200개+ 학교에 AI 교육 솔루션 도입 지원
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary/10 to-accent/10">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-secondary">3년+</h3>
              <p className="text-sm font-medium text-text-primary">AI 코스웨어 개발</p>
              <p className="mt-1 text-xs text-text-secondary">
                맞춤학습 플랫폼 기획·개발 3년+ 경험
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/10 to-primary/10">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-accent">멀티채널</h3>
              <p className="text-sm font-medium text-text-primary">콘텐츠 운영</p>
              <p className="mt-1 text-xs text-text-secondary">
                블로그 · 유튜브에서 AI 교육 콘텐츠 제작
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
