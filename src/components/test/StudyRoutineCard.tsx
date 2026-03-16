'use client';

import type { StudyMethodInfo } from '@/data/tests/ai-study-method';

interface StudyRoutineCardProps {
  primaryInfo: StudyMethodInfo;
  secondaryInfo: StudyMethodInfo;
}

const TIME_SLOTS = [
  { key: 'morning' as const, emoji: '🌅', label: '아침' },
  { key: 'afternoon' as const, emoji: '☀️', label: '오후' },
  { key: 'evening' as const, emoji: '🌙', label: '저녁' },
  { key: 'weekend' as const, emoji: '🗓️', label: '주말' },
];

export default function StudyRoutineCard({
  primaryInfo,
  secondaryInfo,
}: StudyRoutineCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border-2 shadow-sm" style={{ borderColor: primaryInfo.color + '40' }}>
      <div className="px-6 py-5 md:px-8" style={{ backgroundColor: primaryInfo.bgColor }}>
        <h2 className="mb-1 text-xl font-bold text-text-primary">
          🎯 나만의 AI 학습 루틴
        </h2>
        <p className="text-sm font-medium" style={{ color: primaryInfo.color }}>
          {primaryInfo.shortLabel} + {secondaryInfo.shortLabel} 조합
        </p>
      </div>

      <div className="bg-surface px-6 py-6 md:px-8">
        <div className="relative space-y-0">
          {TIME_SLOTS.map((slot, i) => (
            <div key={slot.key} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline line */}
              {i < TIME_SLOTS.length - 1 && (
                <div
                  className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-0.5"
                  style={{ backgroundColor: primaryInfo.color + '20' }}
                />
              )}

              {/* Timeline dot */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: primaryInfo.bgColor }}
              >
                {slot.emoji}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1.5">
                <span
                  className="mb-1 block text-xs font-bold uppercase tracking-wider"
                  style={{ color: primaryInfo.color }}
                >
                  {slot.label}
                </span>
                <p className="text-sm leading-relaxed text-text-primary md:text-[15px]">
                  {primaryInfo.dailyRoutine[slot.key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary hint */}
        <div
          className="mt-4 rounded-xl p-4 text-sm"
          style={{ backgroundColor: secondaryInfo.bgColor }}
        >
          <span className="font-semibold" style={{ color: secondaryInfo.color }}>
            💡 {secondaryInfo.shortLabel} 요소 추가:
          </span>{' '}
          <span className="text-text-secondary">
            {secondaryInfo.dailyRoutine.evening}
          </span>
        </div>
      </div>
    </section>
  );
}
