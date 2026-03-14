'use client';

import type { ChildTypeInfo } from '@/data/tests/child-type';

interface ChildResultCardProps {
  primaryInfo: ChildTypeInfo;
  secondaryInfo: ChildTypeInfo;
  primaryPct: number;
  secondaryPct: number;
}

export default function ChildResultCard({
  primaryInfo,
  secondaryInfo,
  primaryPct,
  secondaryPct,
}: ChildResultCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 text-center shadow-xl md:p-12"
      style={{ backgroundColor: primaryInfo.color }}
    >
      {/* Decorative soft circles */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        <p className="mb-2 text-sm font-medium text-white/80">
          스마트에듀픽 우리 아이 학습 성향 분석
        </p>

        {/* Animal emoji */}
        <span className="mb-3 block text-5xl md:text-6xl">
          {primaryInfo.animal.split(' ')[0]}
        </span>

        <p className="mb-1 text-lg font-medium text-white/90">우리 아이는</p>
        <h1 className="mb-2 text-3xl font-extrabold text-white md:text-4xl">
          {primaryInfo.label}!
        </h1>

        {/* Secondary type tag */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5">
          <span className="text-sm">+ {secondaryInfo.animal.split(' ')[0]}</span>
          <span className="text-sm font-semibold text-white">{secondaryInfo.label}</span>
        </div>

        <p className="mb-4 text-lg font-semibold text-white/90">
          &ldquo;{primaryInfo.shortDesc}&rdquo;
        </p>

        {/* Score summary */}
        <div className="flex items-center justify-center gap-6 text-sm text-white/80">
          <span>
            주성향: {primaryInfo.emoji} {primaryInfo.label} ({primaryPct}%)
          </span>
          <span>
            부성향: {secondaryInfo.emoji} {secondaryInfo.label} ({secondaryPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
