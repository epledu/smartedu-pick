'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { questions } from '@/data/tests/learning-style';
import type { LearningType } from '@/data/tests/learning-style';
import { calculateResult } from '@/lib/test-utils';
import { event as gaEvent } from '@/lib/analytics';
import TestProgress from '@/components/test/TestProgress';
import QuestionCard from '@/components/test/QuestionCard';
import TestParticipants from '@/components/test/TestParticipants';

type Phase = 'intro' | 'questions' | 'calculating';

export default function LearningStyleTestPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<LearningType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    gaEvent('test_start', { test_name: 'learning-style' });
    setPhase('questions');
  };

  const handleAnswer = useCallback(
    (type: LearningType) => {
      if (isTransitioning) return;

      const newAnswers = [...answers.slice(0, currentIndex), type];
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        // Last question → calculate result
        setPhase('calculating');
        const result = calculateResult(newAnswers);
        gaEvent('test_complete', { test_name: 'learning-style', result_type: result });
        // Encode all answers as comma-separated string
        const answersParam = newAnswers.join(',');
        setTimeout(() => {
          router.push(`/test/learning-style/result?type=${result}&answers=${answersParam}`);
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
          <span className="mb-6 block text-6xl">📋</span>
          <h1 className="mb-4 text-3xl font-extrabold text-text-primary md:text-4xl">
            나의 학습유형 테스트
          </h1>
          <p className="mb-2 text-base text-text-secondary md:text-lg">
            12개 질문으로 알아보는 나만의 공부 스타일
          </p>
          <p className="mb-8 text-sm text-text-secondary">
            시각형 · 청각형 · 실행형 · 분석형 중 나는 어떤 유형?
          </p>

          <div className="mb-6 inline-flex items-center gap-4 rounded-full bg-surface px-6 py-3 text-sm text-text-secondary shadow-sm">
            <span>⏱️ 약 3분 소요</span>
            <span className="h-4 w-px bg-border" />
            <span>📊 12문항</span>
          </div>

          <TestParticipants testId="learning-style" />

          {/* 테스트 소개 */}
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-gray-50 p-6 text-left dark:bg-gray-800/50">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">이 테스트는 어떤 테스트인가요?</h2>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              사람마다 정보를 받아들이고 기억하는 방식이 다릅니다.
              시각적으로 보고 이해하는 사람, 소리로 듣고 기억하는 사람,
              직접 해보면서 배우는 사람, 논리적으로 분석하며 정리하는 사람.
              12개 질문에 답하면 나의 학습 유형을 알려주고,
              유형에 맞는 공부법과 추천 AI 도구를 안내해드립니다.
            </p>
            <p className="mb-2 font-medium text-text-primary">이런 분에게 추천해요</p>
            <ul className="mb-4 space-y-1 text-sm text-text-secondary">
              <li><span className="text-green-600">✓</span> 공부를 열심히 하는데 성적이 안 오르는 학생</li>
              <li><span className="text-green-600">✓</span> 나에게 맞는 효율적인 공부법을 찾고 싶은 직장인</li>
              <li><span className="text-green-600">✓</span> 자녀의 학습 방법이 궁금한 학부모</li>
            </ul>
            <p className="mb-2 font-medium text-text-primary">테스트 안내</p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• 정답이 없는 테스트입니다. 평소 나와 가장 가까운 것을 골라주세요.</li>
              <li>• 결과는 시각형, 청각형, 실행형, 분석형 4가지 유형으로 나옵니다.</li>
              <li>• 유형별 맞춤 학습법과 추천 AI 도구도 함께 알려드립니다.</li>
            </ul>
          </div>

          <div className="mt-6 space-y-3">
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
          <h2 className="mb-2 text-2xl font-bold text-text-primary">결과를 분석하고 있어요...</h2>
          <p className="text-text-secondary">당신에게 딱 맞는 학습유형을 찾고 있습니다</p>
        </div>
      </div>
    );
  }

  // Question Screen
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
        <TestProgress current={currentIndex + 1} total={questions.length} />

        {/* Question */}
        <QuestionCard
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          isVisible={!isTransitioning}
        />
      </div>
    </div>
  );
}
