import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '교육 테스트',
  description: '학습유형 테스트, AI 활용 능력 진단 등 나에게 맞는 교육을 찾아보세요.',
  keywords: '학습유형테스트, AI활용능력진단, 학습성향분석, 교육테스트',
  openGraph: {
    title: '교육 테스트 | 스마트에듀픽',
    description: '학습유형 테스트, AI 활용 능력 진단 등 나에게 맞는 교육을 찾아보세요.',
    url: 'https://smartedu-pick.com/test',
  },
};

const TESTS = [
  {
    emoji: '📋',
    title: '나의 학습유형 테스트',
    desc: '12개 질문으로 알아보는 나만의 공부 스타일',
    meta: '약 3분 | 참여자 1,234명',
    href: '/test/learning-style',
    active: true,
    badge: 'PICK',
  },
  {
    emoji: '🤖',
    title: 'AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    meta: '약 2분 | 참여자 987명',
    href: '/test/ai-literacy',
    active: true,
    badge: 'HOT',
  },
  {
    emoji: '👶',
    title: '우리 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    meta: '약 3분 | 참여자 856명',
    href: '/test/child-type',
    active: true,
    badge: 'NEW',
  },
];

export default function TestPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-extrabold text-text-primary md:text-4xl">
            나에게 딱 맞는 교육을 찾아보세요
          </h1>
          <p className="text-base text-text-secondary md:text-lg">
            스마트에듀픽의 테스트로 나만의 학습 스타일을 발견하세요.
          </p>
        </div>

        {/* Test Cards */}
        <div className="space-y-4">
          {TESTS.map((test) =>
            test.active ? (
              <Link
                key={test.title}
                href={test.href}
                className="group relative block rounded-2xl border-2 border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg md:p-8"
              >
                {test.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white md:right-6 md:top-6">
                    {test.badge}
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <span className="block text-4xl md:text-5xl">{test.emoji}</span>
                  <div className="flex-1">
                    <h2 className="mb-1 text-lg font-bold text-text-primary group-hover:text-primary md:text-xl">
                      {test.title}
                    </h2>
                    <p className="mb-3 text-sm text-text-secondary md:text-base">{test.desc}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-text-secondary">{test.meta}</span>
                      <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-all group-hover:bg-primary-dark">
                        테스트 시작하기 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={test.title}
                className="relative rounded-2xl border-2 border-dashed border-border bg-surface/50 p-6 opacity-60 md:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="block text-4xl md:text-5xl">{test.emoji}</span>
                  <div className="flex-1">
                    <h2 className="mb-1 text-lg font-bold text-text-primary md:text-xl">
                      {test.title}
                    </h2>
                    <p className="mb-3 text-sm text-text-secondary md:text-base">{test.desc}</p>
                    <span className="inline-block rounded-full bg-bg px-4 py-1.5 text-xs font-medium text-text-secondary">
                      곧 공개 예정
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
