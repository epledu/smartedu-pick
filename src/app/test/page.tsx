import type { Metadata } from 'next';
import Link from 'next/link';
import TestCountBadge from '@/components/test/TestCountBadge';
import ProfileCTA from '@/components/test/ProfileCTA';

export const metadata: Metadata = {
  title: '무료 학습유형·AI 테스트 모음 | 나에게 맞는 교육 찾기',
  description: '학습유형 테스트, AI 활용 능력 진단, 아이 학습 성향 분석 등 5가지 무료 테스트로 나에게 딱 맞는 교육을 찾아보세요.',
  keywords: '무료학습유형테스트, AI활용능력진단, 학습성향분석, 교육테스트, 무료테스트',
  openGraph: {
    title: '무료 학습유형·AI 테스트 모음 | 나에게 맞는 교육 찾기 - 스마트에듀픽',
    description: '학습유형 테스트, AI 활용 능력 진단, 아이 학습 성향 분석 등 5가지 무료 테스트로 나에게 딱 맞는 교육을 찾아보세요.',
    url: 'https://smartedu-pick.com/test',
  },
};

const TESTS = [
  {
    emoji: '📋',
    title: '나의 학습유형 테스트',
    desc: '12개 질문으로 알아보는 나만의 공부 스타일',
    duration: '약 3분',
    testId: 'learning-style',
    href: '/test/learning-style',
    active: true,
    badge: 'PICK',
  },
  {
    emoji: '🤖',
    title: 'AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    duration: '약 2분',
    testId: 'ai-literacy',
    href: '/test/ai-literacy',
    active: true,
    badge: 'HOT',
  },
  {
    emoji: '👶',
    title: '우리 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    duration: '약 3분',
    testId: 'child-type',
    href: '/test/child-type',
    active: true,
    badge: '',
  },
  {
    emoji: '🧠',
    title: '나에게 맞는 AI 공부법 추천',
    desc: 'AI 도구 + 학습법 조합으로 나만의 학습 루틴 찾기',
    duration: '약 2분',
    testId: 'ai-study-method',
    href: '/test/ai-study-method',
    active: true,
    badge: '',
  },
  {
    emoji: '💼',
    title: 'AI 시대 직업 적성 테스트',
    desc: 'AI 시대, 나에게 맞는 커리어 방향은? AI 대체 안전도 확인',
    duration: '약 3분',
    testId: 'career-ai',
    href: '/test/career-ai',
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

        {/* Profile Banner */}
        <div className="mb-8">
          <ProfileCTA />
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
                      <TestCountBadge testId={test.testId} duration={test.duration} />
                      <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-all group-hover:bg-primary-dark">
                        무료 테스트 시작하기 →
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
