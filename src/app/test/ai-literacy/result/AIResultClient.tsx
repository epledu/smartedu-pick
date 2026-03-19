'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { incrementTestCount } from '@/lib/test-counter';
import { saveProfileResult } from '@/lib/profile-generator';
import { aiLevels, DIFFICULTY_COLORS } from '@/data/tests/ai-literacy';
import type { AILevel, AILevelInfo } from '@/data/tests/ai-literacy';
import { calculateExpProgress } from '@/lib/test-utils';
import LevelBadge from '@/components/test/LevelBadge';
import LevelProgressBar from '@/components/test/LevelProgressBar';
import LevelUpPath from '@/components/test/LevelUpPath';
import ShareSection from '@/components/test/ShareSection';
import OtherTests from '@/components/test/OtherTests';
import ProfileCTA from '@/components/test/ProfileCTA';
import AdSlot from '@/components/common/AdSlot';

const ALL_LEVELS: AILevel[] = [1, 2, 3, 4, 5];

function LevelMap({ currentLevel }: { currentLevel: AILevel }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
      <h2 className="mb-6 text-xl font-bold text-text-primary">🗺️ 전체 레벨 맵</h2>
      <div className="flex items-center justify-center gap-0">
        {ALL_LEVELS.map((lv, i) => {
          const info = aiLevels[lv];
          const isCurrent = lv === currentLevel;
          return (
            <div key={lv} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-3 text-lg font-bold transition-all md:h-14 md:w-14 md:text-xl ${
                    isCurrent
                      ? 'scale-110 shadow-lg'
                      : lv < currentLevel
                      ? 'opacity-90'
                      : 'opacity-40'
                  }`}
                  style={{
                    borderColor: isCurrent || lv < currentLevel ? info.color : '#D1D5DB',
                    backgroundColor: isCurrent ? info.color : lv < currentLevel ? info.bgColor : '#F9FAFB',
                    color: isCurrent ? '#FFFFFF' : info.color,
                  }}
                >
                  {info.emoji}
                </div>
                <span
                  className={`mt-2 text-[11px] font-semibold md:text-xs ${
                    isCurrent ? 'font-bold' : 'text-text-secondary'
                  }`}
                  style={{ color: isCurrent ? info.color : undefined }}
                >
                  Lv.{lv}
                </span>
              </div>
              {i < ALL_LEVELS.length - 1 && (
                <div
                  className="mx-1 h-1 w-6 rounded-full md:mx-2 md:w-10"
                  style={{
                    backgroundColor: lv < currentLevel ? aiLevels[lv].color : '#D1D5DB',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AIResultImageGenerator({ levelInfo, totalScore, progressInLevel }: { levelInfo: AILevelInfo; totalScore: number; progressInLevel: number }) {
  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = levelInfo.color;
    ctx.fillRect(0, 0, w, h);

    // Decorative circles
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(w - 50, 50, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(80, h - 40, 60, 0, Math.PI * 2);
    ctx.fill();

    // Header
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '16px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('스마트에듀픽 AI 활용 능력 진단', w / 2, 50);

    // Emoji
    ctx.font = '64px serif';
    ctx.fillText(levelInfo.emoji, w / 2, 130);

    // Level title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Pretendard, sans-serif';
    ctx.fillText(levelInfo.title, w / 2, 195);

    // Score
    ctx.font = '20px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`총점: ${totalScore}/40`, w / 2, 235);

    // Progress bar background
    const barX = w * 0.15;
    const barW = w * 0.7;
    const barY = 265;
    const barH = 20;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 10);
    ctx.fill();

    // Progress bar fill
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * (progressInLevel / 100), barH, 10);
    ctx.fill();

    // Percentage
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.fillText(`${progressInLevel}%`, w / 2, 310);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, 335);
    ctx.lineTo(w * 0.8, 335);
    ctx.stroke();

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.fillText('smartedu-pick.com', w / 2, 360);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Pretendard, sans-serif';
    ctx.fillText('나도 테스트 해보기 →', w / 2, 385);

    // Download
    const link = document.createElement('a');
    link.download = `AI활용능력진단-${levelInfo.title}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [levelInfo, totalScore, progressInLevel]);

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

function AIResultContent() {
  const searchParams = useSearchParams();
  const levelParam = parseInt(searchParams.get('level') || '3', 10) as AILevel;
  const scoreParam = parseInt(searchParams.get('score') || '25', 10);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    const count = incrementTestCount('ai-literacy');
    setParticipantCount(count);
    const info = aiLevels[level];
    saveProfileResult('ai-literacy', {
      type: String(level),
      label: `Lv.${level} ${info.label}`,
      emoji: info.emoji,
      completedAt: new Date().toISOString().slice(0, 10),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const level = (levelParam >= 1 && levelParam <= 5 ? levelParam : 3) as AILevel;
  const totalScore = Math.max(10, Math.min(40, scoreParam));
  const levelInfo = aiLevels[level];

  // Fake scores array to calculate exp progress
  const fakeScores = Array(10).fill(totalScore / 10);
  // Adjust so sum equals totalScore
  fakeScores[0] = totalScore - fakeScores.slice(1).reduce((s: number, v: number) => s + v, 0);
  const expProgress = calculateExpProgress(fakeScores.map(Math.round));
  // Override with actual values
  expProgress.totalScore = totalScore;
  expProgress.level = level;

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/test/ai-literacy"
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

        {/* Level Badge */}
        <LevelBadge levelInfo={levelInfo} totalScore={totalScore} />

        {/* Share — 결과 직후 배치 */}
        <div className="mt-6 space-y-3">
          <ShareSection
            heading="나의 AI 레벨을 자랑하세요! 🚀"
            subtext="나의 AI 레벨을 공유하고 친구의 레벨도 확인해보세요"
            kakaoTitle={`나는 ${levelInfo.emoji} ${levelInfo.title}!`}
            shareUrl="https://smartedu-pick.com/test/ai-literacy"
            twitterText={`나는 ${levelInfo.emoji} ${levelInfo.title}! AI 활용 능력 진단 해보기 →`}
          />
          <AIResultImageGenerator
            levelInfo={levelInfo}
            totalScore={totalScore}
            progressInLevel={expProgress.progressInLevel}
          />
        </div>

        {/* Level Progress Bar */}
        <LevelProgressBar
          levelInfo={levelInfo}
          totalScore={totalScore}
          currentLevelMin={expProgress.currentLevelMin}
          currentLevelMax={expProgress.currentLevelMax}
          progressInLevel={expProgress.progressInLevel}
          nextLevel={expProgress.nextLevel}
        />

        {/* Ad Slot 1 */}
        <AdSlot className="my-8" />

        {/* Description */}
        <section className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            {levelInfo.emoji} {levelInfo.label} 상세 분석
          </h2>
          <div className="space-y-3 text-[15px] leading-relaxed text-text-secondary md:text-base">
            {levelInfo.description.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph.trim()}</p>
            ))}
          </div>
        </section>

        {/* Expert Tip */}
        <section
          className="mt-6 rounded-2xl border-2 p-6 md:p-8"
          style={{ borderColor: levelInfo.color + '40', backgroundColor: levelInfo.bgColor }}
        >
          <h3 className="mb-3 text-lg font-bold text-text-primary">전문가 팁</h3>
          <p className="text-[15px] leading-relaxed text-text-secondary md:text-base">
            {levelInfo.expertTip}
          </p>
        </section>

        {/* Current Skills */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">✅ 현재 보유 스킬</h2>
          <ul className="space-y-3">
            {levelInfo.currentSkills.map((skill, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-text-secondary md:text-base">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white"
                  style={{ backgroundColor: levelInfo.color }}
                >
                  ✓
                </span>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* Level Up Path */}
        <div className="mt-8">
          <LevelUpPath levelInfo={levelInfo} nextLevel={expProgress.nextLevel} />
        </div>

        {/* Recommended Tools */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">🤖 추천 AI 도구</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {levelInfo.recommendedTools.map((tool, i) => {
              const diffColor = DIFFICULTY_COLORS[tool.difficulty] || DIFFICULTY_COLORS['입문'];
              return (
                <a
                  key={i}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary group-hover:text-primary">
                      {tool.name}
                      <span className="ml-1 text-xs text-text-secondary">↗</span>
                    </h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: diffColor.bg, color: diffColor.text }}
                    >
                      {tool.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{tool.desc}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Ad Slot 2 */}
        <AdSlot className="my-8" />

        {/* Level Map */}
        <LevelMap currentLevel={level} />

        {/* Profile CTA */}
        <div className="mt-8"><ProfileCTA /></div>

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTests currentTest="ai-literacy" />
        </div>
      </div>
    </div>
  );
}

export default function AIResultClient() {
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
      <AIResultContent />
    </Suspense>
  );
}
