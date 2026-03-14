import Link from 'next/link';

interface OtherTestsProps {
  currentTest?: 'learning-style' | 'ai-literacy';
}

const ALL_TESTS = [
  {
    id: 'learning-style',
    emoji: '📋',
    title: '나의 학습유형 테스트',
    desc: '12개 질문으로 알아보는 나만의 공부 스타일',
    href: '/test/learning-style',
    active: true,
  },
  {
    id: 'ai-literacy',
    emoji: '🤖',
    title: 'AI 활용 능력 진단',
    desc: '당신의 AI 레벨은? Lv.1~Lv.5',
    href: '/test/ai-literacy',
    active: true,
  },
  {
    id: 'child-learning',
    emoji: '👶',
    title: '우리 아이 학습 성향 분석',
    desc: '아이에게 맞는 교육법을 알아보세요',
    href: '#',
    active: false,
  },
];

export default function OtherTests({ currentTest }: OtherTestsProps) {
  const tests = ALL_TESTS.filter((t) => t.id !== currentTest);

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">🎯 다른 테스트도 해보세요</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tests.map((test) =>
          test.active ? (
            <Link
              key={test.title}
              href={test.href}
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-2 block text-3xl">{test.emoji}</span>
              <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">{test.title}</h3>
              <p className="mb-3 text-sm text-text-secondary">{test.desc}</p>
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                테스트 시작 →
              </span>
            </Link>
          ) : (
            <div
              key={test.title}
              className="rounded-2xl border border-border bg-surface p-5 opacity-70"
            >
              <span className="mb-2 block text-3xl">{test.emoji}</span>
              <h3 className="mb-1 text-base font-bold text-text-primary">{test.title}</h3>
              <p className="mb-3 text-sm text-text-secondary">{test.desc}</p>
              <span className="inline-block rounded-full bg-bg px-3 py-1 text-xs font-medium text-text-secondary">
                곧 공개 예정
              </span>
            </div>
          )
        )}
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
