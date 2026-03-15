'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { event as gaEvent } from '@/lib/analytics';
import { shareKakao } from '@/lib/kakao';
import { childTypes, combinations, AGE_RANGE_COLORS } from '@/data/tests/child-type';
import type { ChildType } from '@/data/tests/child-type';
import { getChildScorePercentages } from '@/lib/test-utils';
import ChildResultCard from '@/components/test/ChildResultCard';
import ParentActionGuide from '@/components/test/ParentActionGuide';
import AdSlot from '@/components/common/AdSlot';

const TYPE_ORDER: ChildType[] = ['explorer', 'creative', 'social', 'logical', 'steady', 'perfectionist'];

function ChildShareButtons({ primaryLabel, animal }: { primaryLabel: string; animal: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://smartedu-pick.com/test/child-type';
  const shareText = `우리 아이는 ${animal.split(' ')[0]} ${primaryLabel}! 우리 아이 학습 성향 분석해보기 →`;

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
    shareKakao({
      title: `우리 아이는 ${animal.split(' ')[0]} ${primaryLabel}!`,
      description: '스마트에듀픽에서 테스트 해보세요!',
      linkUrl: shareUrl,
      buttonTitle: '테스트 해보기',
    });
  };

  const handleTwitterShare = () => {
    gaEvent('share', { method: 'twitter', content_type: 'test_result' });
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center md:p-8">
      <h2 className="mb-2 text-xl font-bold text-text-primary">친구에게도 알려주세요!</h2>
      <p className="mb-6 text-sm text-text-secondary">맘카페에서 다른 엄마들과 비교해보세요 🤗</p>

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

function ChildResultImageGenerator({
  primaryInfo,
  secondaryInfo,
}: {
  primaryInfo: (typeof childTypes)[ChildType];
  secondaryInfo: (typeof childTypes)[ChildType];
}) {
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

    // Soft decorative circles
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.arc(w - 50, 50, 80, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(80, h - 40, 60, 0, Math.PI * 2); ctx.fill();

    // Header
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('스마트에듀픽 우리 아이 학습 성향 분석', w / 2, 45);

    // Animal emoji
    ctx.font = '56px serif';
    ctx.fillText(primaryInfo.animal.split(' ')[0], w / 2, 120);

    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px Pretendard, sans-serif';
    ctx.fillText(`우리 아이는 ${primaryInfo.label}!`, w / 2, 180);

    // Secondary
    ctx.font = '18px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(`+ ${secondaryInfo.animal.split(' ')[0]} ${secondaryInfo.label}`, w / 2, 215);

    // Short desc
    ctx.font = '16px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`"${primaryInfo.shortDesc}"`, w / 2, 260);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(w * 0.2, 300); ctx.lineTo(w * 0.8, 300); ctx.stroke();

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.fillText('smartedu-pick.com', w / 2, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Pretendard, sans-serif';
    ctx.fillText('우리 아이도 분석해보기 →', w / 2, 370);

    const link = document.createElement('a');
    link.download = `우리아이학습성향-${primaryInfo.label}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [primaryInfo, secondaryInfo]);

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

function OtherTestsChild() {
  const tests = [
    {
      emoji: '📋',
      title: '나의 학습유형 테스트',
      desc: '12개 질문으로 알아보는 나만의 공부 스타일',
      href: '/test/learning-style',
      active: true,
    },
    {
      emoji: '🤖',
      title: 'AI 활용 능력 진단',
      desc: '당신의 AI 레벨은? Lv.1~Lv.5',
      href: '/test/ai-literacy',
      active: true,
    },
  ];

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">🎯 다른 테스트도 해보세요</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tests.map((test) => (
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
        ))}
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

function ChildResultContent() {
  const searchParams = useSearchParams();
  const primaryParam = (searchParams.get('primary') || 'explorer') as ChildType;
  const secondaryParam = (searchParams.get('secondary') || 'creative') as ChildType;
  const answersParam = searchParams.get('answers') || '';

  const primary = childTypes[primaryParam] ? primaryParam : 'explorer';
  const secondary = childTypes[secondaryParam] ? secondaryParam : (primary === 'explorer' ? 'creative' : 'explorer');

  const primaryInfo = childTypes[primary];
  const secondaryInfo = childTypes[secondary];

  // Calculate percentages
  let percentages: Record<ChildType, number>;
  if (answersParam) {
    const answers = answersParam.split(',') as ChildType[];
    const scores: Record<ChildType, number> = {
      explorer: 0, creative: 0, social: 0, logical: 0, steady: 0, perfectionist: 0,
    };
    answers.forEach((t) => { if (scores[t] !== undefined) scores[t]++; });
    percentages = getChildScorePercentages(scores);
  } else {
    percentages = { explorer: 0, creative: 0, social: 0, logical: 0, steady: 0, perfectionist: 0 };
    percentages[primary] = 42;
    percentages[secondary] = 25;
  }

  const sortedTypes = [...TYPE_ORDER].sort((a, b) => percentages[b] - percentages[a]);

  const comboKey = `${primary}-${secondary}`;
  const comboMessage = combinations[comboKey] || '';

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/test/child-type"
            className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            다시 테스트하기
          </Link>
        </div>

        {/* Result Card */}
        <ChildResultCard
          primaryInfo={primaryInfo}
          secondaryInfo={secondaryInfo}
          primaryPct={percentages[primary]}
          secondaryPct={percentages[secondary]}
        />

        {/* Score Chart */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-text-primary">📊 성향별 점수 분포</h2>
          <div className="space-y-3">
            {sortedTypes.map((t) => {
              const info = childTypes[t];
              const pct = percentages[t];
              return (
                <div key={t}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">
                      {info.animal.split(' ')[0]} {info.label}
                    </span>
                    <span className="font-bold" style={{ color: info.color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: info.color,
                        minWidth: pct > 0 ? '12px' : '0',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ad Slot 1 */}
        <AdSlot className="my-8" />

        {/* Description + Traits */}
        <section className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            {primaryInfo.animal} 상세 분석
          </h2>
          <div className="mb-6 space-y-3 text-[15px] leading-relaxed text-text-secondary md:text-base">
            {primaryInfo.description.split('\n\n').map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </div>
          <h3 className="mb-3 text-base font-bold text-text-primary">주요 특징</h3>
          <ul className="space-y-2">
            {primaryInfo.traits.map((trait, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary md:text-[15px]">
                <span className="mt-0.5 shrink-0" style={{ color: primaryInfo.color }}>●</span>
                {trait}
              </li>
            ))}
          </ul>
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

        {/* Combination Message */}
        {comboMessage && (
          <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold text-text-primary">
              💫 {primaryInfo.label} + {secondaryInfo.label} 조합의 아이는?
            </h2>
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-2xl">
                {primaryInfo.animal.split(' ')[0]}{secondaryInfo.animal.split(' ')[0]}
              </span>
              <p className="text-[15px] leading-relaxed text-text-secondary md:text-base">
                {comboMessage}
              </p>
            </div>
          </section>
        )}

        {/* Learning Environment */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            🏠 {primaryInfo.learningEnvironment.title}
          </h2>
          <ul className="space-y-3">
            {primaryInfo.learningEnvironment.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] text-text-secondary md:text-base">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white"
                  style={{ backgroundColor: primaryInfo.color }}
                >
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* Study Methods */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">
            📚 추천 교육법
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {primaryInfo.studyMethods.map((method, i) => (
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

        {/* Parent Action Guide */}
        <div className="mt-8">
          <ParentActionGuide typeInfo={primaryInfo} />
        </div>

        {/* Recommended AI Tools */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">🤖 추천 AI 교육 도구</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {primaryInfo.aiTools.map((tool, i) => {
              const ageColor = AGE_RANGE_COLORS[tool.ageRange] || { bg: '#F3F4F6', text: '#6B7280' };
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
                      style={{ backgroundColor: ageColor.bg, color: ageColor.text }}
                    >
                      {tool.ageRange}
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

        {/* Share */}
        <div className="space-y-4">
          <ChildShareButtons primaryLabel={primaryInfo.label} animal={primaryInfo.animal} />
          <ChildResultImageGenerator primaryInfo={primaryInfo} secondaryInfo={secondaryInfo} />
        </div>

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTestsChild />
        </div>

        {/* Legal Notice */}
        <div className="mt-10 rounded-xl bg-bg p-4 text-center text-xs leading-relaxed text-text-secondary/70">
          이 테스트는 재미와 참고를 위한 것으로, 전문적인 심리 검사나 교육 진단이 아닙니다.
          <br />
          아이의 학습에 대한 전문적인 상담이 필요하시면 교육 전문가에게 문의해주세요.
        </div>
      </div>
    </div>
  );
}

export default function ChildResultClient() {
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
      <ChildResultContent />
    </Suspense>
  );
}
