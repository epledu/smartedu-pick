'use client';

import type { LearningTypeInfo } from '@/data/tests/learning-style';

interface ResultDetailProps {
  typeInfo: LearningTypeInfo;
}

export default function ResultDetail({ typeInfo }: ResultDetailProps) {
  return (
    <div className="space-y-10">
      {/* Description */}
      <section className="rounded-2xl border border-border bg-surface p-6 md:p-8">
        <h2 className="mb-4 text-xl font-bold text-text-primary">
          {typeInfo.emoji} {typeInfo.label} 상세 분석
        </h2>
        <div className="space-y-3 text-[15px] leading-relaxed text-text-secondary md:text-base">
          {typeInfo.description.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph.trim()}</p>
          ))}
        </div>
      </section>

      {/* Expert Tip */}
      <section
        className="rounded-2xl border-2 p-6 md:p-8"
        style={{ borderColor: typeInfo.color + '40', backgroundColor: typeInfo.bgColor }}
      >
        <h3 className="mb-3 text-lg font-bold text-text-primary">전문가 팁</h3>
        <p className="text-[15px] leading-relaxed text-text-secondary md:text-base">
          {typeInfo.expertTip}
        </p>
      </section>

      {/* Study Methods */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-text-primary">
          📚 {typeInfo.label}을 위한 맞춤 학습법
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {typeInfo.studyMethods.map((method, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-3 block text-3xl">{method.icon}</span>
              <h3 className="mb-2 text-base font-bold text-text-primary">{method.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{method.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Tools */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-text-primary">
          🤖 추천 AI 도구
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {typeInfo.recommendedTools.map((tool, i) => (
            <a
              key={i}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="mb-2 text-base font-bold text-text-primary group-hover:text-primary">
                {tool.name}
                <span className="ml-1 text-xs text-text-secondary">↗</span>
              </h3>
              <p className="text-sm text-text-secondary">{tool.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Compatibility */}
      <section
        className="rounded-2xl p-6 text-center md:p-8"
        style={{ backgroundColor: typeInfo.bgColor }}
      >
        <h2 className="mb-4 text-xl font-bold text-text-primary">💕 유형 궁합</h2>
        <p className="mb-2 text-lg font-semibold" style={{ color: typeInfo.color }}>
          {typeInfo.label} + {typeInfo.compatibility.bestLabel}
        </p>
        <p className="text-text-secondary">{typeInfo.compatibility.bestDesc}</p>
      </section>
    </div>
  );
}
