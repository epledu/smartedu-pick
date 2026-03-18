import Link from 'next/link';

const SUGGESTIONS = [
  {
    emoji: '🎯',
    title: '인기 테스트 해보기',
    desc: '학습유형, AI 레벨 등 5가지 테스트',
    href: '/test',
  },
  {
    emoji: '📰',
    title: '최신 아티클 읽기',
    desc: 'AI 교육 트렌드와 활용법',
    href: '/articles',
  },
  {
    emoji: '🤖',
    title: 'AI 도구 추천 보기',
    desc: '전문가가 직접 써보고 추천하는 도구',
    href: '/tools',
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center py-16 md:py-24">
      <div className="mx-auto max-w-lg px-4 text-center">
        <span className="mb-6 block text-7xl">🔍</span>
        <h1 className="mb-3 text-3xl font-extrabold text-text-primary md:text-4xl">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mb-10 text-base text-text-secondary">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {SUGGESTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-2 block text-3xl">{item.emoji}</span>
              <h2 className="mb-1 text-sm font-bold text-text-primary group-hover:text-primary">
                {item.title}
              </h2>
              <p className="text-xs text-text-secondary">{item.desc}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-95"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
