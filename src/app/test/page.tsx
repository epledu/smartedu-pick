import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '테스트',
  description: '학습유형 테스트, AI 활용 능력 진단 등 다양한 교육 테스트를 만나보세요.',
};

export default function TestPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <span className="mb-4 block text-5xl">📋</span>
        <h1 className="mb-4 text-3xl font-extrabold text-text-primary">테스트</h1>
        <p className="mb-2 text-lg text-text-secondary">
          다양한 학습유형·성향 진단 테스트를 준비하고 있습니다.
        </p>
        <p className="mb-8 text-text-secondary">곧 만나보실 수 있어요!</p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
