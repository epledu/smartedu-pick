'use client';

import type { AILevelInfo } from '@/data/tests/ai-literacy';

interface LevelBadgeProps {
  levelInfo: AILevelInfo;
  totalScore: number;
}

export default function LevelBadge({ levelInfo, totalScore }: LevelBadgeProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 text-center shadow-xl md:p-12"
      style={{ backgroundColor: levelInfo.color }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-white/5" />

      <div className="relative z-10">
        <p className="mb-2 text-sm font-medium text-white/80">스마트에듀픽 AI 활용 능력 진단</p>
        <span className="mb-4 block text-6xl md:text-7xl">{levelInfo.emoji}</span>
        <h1 className="mb-2 text-3xl font-extrabold text-white md:text-4xl">{levelInfo.title}</h1>
        <p className="mb-3 text-lg font-semibold text-white/90">&ldquo;{levelInfo.shortDesc}&rdquo;</p>
        <p className="text-xl font-bold text-white/95">총점: {totalScore}/40</p>
      </div>
    </div>
  );
}
