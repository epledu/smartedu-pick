'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { incrementTestCount } from '@/lib/test-counter';
import { saveProfileResult } from '@/lib/profile-generator';
import { childTypes, combinations, AGE_RANGE_COLORS } from '@/data/tests/child-type';
import type { ChildType } from '@/data/tests/child-type';
import { getChildScorePercentages } from '@/lib/test-utils';
import ChildResultCard from '@/components/test/ChildResultCard';
import ParentActionGuide from '@/components/test/ParentActionGuide';
import ShareSection from '@/components/test/ShareSection';
import OtherTests from '@/components/test/OtherTests';
import ProfileCTA from '@/components/test/ProfileCTA';
import AdSlot from '@/components/common/AdSlot';

const TYPE_ORDER: ChildType[] = ['explorer', 'creative', 'social', 'logical', 'steady', 'perfectionist'];

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
      className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-primary/30 bg-primary/5 text-base font-bold text-primary shadow-sm transition-all hover:bg-primary/10 active:scale-[0.98]"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      결과 이미지 저장
    </button>
  );
}

function ChildResultContent() {
  const searchParams = useSearchParams();
  const primaryParam = (searchParams.get('primary') || 'explorer') as ChildType;
  const secondaryParam = (searchParams.get('secondary') || 'creative') as ChildType;
  const answersParam = searchParams.get('answers') || '';
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    const count = incrementTestCount('child-type');
    setParticipantCount(count);
    const info = childTypes[primary];
    saveProfileResult('child-type', {
      type: primary,
      label: info.label,
      emoji: info.emoji,
      completedAt: new Date().toISOString().slice(0, 10),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {participantCount > 0 && (
          <p className="mb-4 text-center text-sm text-text-secondary">
            🎉 <strong className="text-primary">{participantCount.toLocaleString()}</strong>번째 참여자입니다!
          </p>
        )}

        {/* Result Card */}
        <ChildResultCard
          primaryInfo={primaryInfo}
          secondaryInfo={secondaryInfo}
          primaryPct={percentages[primary]}
          secondaryPct={percentages[secondary]}
        />

        {/* Share — 결과 직후 배치 */}
        <div className="mt-6 space-y-3">
          <ShareSection
            heading="다른 엄마들도 궁금해할 거예요! 🤗"
            subtext="맘카페에서 다른 엄마들과 비교해보세요"
            kakaoTitle={`우리 아이는 ${primaryInfo.animal.split(' ')[0]} ${primaryInfo.label}!`}
            shareUrl="https://smartedu-pick.com/test/child-type"
            twitterText={`우리 아이는 ${primaryInfo.animal.split(' ')[0]} ${primaryInfo.label}! 우리 아이 학습 성향 분석해보기 →`}
          />
          <ChildResultImageGenerator primaryInfo={primaryInfo} secondaryInfo={secondaryInfo} />
        </div>

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

        {/* Profile CTA */}
        <div className="mt-8"><ProfileCTA /></div>

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTests currentTest="child-type" />
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
