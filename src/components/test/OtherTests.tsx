import Link from 'next/link';

type TestId = 'learning-style' | 'ai-literacy' | 'child-type' | 'ai-study-method' | 'career-ai';

interface OtherTestsProps {
  currentTest?: TestId;
}

const ALL_TESTS: {
  id: TestId;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  participants: string;
}[] = [
  {
    id: 'learning-style',
    emoji: '📋',
    title: '나의 학습유형 테스트',
    desc: '12개 질문으로 알아보는 나만의 공부 스타일',
    href: '/test/learning-style',
    participants: '1,234명 참여',
  },
  {
    id: 'ai-literacy',
    emoji: '🤖',
    title: 'AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    href: '/test/ai-literacy',
    participants: '987명 참여',
  },
  {
    id: 'child-type',
    emoji: '👶',
    title: '우리 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    href: '/test/child-type',
    participants: '856명 참여',
  },
  {
    id: 'ai-study-method',
    emoji: '🧠',
    title: 'AI 공부법 추천',
    desc: 'AI 도구+학습법 조합 나만의 루틴 찾기',
    href: '/test/ai-study-method',
    participants: '524명 참여',
  },
  {
    id: 'career-ai',
    emoji: '💼',
    title: 'AI 시대 직업 적성',
    desc: 'AI 대체 안전도 + 협업 시너지 진단',
    href: '/test/career-ai',
    participants: '712명 참여',
  },
];

export default function OtherTests({ currentTest }: OtherTestsProps) {
  const tests = ALL_TESTS.filter((t) => t.id !== currentTest);

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">🎯 다른 테스트도 해보세요</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tests.map((test) => (
          <Link
            key={test.id}
            href={test.href}
            className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <span className="mb-2 block text-3xl">{test.emoji}</span>
            <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">
              {test.title}
            </h3>
            <p className="mb-2 text-sm text-text-secondary">{test.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-secondary">{test.participants}</span>
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                테스트 시작 →
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/test"
          className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          모든 테스트 보기 →
        </Link>
      </div>
    </section>
  );
}
