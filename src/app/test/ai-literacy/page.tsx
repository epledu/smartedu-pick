'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { aiQuestions } from '@/data/tests/ai-literacy';
import { calculateAILevel } from '@/lib/test-utils';
import { event as gaEvent } from '@/lib/analytics';
import TestProgress from '@/components/test/TestProgress';
import TestParticipants from '@/components/test/TestParticipants';

type Phase = 'intro' | 'questions' | 'calculating';

export default function AILiteracyTestPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    gaEvent('test_start', { test_name: 'ai-literacy' });
    setPhase('questions');
  };

  const handleAnswer = useCallback(
    (score: number) => {
      if (isTransitioning) return;

      const newScores = [...scores.slice(0, currentIndex), score];
      setScores(newScores);

      if (currentIndex < aiQuestions.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        setPhase('calculating');
        const level = calculateAILevel(newScores);
        const totalScore = newScores.reduce((sum, s) => sum + s, 0);
        gaEvent('test_complete', { test_name: 'ai-literacy', result_type: `Lv.${level}` });
        setTimeout(() => {
          router.push(`/test/ai-literacy/result?level=${level}&score=${totalScore}`);
        }, 1200);
      }
    },
    [scores, currentIndex, isTransitioning, router]
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
          <span className="mb-6 block text-6xl">🤖</span>
          <h1 className="mb-4 text-3xl font-extrabold text-text-primary md:text-4xl">
            AI 활용 능력 진단
          </h1>
          <p className="mb-2 text-base text-text-secondary md:text-lg">
            10개 질문으로 알아보는 당신의 AI 레벨
          </p>
          <p className="mb-8 text-sm text-text-secondary">
            Lv.1 입문자 · Lv.2 초보자 · Lv.3 활용자 · Lv.4 숙련자 · Lv.5 전문가
          </p>

          <div className="mb-6 inline-flex items-center gap-4 rounded-full bg-surface px-6 py-3 text-sm text-text-secondary shadow-sm">
            <span>⏱️ 약 2분 소요</span>
            <span className="h-4 w-px bg-border" />
            <span>📊 10문항</span>
          </div>

          <TestParticipants testId="ai-literacy" />

          {/* 테스트 소개 */}
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-gray-50 p-6 text-left dark:bg-gray-800/50">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">이 테스트는 어떤 테스트인가요?</h2>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              ChatGPT는 써봤는데 나는 AI를 제대로 활용하고 있는 걸까?
              이 테스트는 AI 활용 능력을 Lv.1 입문부터 Lv.5 전문가까지
              5단계로 진단합니다. 현재 나의 수준을 파악하고,
              다음 레벨로 올라가기 위한 구체적인 학습 경로를 안내해드립니다.
            </p>
            <p className="mb-2 font-medium text-text-primary">이런 분에게 추천해요</p>
            <ul className="mb-4 space-y-1 text-sm text-text-secondary">
              <li><span className="text-green-600">✓</span> AI를 업무에 활용하고 싶은 직장인</li>
              <li><span className="text-green-600">✓</span> AI 교육을 준비하는 교사</li>
              <li><span className="text-green-600">✓</span> AI 활용 능력을 객관적으로 파악하고 싶은 분</li>
            </ul>
            <p className="mb-2 font-medium text-text-primary">테스트 안내</p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• 10문항으로 약 2분이면 완료됩니다.</li>
              <li>• 결과는 Lv.1~Lv.5까지 5단계로 나옵니다.</li>
              <li>• 다음 레벨로 가기 위한 추천 학습 경로와 도구를 알려드립니다.</li>
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
          <div className="mb-6 inline-block animate-spin text-5xl">🤖</div>
          <h2 className="mb-2 text-2xl font-bold text-text-primary">AI 레벨을 분석하고 있어요...</h2>
          <p className="text-text-secondary">당신의 AI 활용 능력을 진단하고 있습니다</p>
        </div>
      </div>
    );
  }

  // Question Screen
  const question = aiQuestions[currentIndex];

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
        <TestProgress current={currentIndex + 1} total={aiQuestions.length} />

        {/* Question Card */}
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
                onClick={() => handleAnswer(option.score)}
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
