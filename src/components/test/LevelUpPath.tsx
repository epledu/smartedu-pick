'use client';

import type { AILevelInfo } from '@/data/tests/ai-literacy';

interface LevelUpPathProps {
  levelInfo: AILevelInfo;
  nextLevel: number | null;
}

export default function LevelUpPath({ levelInfo, nextLevel }: LevelUpPathProps) {
  if (!nextLevel) {
    return (
      <section>
        <h2 className="mb-6 text-xl font-bold text-text-primary">
          🏆 당신은 이미 최고 레벨입니다!
        </h2>
        <p className="text-text-secondary">
          AI 전문가로서 커뮤니티에 기여하고, AI의 미래를 함께 만들어가세요.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">
        🚀 Lv.{nextLevel}이 되려면...
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {levelInfo.levelUpTips.map((tip, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="mb-3 block text-3xl">{tip.icon}</span>
            <h3 className="mb-2 text-base font-bold text-text-primary">{tip.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{tip.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
