'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { incrementTestCount } from '@/lib/test-counter';
import { studyMethods } from '@/data/tests/ai-study-method';
import type { StudyMethodType } from '@/data/tests/ai-study-method';
import StudyRoutineCard from '@/components/test/StudyRoutineCard';
import ShareSection from '@/components/test/ShareSection';
import OtherTests from '@/components/test/OtherTests';
import AdSlot from '@/components/common/AdSlot';

const ALL_TYPES: StudyMethodType[] = [
  'prompt-writer', 'visual-noter', 'audio-learner', 'project-doer',
  'quiz-challenger', 'research-diver', 'summary-master', 'creative-maker',
];

function ResultImageGenerator({ primaryInfo, secondaryInfo }: { primaryInfo: typeof studyMethods[StudyMethodType]; secondaryInfo: typeof studyMethods[StudyMethodType] }) {
  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = primaryInfo.color;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.arc(w - 50, 50, 80, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(80, h - 40, 60, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('스마트에듀픽 AI 공부법 추천', w / 2, 45);

    ctx.font = '56px serif';
    ctx.fillText(primaryInfo.emoji, w / 2, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Pretendard, sans-serif';
    ctx.fillText(primaryInfo.label, w / 2, 175);

    ctx.font = '16px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(`+ ${secondaryInfo.emoji} ${secondaryInfo.shortLabel}`, w / 2, 210);

    ctx.font = '16px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`"${primaryInfo.shortDesc}"`, w / 2, 260);

    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(w * 0.2, 300); ctx.lineTo(w * 0.8, 300); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.fillText('smartedu-pick.com', w / 2, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Pretendard, sans-serif';
    ctx.fillText('나도 테스트 해보기 →', w / 2, 370);

    const link = document.createElement('a');
    link.download = `AI공부법추천-${primaryInfo.label}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [primaryInfo, secondaryInfo]);

  return (
    <button
      onClick={generateImage}
      className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-primary/30 bg-primary/5 text-base font-bold text-primary shadow-sm transition-all hover:bg-primary/10 active:scale-[0.98]"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      결과 이미지 저장
    </button>
  );
}

function StudyMethodResultContent() {
  const searchParams = useSearchParams();
  const primaryParam = (searchParams.get('primary') || 'prompt-writer') as StudyMethodType;
  const secondaryParam = (searchParams.get('secondary') || 'visual-noter') as StudyMethodType;
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    const count = incrementTestCount('ai-study-method');
    setParticipantCount(count);
  }, []);

  const primary = studyMethods[primaryParam] ? primaryParam : 'prompt-writer';
  const secondary = studyMethods[secondaryParam] ? secondaryParam : (primary === 'prompt-writer' ? 'visual-noter' : 'prompt-writer');

  const primaryInfo = studyMethods[primary];
  const secondaryInfo = studyMethods[secondary];

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/test/ai-study-method"
            className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            다시 테스트하기
          </Link>
        </div>

        {participantCount > 0 && (
          <p className="mb-4 text-center text-sm text-text-secondary">
            🎉 <strong className="text-primary">{participantCount.toLocaleString()}</strong>번째 참여자입니다!
          </p>
        )}

        {/* Result Card */}
        <section
          className="overflow-hidden rounded-2xl border-2 text-center shadow-lg"
          style={{ borderColor: primaryInfo.color }}
        >
          <div className="px-6 py-8 md:px-8 md:py-10" style={{ backgroundColor: primaryInfo.bgColor }}>
            <span className="mb-3 block text-6xl">{primaryInfo.emoji}</span>
            <h1 className="mb-2 text-2xl font-extrabold text-text-primary md:text-3xl">
              {primaryInfo.label}
            </h1>
            <p className="mb-4 text-base font-medium" style={{ color: primaryInfo.color }}>
              {primaryInfo.shortDesc}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm">
              <span style={{ color: secondaryInfo.color }}>{secondaryInfo.emoji}</span>
              <span className="text-text-secondary">
                서브: <strong className="text-text-primary">{secondaryInfo.shortLabel}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Share — 결과 직후 배치 */}
        <div className="mt-6 space-y-3">
          <ShareSection
            heading="나만의 학습 루틴을 공유하세요! 📚"
            subtext="나의 AI 공부법을 공유하고 친구와 비교해보세요"
            kakaoTitle={`나의 AI 공부법은 ${primaryInfo.emoji} ${primaryInfo.label}!`}
            shareUrl="https://smartedu-pick.com/test/ai-study-method"
            twitterText={`나의 AI 공부법은 ${primaryInfo.emoji} ${primaryInfo.label}! AI 공부법 추천 테스트 →`}
          />
          <ResultImageGenerator primaryInfo={primaryInfo} secondaryInfo={secondaryInfo} />
        </div>

        {/* Study Routine Card */}
        <div className="mt-8">
          <StudyRoutineCard primaryInfo={primaryInfo} secondaryInfo={secondaryInfo} />
        </div>

        {/* Ad Slot 1 */}
        <AdSlot className="my-8" />

        {/* Description */}
        <section className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            {primaryInfo.emoji} {primaryInfo.label} 상세 분석
          </h2>
          <div className="space-y-3 text-[15px] leading-relaxed text-text-secondary md:text-base">
            {primaryInfo.description.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph.trim()}</p>
            ))}
          </div>
        </section>

        {/* Expert Tip */}
        <section
          className="mt-6 rounded-2xl border-2 p-6 md:p-8"
          style={{ borderColor: primaryInfo.color + '40', backgroundColor: primaryInfo.bgColor }}
        >
          <h3 className="mb-3 text-lg font-bold text-text-primary">전문가 팁</h3>
          <p className="text-[15px] leading-relaxed text-text-secondary md:text-base">
            {primaryInfo.expertTip}
          </p>
        </section>

        {/* Recommended Tools */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">🤖 추천 AI 도구</h2>
          <div className="space-y-4">
            {primaryInfo.recommendedTools.map((tool, i) => (
              <a
                key={i}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-primary group-hover:text-primary">
                    {tool.name}
                    <span className="ml-1 text-xs text-text-secondary">↗</span>
                  </h3>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: primaryInfo.bgColor, color: primaryInfo.color }}
                  >
                    {tool.desc}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  <span className="font-semibold" style={{ color: primaryInfo.color }}>사용법:</span> {tool.usage}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">💡 실전 팁 3가지</h2>
          <ul className="space-y-3">
            {primaryInfo.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-text-secondary md:text-base">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: primaryInfo.color }}
                >
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* All Types Overview */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-text-primary">📊 8가지 AI 공부법</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ALL_TYPES.map((t) => {
              const info = studyMethods[t];
              const isCurrent = t === primary;
              return (
                <div
                  key={t}
                  className={`rounded-xl p-3 text-center transition-all ${
                    isCurrent ? 'scale-105 shadow-md' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? info.bgColor : '#F9FAFB',
                    border: isCurrent ? `2px solid ${info.color}` : '2px solid transparent',
                  }}
                >
                  <span className="block text-2xl">{info.emoji}</span>
                  <span
                    className="mt-1 block text-[11px] font-semibold"
                    style={{ color: isCurrent ? info.color : '#9CA3AF' }}
                  >
                    {info.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ad Slot 2 */}
        <AdSlot className="my-8" />

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTests currentTest="ai-study-method" />
        </div>
      </div>
    </div>
  );
}

export default function StudyMethodResultClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block animate-spin text-4xl">⏳</div>
            <p className="text-text-secondary">결과를 불러오고 있어요...</p>
          </div>
        </div>
      }
    >
      <StudyMethodResultContent />
    </Suspense>
  );
}
