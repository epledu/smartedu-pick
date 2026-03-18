'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { learningTypes } from '@/data/tests/learning-style';
import type { LearningType } from '@/data/tests/learning-style';
import { getScorePercentages } from '@/lib/test-utils';
import ResultCard from '@/components/test/ResultCard';
import ResultDetail from '@/components/test/ResultDetail';
import ShareSection from '@/components/test/ShareSection';
import ResultImageGenerator from '@/components/test/ResultImageGenerator';
import OtherTests from '@/components/test/OtherTests';
import AdSlot from '@/components/common/AdSlot';

const TYPE_ORDER: LearningType[] = ['visual', 'auditory', 'kinesthetic', 'analytical'];

function ResultContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') || 'visual') as LearningType;
  const answersParam = searchParams.get('answers') || '';

  const typeInfo = learningTypes[type] || learningTypes.visual;

  // Calculate percentages from actual answers if available
  let percentages: Record<LearningType, number>;
  if (answersParam) {
    const answers = answersParam.split(',') as LearningType[];
    percentages = getScorePercentages(answers);
  } else {
    // Fallback: highlight the selected type
    percentages = { visual: 0, auditory: 0, kinesthetic: 0, analytical: 0 };
    percentages[type] = 100;
  }

  // Sort types by percentage for display (descending)
  const sortedTypes = [...TYPE_ORDER].sort(
    (a, b) => percentages[b] - percentages[a]
  );

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/test/learning-style"
            className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            다시 테스트하기
          </Link>
        </div>

        {/* Result Card */}
        <ResultCard typeInfo={typeInfo} />

        {/* Share — 결과 직후 배치 */}
        <div className="mt-6 space-y-3">
          <ShareSection
            heading="친구에게도 알려주세요! 🎉"
            subtext="나의 학습유형을 공유하고 친구의 유형도 확인해보세요"
            kakaoTitle={`나는 ${typeInfo.emoji}${typeInfo.label}!`}
            shareUrl="https://smartedu-pick.com/test/learning-style"
            twitterText={`나는 ${typeInfo.emoji}${typeInfo.label}! 나의 학습유형 테스트 해보기 →`}
          />
          <ResultImageGenerator typeInfo={typeInfo} />
        </div>

        {/* Score Chart */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-text-primary">📊 유형별 점수 분포</h2>
          <div className="space-y-4">
            {sortedTypes.map((t) => {
              const info = learningTypes[t];
              const pct = percentages[t];
              return (
                <div key={t}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">
                      {info.emoji} {info.label}
                    </span>
                    <span className="font-bold" style={{ color: info.color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: info.color,
                        minWidth: pct > 0 ? '12px' : '0',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ad Slot 1 */}
        <AdSlot className="my-8" />

        {/* Detail */}
        <ResultDetail typeInfo={typeInfo} />

        {/* Ad Slot 2 */}
        <AdSlot className="my-8" />

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTests currentTest="learning-style" />
        </div>
      </div>
    </div>
  );
}

export default function ResultPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block animate-spin text-4xl">⏳</div>
            <p className="text-text-secondary">결과를 불러오고 있어요...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
