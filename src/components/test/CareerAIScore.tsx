'use client';

import type { CareerAIInfo } from '@/data/tests/career-ai';

interface CareerAIScoreProps {
  info: CareerAIInfo;
}

function ScoreBar({
  label,
  emoji,
  score,
  color,
  description,
}: {
  label: string;
  emoji: string;
  score: number;
  color: string;
  description: string;
}) {
  const percentage = score * 10;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-text-primary">
          {emoji} {label}
        </span>
        <span className="text-lg font-extrabold" style={{ color }}>
          {score}/10
        </span>
      </div>
      <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
      <p className="text-xs text-text-secondary">{description}</p>
    </div>
  );
}

export default function CareerAIScore({ info }: CareerAIScoreProps) {
  const safetyDesc =
    info.aiSafetyScore >= 8
      ? 'AI가 당신의 역할을 대체하기 어려워요!'
      : info.aiSafetyScore >= 6
        ? 'AI와 잘 협업하면 더 안전한 포지션을 만들 수 있어요'
        : 'AI 활용 역량을 키우면 안전도를 높일 수 있어요';

  const synergyDesc =
    info.aiSynergyScore >= 9
      ? 'AI와 함께하면 능력이 크게 증폭돼요!'
      : info.aiSynergyScore >= 7
        ? 'AI를 파트너로 활용하면 효율이 크게 올라요'
        : 'AI 활용법을 익히면 더 큰 시너지를 낼 수 있어요';

  return (
    <section
      className="overflow-hidden rounded-2xl border-2 shadow-sm"
      style={{ borderColor: info.color + '40' }}
    >
      <div
        className="px-6 py-5 md:px-8"
        style={{ backgroundColor: info.bgColor }}
      >
        <h2 className="text-lg font-bold text-text-primary">
          {info.emoji} AI 시대 적합도 분석
        </h2>
      </div>

      <div className="space-y-6 bg-surface px-6 py-6 md:px-8">
        <ScoreBar
          label="AI 대체 안전도"
          emoji="🛡️"
          score={info.aiSafetyScore}
          color="#10B981"
          description={safetyDesc}
        />
        <ScoreBar
          label="AI 협업 시너지"
          emoji="🤝"
          score={info.aiSynergyScore}
          color={info.color}
          description={synergyDesc}
        />
      </div>
    </section>
  );
}
