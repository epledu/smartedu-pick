'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { childQuestions } from '@/data/tests/child-type';
import type { ChildType } from '@/data/tests/child-type';
import { calculateChildType } from '@/lib/test-utils';
import TestProgress from '@/components/test/TestProgress';

type Phase = 'intro' | 'questions' | 'calculating';

export default function ChildTypeTestPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ChildType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    setPhase('questions');
  };

  const handleAnswer = useCallback(
    (type: ChildType) => {
      if (isTransitioning) return;

      const newAnswers = [...answers.slice(0, currentIndex), type];
      setAnswers(newAnswers);

      if (currentIndex < childQuestions.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        setPhase('calculating');
        const result = calculateChildType(newAnswers);
        const answersParam = newAnswers.join(',');
        setTimeout(() => {
          router.push(
            `/test/child-type/result?primary=${result.primary}&secondary=${result.secondary}&answers=${answersParam}`
          );
        }, 1200);
      }
    },
    [answers, currentIndex, isTransitioning, router]
  );

  const handleBack = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div className="flex min-h-[70vh] items-center py-16 md:py-24">
        <div className="mx-auto max-w-lg px-4 text-center">
          <span className="mb-6 block text-6xl">👶</span>
          <h1 className="mb-4 text-3xl font-extrabold text-text-primary md:text-4xl">
            우리 아이 학습 성향 분석
          </h1>
          <p className="mb-2 text-base text-text-secondary md:text-lg">
            12개 질문으로 알아보는 우리 아이만의 학습 스타일
          </p>
          <p className="mb-6 text-sm text-text-secondary">
            🐱 탐험가 · 🦋 창의가 · 🐶 사회형 · 🦉 논리형 · 🐢 꾸준형 · 🦊 완벽주의형
          </p>

          {/* Notice */}
          <div className="mx-auto mb-6 max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-800">
            <p className="mb-1 font-semibold">📝 안내사항</p>
            <p className="leading-relaxed">
              부모님이 평소 아이를 관찰한 내용을 바탕으로 답해주세요.
              정답은 없으니 가장 가까운 것을 골라주시면 됩니다.
            </p>
          </div>

          <div className="mb-6 inline-flex items-center gap-4 rounded-full bg-surface px-6 py-3 text-sm text-text-secondary shadow-sm">
            <span>⏱️ 약 3분 소요</span>
            <span className="h-4 w-px bg-border" />
            <span>📊 12문항</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStart}
              className="inline-flex h-14 w-full max-w-xs items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-95"
            >
              시작하기
            </button>
            <div>
              <Link
                href="/test"
                className="text-sm text-text-secondary transition-colors hover:text-primary"
              >
                ← 테스트 목록으로
              </Link>
            </div>
          </div>

          <p className="mt-6 text-xs text-text-secondary/70">
            이 테스트는 재미와 참고를 위한 것으로, 전문적인 심리 진단이 아닙니다.
          </p>
        </div>
      </div>
    );
  }

  // Calculating Screen
  if (phase === 'calculating') {
    return (
      <div className="flex min-h-[70vh] items-center py-16 md:py-24">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="mb-6 inline-block animate-spin text-5xl">🔍</div>
          <h2 className="mb-2 text-2xl font-bold text-text-primary">
            우리 아이 성향을 분석하고 있어요...
          </h2>
          <p className="text-text-secondary">아이에게 딱 맞는 학습 스타일을 찾고 있습니다</p>
        </div>
      </div>
    );
  }

  // Question Screen
  const question = childQuestions[currentIndex];

  return (
    <div className="min-h-[70vh] py-8 md:py-16">
      <div className="mx-auto max-w-xl px-4">
        {/* Back button */}
        <div className="mb-4">
          {currentIndex > 0 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              이전 질문
            </button>
          ) : (
            <Link
              href="/test"
              className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              테스트 목록
            </Link>
          )}
        </div>

        {/* Progress */}
        <TestProgress current={currentIndex + 1} total={childQuestions.length} />

        {/* Question Card - 6 options, compact for mobile */}
        <div
          className={`transition-all duration-400 ease-out ${
            !isTransitioning ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h2 className="mb-6 text-center text-lg font-bold leading-relaxed text-text-primary md:mb-8 md:text-xl">
            <span className="mb-2 block text-sm font-medium text-primary">Q{question.id}.</span>
            {question.text}
          </h2>

          <div className="space-y-2.5">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.type)}
                className="group flex w-full items-center gap-3 rounded-xl border-2 border-border bg-surface p-3.5 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.98] md:gap-4 md:rounded-2xl md:p-4"
                style={{ minHeight: '48px' }}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg text-xs font-bold text-text-secondary transition-colors group-hover:bg-primary group-hover:text-white md:h-8 md:w-8 md:text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-[14px] font-medium leading-snug text-text-primary md:text-[15px]">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
