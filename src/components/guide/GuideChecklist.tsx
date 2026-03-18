'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'smartedu-guide-checklist';

const ITEMS = [
  {
    id: 'ai-change',
    label: 'AI 시대, 교육이 어떻게 바뀌나요?',
    desc: '변화의 방향을 이해하면 불안이 줄어듭니다',
    href: '/articles/ai-era-child-education',
    linkLabel: '아티클 읽기 →',
  },
  {
    id: 'child-type',
    label: '우리 아이는 어떤 유형인지 알아보기',
    desc: '6가지 학습 성향 중 우리 아이를 찾아보세요',
    href: '/test/child-type',
    linkLabel: '테스트 해보기 →',
  },
  {
    id: 'education-method',
    label: '아이 성향에 맞는 교육법 확인하기',
    desc: '성향에 따라 효과적인 교육 방법이 달라요',
    href: '/articles/child-learning-type-education',
    linkLabel: '아티클 읽기 →',
  },
  {
    id: 'ai-tools',
    label: '아이에게 맞는 AI 도구 찾아보기',
    desc: '학부모용으로 필터링된 추천 도구를 확인하세요',
    href: '/tools',
    linkLabel: 'AI 도구 보기 →',
  },
];

export default function GuideChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <>
      {/* Progress */}
      {doneCount > 0 && (
        <div className="mb-6 rounded-xl bg-white/80 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-amber-700">진행도</span>
            <span className="font-bold text-amber-600">{doneCount}/{ITEMS.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-amber-100">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${(doneCount / ITEMS.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {ITEMS.map((item) => {
          const isDone = !!checked[item.id];
          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-5 transition-all ${isDone ? 'border-amber-300 bg-amber-50/50' : 'border-amber-200'}`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggle(item.id)}
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                    isDone
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-amber-300 bg-white hover:border-amber-500'
                  }`}
                  aria-label={isDone ? '완료 취소' : '완료 표시'}
                >
                  {isDone && (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={`mb-1 text-base font-bold ${isDone ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                    {item.label}
                  </h3>
                  <p className="mb-2 text-sm text-text-secondary">{item.desc}</p>
                  <Link href={item.href} className="inline-flex items-center text-sm font-semibold text-amber-600 transition-colors hover:text-amber-800">
                    {item.linkLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {doneCount === ITEMS.length && (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm">
          <span className="mb-2 block text-4xl">🎉</span>
          <p className="text-base font-bold text-text-primary">모든 체크리스트를 완료했어요!</p>
          <p className="mt-1 text-sm text-text-secondary">이제 우리 아이 AI 교육 전문가가 되셨습니다</p>
        </div>
      )}
    </>
  );
}
