'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProfileResults, getCompletedCount } from '@/lib/profile-generator';

export default function ProfileCTA() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const results = getAllProfileResults();
    setCount(getCompletedCount(results));
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="p-6 text-center md:p-8">
        <h3 className="mb-2 text-lg font-bold text-text-primary">
          🎯 나의 AI 학습 프로필 만들기
        </h3>
        <p className="mb-4 text-sm text-text-secondary">
          지금까지 <strong className="text-primary">{count}/5</strong> 테스트를 완료했어요!
          {count >= 3 ? ' 종합 프로필을 확인해보세요.' : ' 3개 이상 완료하면 프로필이 생성됩니다.'}
        </p>

        {/* Mini progress bar */}
        <div className="mx-auto mb-5 h-2 w-48 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${(count / 5) * 100}%` }}
          />
        </div>

        <Link
          href="/test/my-profile"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95"
        >
          {count >= 3 ? '내 프로필 보기 →' : '프로필 완성하러 가기 →'}
        </Link>
      </div>
    </section>
  );
}
