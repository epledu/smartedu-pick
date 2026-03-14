'use client';

import type { AILevelInfo } from '@/data/tests/ai-literacy';

interface LevelProgressBarProps {
  levelInfo: AILevelInfo;
  totalScore: number;
  currentLevelMin: number;
  currentLevelMax: number;
  progressInLevel: number;
  nextLevel: number | null;
}

export default function LevelProgressBar({
  levelInfo,
  totalScore,
  currentLevelMin,
  currentLevelMax,
  progressInLevel,
  nextLevel,
}: LevelProgressBarProps) {
  const pointsInRange = totalScore - currentLevelMin;
  const rangeSize = currentLevelMax - currentLevelMin + 1;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">⚡ 경험치</h2>
        {nextLevel && (
          <span className="text-sm font-medium text-text-secondary">
            Lv.{nextLevel}까지
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="flex h-full items-center justify-end rounded-full pr-2 transition-all duration-1000 ease-out"
          style={{
            width: `${Math.max(progressInLevel, 8)}%`,
            backgroundColor: levelInfo.color,
          }}
        >
          <span className="text-[11px] font-bold text-white">
            {progressInLevel}%
          </span>
        </div>
      </div>

      {/* Score detail */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          EXP <span className="font-bold" style={{ color: levelInfo.color }}>{pointsInRange}</span>/{rangeSize}
        </span>
        <span>
          {totalScore}점 (범위: {currentLevelMin}~{currentLevelMax}점)
        </span>
      </div>
    </div>
  );
}
