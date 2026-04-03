'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { careerAIQuestions } from '@/data/tests/career-ai';
import type { CareerAIType } from '@/data/tests/career-ai';
import { calculateCareerAI } from '@/lib/test-utils';
import { event as gaEvent } from '@/lib/analytics';
import TestProgress from '@/components/test/TestProgress';
import TestParticipants from '@/components/test/TestParticipants';

type Phase = 'intro' | 'questions' | 'calculating';

export default function CareerAITestPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CareerAIType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    gaEvent('test_start', { test_name: 'career-ai' });
    setPhase('questions');
  };

  const handleAnswer = useCallback(
    (type: CareerAIType) => {
      if (isTransitioning) return;

      const newAnswers = [...answers.slice(0, currentIndex), type];
      setAnswers(newAnswers);

      if (currentIndex < careerAIQuestions.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        setPhase('calculating');
        const result = calculateCareerAI(newAnswers);
        gaEvent('test_complete', {
          test_name: 'career-ai',
          result_type: result.primary,
        });
        setTimeout(() => {
          router.push(
            `/test/career-ai/result?primary=${result.primary}&secondary=${result.secondary}`
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
          <span className="mb-6 block text-6xl">💼</span>
          <h1 className="mb-4 text-3xl font-extrabold text-text-primary md:text-4xl">
            AI 시대 직업 적성 테스트
          </h1>
          <p className="mb-2 text-base text-text-secondary md:text-lg">
            AI 시대, 나에게 맞는 커리어 방향은?
          </p>
          <p className="mb-8 text-sm text-text-secondary">
            6가지 AI 시대 직업 성향 중 나의 유형을 알아보세요
          </p>

          <div className="mb-6 inline-flex items-center gap-4 rounded-full bg-surface px-6 py-3 text-sm text-text-secondary shadow-sm">
            <span>⏱️ 약 3분 소요</span>
            <span className="h-4 w-px bg-border" />
            <span>📊 12문항</span>
          </div>

          <TestParticipants testId="career-ai" />

          {/* 테스트 소개 */}
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-gray-50 p-6 text-left dark:bg-gray-800/50">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">이 테스트는 어떤 테스트인가요?</h2>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              AI가 내 직업을 대체할까? 아니면 오히려 시너지를 낼 수 있을까?
              이 테스트는 AI 대체 안전도와 AI 협업 시너지를 2축으로 분석해서
              AI 시대에 맞는 나만의 커리어 방향을 제시합니다.
              어울리는 직업, 키워야 할 스킬, 6개월~1년 성장 경로도 알려드립니다.
            </p>
            <p className="mb-2 font-medium text-text-primary">이런 분에게 추천해요</p>
            <ul className="mb-4 space-y-1 text-sm text-text-secondary">
              <li><span className="text-green-600">✓</span> AI 시대 커리어 방향이 고민인 직장인</li>
              <li><span className="text-green-600">✓</span> 진로를 고민 중인 대학생, 취준생</li>
              <li><span className="text-green-600">✓</span> 자녀의 미래 직업이 궁금한 학부모</li>
            </ul>
            <p className="mb-2 font-medium text-text-primary">테스트 안내</p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• 12문항으로 약 3분이면 완료됩니다.</li>
              <li>• AI 대체 안전도(1~10)와 AI 협업 시너지(1~10) 2축 스코어를 제공합니다.</li>
              <li>• 이 테스트는 재미와 참고를 위한 것으로, 전문적인 진로 상담이 아닙니다.</li>
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
          <h2 className="mb-2 text-2xl font-bold text-text-primary">
            결과를 분석하고 있어요...
          </h2>
          <p className="text-text-secondary">
            AI 시대 당신의 커리어 방향을 찾고 있습니다
          </p>
        </div>
      </div>
    );
  }

  // Question Screen
  const question = careerAIQuestions[currentIndex];

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
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              이전 질문
            </button>
          ) : (
            <Link
              href="/test"
              className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              테스트 목록
            </Link>
          )}
        </div>

        {/* Progress */}
        <TestProgress current={currentIndex + 1} total={careerAIQuestions.length} />

        {/* Question */}
        <div
          className={`transition-all duration-400 ease-out ${
            !isTransitioning ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h2 className="mb-8 text-center text-lg font-bold leading-relaxed text-text-primary md:text-xl">
            <span className="mb-2 block text-sm font-medium text-primary">Q{question.id}.</span>
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.type)}
                className="group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.98] md:p-5"
                style={{ minHeight: '52px' }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg text-sm font-bold text-text-secondary transition-colors group-hover:bg-primary group-hover:text-white">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-[15px] font-medium leading-snug text-text-primary md:text-base">
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
