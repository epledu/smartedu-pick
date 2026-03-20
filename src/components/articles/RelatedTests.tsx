import Link from 'next/link';

const TEST_MAP: Record<string, { emoji: string; title: string; desc: string; href: string; cta: string }> = {
  'learning-style': {
    emoji: '📋',
    title: '무료 학습유형 테스트',
    desc: '12개 질문으로 알아보는 나만의 공부 스타일',
    href: '/test/learning-style',
    cta: '무료 학습유형 테스트 해보기 →',
  },
  'ai-literacy': {
    emoji: '🤖',
    title: '무료 AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    href: '/test/ai-literacy',
    cta: '무료 AI 레벨 진단 해보기 →',
  },
  'child-type': {
    emoji: '👶',
    title: '무료 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    href: '/test/child-type',
    cta: '무료 아이 성향 분석 해보기 →',
  },
  'ai-study-method': {
    emoji: '🧠',
    title: '무료 AI 공부법 추천',
    desc: 'AI 도구+학습법 조합 나만의 루틴 찾기',
    href: '/test/ai-study-method',
    cta: '무료 AI 공부법 추천받기 →',
  },
  'career-ai': {
    emoji: '💼',
    title: '무료 AI 직업 적성 테스트',
    desc: 'AI 대체 안전도 + 협업 시너지 진단',
    href: '/test/career-ai',
    cta: '무료 AI 직업 적성 진단 →',
  },
};

interface RelatedTestsProps {
  testIds: string[];
  variant?: 'sidebar' | 'inline' | 'bottom';
}

export default function RelatedTests({ testIds, variant = 'bottom' }: RelatedTestsProps) {
  const tests = testIds.map((id) => TEST_MAP[id]).filter(Boolean);
  if (tests.length === 0) return null;

  if (variant === 'sidebar') {
    return (
      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h3 className="mb-3 text-sm font-bold text-text-primary">🎯 관련 테스트</h3>
        <div className="space-y-2">
          {tests.map((test) => (
            <Link
              key={test.href}
              href={test.href}
              className="group flex items-center gap-2 rounded-lg bg-surface p-2.5 text-sm transition-all hover:shadow-sm"
            >
              <span className="text-xl">{test.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-text-primary group-hover:text-primary text-[13px]">
                  {test.title}
                </p>
              </div>
              <span className="text-xs text-primary">→</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
      <h2 className="mb-4 text-xl font-bold text-text-primary">🎯 관련 테스트 추천</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {tests.map((test) => (
          <Link
            key={test.href}
            href={test.href}
            className="group flex items-center gap-4 rounded-xl bg-surface p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">{test.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-text-primary group-hover:text-primary">{test.title}</h3>
              <p className="text-sm text-text-secondary">{test.desc}</p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              무료 테스트 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
