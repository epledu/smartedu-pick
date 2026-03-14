'use client';

import type { LearningTypeInfo } from '@/data/tests/learning-style';

interface ResultCardProps {
  typeInfo: LearningTypeInfo;
}

export default function ResultCard({ typeInfo }: ResultCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 text-center shadow-xl md:p-12"
      style={{ backgroundColor: typeInfo.color }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-white/5" />

      <div className="relative z-10">
        <p className="mb-2 text-sm font-medium text-white/80">나의 학습유형 테스트 결과</p>
        <span className="mb-4 block text-6xl md:text-7xl">{typeInfo.emoji}</span>
        <p className="mb-1 text-lg font-medium text-white/90">당신은</p>
        <h1 className="mb-3 text-3xl font-extrabold text-white md:text-4xl">{typeInfo.label}!</h1>
        <p className="text-lg font-semibold text-white/90">&ldquo;{typeInfo.shortDesc}&rdquo;</p>
      </div>
    </div>
  );
}
