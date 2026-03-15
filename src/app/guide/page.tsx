import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI 활용 가이드 | 입문부터 전문가까지 - 스마트에듀픽',
  description:
    'AI 입문자, 교사, 학부모를 위한 단계별 AI 활용 가이드. 내 레벨에 맞는 학습 경로를 찾아보세요.',
  keywords: 'AI활용가이드, AI입문, 교사AI활용, 학부모AI교육, AI학습로드맵',
};

interface GuideStep {
  step: number;
  label: string;
}

interface GuideCard {
  emoji: string;
  title: string;
  target: string;
  targetColor: string;
  targetBg: string;
  steps: GuideStep[];
  articleLink: string;
  articleLinks?: { label: string; href: string }[];
  testLabel: string;
  testLink: string;
}

const guides: GuideCard[] = [
  {
    emoji: '🌱',
    title: 'AI 입문자를 위한 시작 가이드',
    target: '입문자',
    targetColor: 'text-emerald-700',
    targetBg: 'bg-emerald-50',
    steps: [
      { step: 1, label: 'AI란 무엇인가' },
      { step: 2, label: 'ChatGPT 가입 방법' },
      { step: 3, label: '첫 대화 해보기' },
      { step: 4, label: '자주 하는 실수' },
    ],
    articleLink: '/articles/chatgpt-beginner-guide-2026',
    testLabel: '내 AI 레벨 확인하기',
    testLink: '/test/ai-literacy',
  },
  {
    emoji: '🌳',
    title: '교사를 위한 AI 수업 활용 가이드',
    target: '교사',
    targetColor: 'text-blue-700',
    targetBg: 'bg-blue-50',
    steps: [
      { step: 1, label: 'AI 코스웨어 이해' },
      { step: 2, label: '수업에 AI 도구 활용' },
      { step: 3, label: '평가에 AI 활용' },
      { step: 4, label: '주의사항' },
    ],
    articleLink: '/articles/ai-courseware-guide',
    articleLinks: [
      { label: 'AI 코스웨어 가이드', href: '/articles/ai-courseware-guide' },
      { label: '교사 AI 도구 5선', href: '/articles/teacher-ai-tools-5' },
    ],
    testLabel: '학습유형 테스트',
    testLink: '/test/learning-style',
  },
  {
    emoji: '👨‍👩‍👧',
    title: '학부모를 위한 AI 교육 가이드',
    target: '학부모',
    targetColor: 'text-amber-700',
    targetBg: 'bg-amber-50',
    steps: [
      { step: 1, label: 'AI 시대 교육 변화' },
      { step: 2, label: '아이 성향에 맞는 교육법' },
      { step: 3, label: '추천 AI 도구' },
      { step: 4, label: '부모의 역할' },
    ],
    articleLink: '/articles/ai-era-child-education',
    articleLinks: [
      { label: 'AI 시대 자녀 교육', href: '/articles/ai-era-child-education' },
      {
        label: '아이 학습유형별 교육법',
        href: '/articles/child-learning-type-education',
      },
    ],
    testLabel: '우리 아이 학습 성향',
    testLink: '/test/child-type',
  },
];

export default function GuidePage() {
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-text-primary md:text-4xl">
            📖 AI 활용 가이드
          </h1>
          <p className="text-base text-text-secondary md:text-lg">
            AI 입문부터 전문가까지, 단계별로 안내합니다
          </p>
        </header>

        {/* Guide Cards */}
        <div className="flex flex-col gap-8">
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:shadow-lg"
            >
              <div className="p-6 md:p-8">
                {/* Top: emoji + tag + title */}
                <div className="mb-5 flex items-start gap-4">
                  <span className="text-4xl">{guide.emoji}</span>
                  <div>
                    <span
                      className={`mb-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${guide.targetBg} ${guide.targetColor}`}
                    >
                      {guide.target} 대상
                    </span>
                    <h2 className="text-xl font-bold text-text-primary md:text-2xl">
                      {guide.title}
                    </h2>
                  </div>
                </div>

                {/* Step Roadmap */}
                <div className="mb-6 rounded-xl bg-bg p-4 md:p-5">
                  <p className="mb-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    학습 로드맵
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
                    {guide.steps.map((s, i) => (
                      <div key={s.step} className="flex items-center sm:flex-1">
                        <div className="flex items-center gap-2 sm:flex-col sm:gap-1 sm:text-center">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                            {s.step}
                          </span>
                          <span className="text-sm font-medium text-text-primary">
                            {s.label}
                          </span>
                        </div>
                        {i < guide.steps.length - 1 && (
                          <span className="mx-2 hidden text-text-secondary sm:block">
                            →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  {guide.articleLinks ? (
                    guide.articleLinks.map((al) => (
                      <Link
                        key={al.href}
                        href={al.href}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                      >
                        {al.label} 보기 →
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={guide.articleLink}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                    >
                      가이드 보기 →
                    </Link>
                  )}
                  <Link
                    href={guide.testLink}
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-primary px-5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                  >
                    {guide.testLabel} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <section className="mt-14 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 p-8 text-center md:p-10">
          <h2 className="mb-2 text-xl font-bold text-text-primary md:text-2xl">
            어디서부터 시작할지 모르겠다면?
          </h2>
          <p className="mb-6 text-text-secondary">
            AI 활용 능력 진단으로 내 레벨을 먼저 확인하세요
          </p>
          <Link
            href="/test/ai-literacy"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            🤖 AI 레벨 진단하기 →
          </Link>
        </section>
      </div>
    </div>
  );
}
