'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { event as gaEvent } from '@/lib/analytics';
import { aiLevels, DIFFICULTY_COLORS } from '@/data/tests/ai-literacy';
import type { AILevel, AILevelInfo } from '@/data/tests/ai-literacy';
import { calculateExpProgress } from '@/lib/test-utils';
import LevelBadge from '@/components/test/LevelBadge';
import LevelProgressBar from '@/components/test/LevelProgressBar';
import LevelUpPath from '@/components/test/LevelUpPath';
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

function ShareButtons({ levelInfo }: { levelInfo: AILevelInfo }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://smartedu-pick.com/test/ai-literacy';
  const shareText = `나는 ${levelInfo.emoji} ${levelInfo.title}! AI 활용 능력 진단 해보기 →`;

  const handleCopyUrl = async () => {
    gaEvent('share', { method: 'url_copy', content_type: 'test_result' });
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKakaoShare = () => {
    gaEvent('share', { method: 'kakao', content_type: 'test_result' });
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    gaEvent('share', { method: 'twitter', content_type: 'test_result' });
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center md:p-8">
      <h2 className="mb-2 text-xl font-bold text-text-primary">친구에게도 알려주세요!</h2>
      <p className="mb-6 text-sm text-text-secondary">나의 AI 레벨을 공유하고 친구의 레벨도 확인해보세요</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleCopyUrl}
          className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-border bg-surface px-6 text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95"
        >
          {copied ? (
            <>
              <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              복사되었습니다!
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              URL 복사
            </>
          )}
        </button>

        <button
          onClick={handleKakaoShare}
          className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-[#3B1E1E] transition-all hover:brightness-95 active:scale-95"
          style={{ backgroundColor: '#FEE500' }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.818 5.117 4.546 6.481-.14.507-.91 3.27-.94 3.482 0 0-.018.152.08.21.098.06.213.028.213.028.28-.04 3.243-2.14 3.756-2.502.74.106 1.51.162 2.345.162 5.523 0 10-3.462 10-7.691C22 6.463 17.523 3 12 3" />
          </svg>
          카카오톡
        </button>

        <button
          onClick={handleTwitterShare}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          트위터
        </button>
      </div>
    </section>
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
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      결과 카드 이미지 저장하기
    </button>
  );
}

function OtherTestsAI() {
  const tests = [
    {
      emoji: '📋',
      title: '나의 학습유형 테스트',
      desc: '12개 질문으로 알아보는 나만의 공부 스타일',
      href: '/test/learning-style',
      active: true,
    },
    {
      emoji: '👶',
      title: '우리 아이 학습 성향 분석',
      desc: '아이에게 맞는 교육법을 알아보세요',
      href: '#',
      active: false,
    },
  ];

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">🎯 다른 테스트도 해보세요</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tests.map((test) =>
          test.active ? (
            <Link
              key={test.title}
              href={test.href}
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-2 block text-3xl">{test.emoji}</span>
              <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">{test.title}</h3>
              <p className="mb-3 text-sm text-text-secondary">{test.desc}</p>
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                테스트 시작 →
              </span>
            </Link>
          ) : (
            <div
              key={test.title}
              className="rounded-2xl border border-border bg-surface p-5 opacity-70"
            >
              <span className="mb-2 block text-3xl">{test.emoji}</span>
              <h3 className="mb-1 text-base font-bold text-text-primary">{test.title}</h3>
              <p className="mb-3 text-sm text-text-secondary">{test.desc}</p>
              <span className="inline-block rounded-full bg-bg px-3 py-1 text-xs font-medium text-text-secondary">
                곧 공개 예정
              </span>
            </div>
          )
        )}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/test"
          className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          모든 테스트 보기 →
        </Link>
      </div>
    </section>
  );
}

function AIResultContent() {
  const searchParams = useSearchParams();
  const levelParam = parseInt(searchParams.get('level') || '3', 10) as AILevel;
  const scoreParam = parseInt(searchParams.get('score') || '25', 10);

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

        {/* Level Badge */}
        <LevelBadge levelInfo={levelInfo} totalScore={totalScore} />

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

        {/* Share */}
        <div className="mt-8 space-y-4">
          <ShareButtons levelInfo={levelInfo} />
          <AIResultImageGenerator
            levelInfo={levelInfo}
            totalScore={totalScore}
            progressInLevel={expProgress.progressInLevel}
          />
        </div>

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTestsAI />
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
