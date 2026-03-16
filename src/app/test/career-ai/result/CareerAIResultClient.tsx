'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { event as gaEvent } from '@/lib/analytics';
import { shareKakao } from '@/lib/kakao';
import { careerAITypes } from '@/data/tests/career-ai';
import type { CareerAIType } from '@/data/tests/career-ai';
import CareerAIScore from '@/components/test/CareerAIScore';
import AdSlot from '@/components/common/AdSlot';

const ALL_TYPES: CareerAIType[] = ['creator', 'strategist', 'connector', 'analyst', 'educator', 'builder'];

/* ─── ShareButtons ─── */
function ShareButtons({ primaryInfo }: { primaryInfo: (typeof careerAITypes)[CareerAIType] }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://smartedu-pick.com/test/career-ai';
  const shareText = `나는 ${primaryInfo.emoji} ${primaryInfo.label}! AI 시대 직업 적성 테스트 →`;

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
      title: `나는 ${primaryInfo.emoji} ${primaryInfo.label}!`,
      description: `AI 대체 안전도 ${primaryInfo.aiSafetyScore}/10! 스마트에듀픽에서 테스트 해보세요`,
      linkUrl: shareUrl,
      buttonTitle: '테스트 해보기',
    });
  };

  const handleTwitterShare = () => {
    gaEvent('share', { method: 'twitter', content_type: 'test_result' });
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center md:p-8">
      <h2 className="mb-2 text-xl font-bold text-text-primary">친구에게도 알려주세요!</h2>
      <p className="mb-6 text-sm text-text-secondary">나의 AI 시대 직업 유형을 공유하고 비교해보세요</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={handleCopyUrl} className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-border bg-surface px-6 text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95">
          {copied ? (
            <><svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>복사되었습니다!</>
          ) : (
            <><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>URL 복사</>
          )}
        </button>
        <button onClick={handleKakaoShare} className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-[#3B1E1E] transition-all hover:brightness-95 active:scale-95" style={{ backgroundColor: '#FEE500' }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.818 5.117 4.546 6.481-.14.507-.91 3.27-.94 3.482 0 0-.018.152.08.21.098.06.213.028.213.028.28-.04 3.243-2.14 3.756-2.502.74.106 1.51.162 2.345.162 5.523 0 10-3.462 10-7.691C22 6.463 17.523 3 12 3" /></svg>
          카카오톡
        </button>
        <button onClick={handleTwitterShare} className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-95">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          트위터
        </button>
      </div>
    </section>
  );
}

/* ─── ResultImageGenerator ─── */
function ResultImageGenerator({ primaryInfo }: { primaryInfo: (typeof careerAITypes)[CareerAIType] }) {
  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = 600, h = 400;
    canvas.width = w; canvas.height = h;

    ctx.fillStyle = primaryInfo.color;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.arc(w - 50, 60, 90, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(60, h - 30, 70, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('스마트에듀픽 AI 시대 직업 적성 테스트', w / 2, 40);

    ctx.font = '52px serif';
    ctx.fillText(primaryInfo.emoji, w / 2, 110);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px Pretendard, sans-serif';
    ctx.fillText(primaryInfo.label, w / 2, 160);

    ctx.font = '15px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`"${primaryInfo.shortDesc}"`, w / 2, 195);

    // scores
    const barY = 230;
    const barW = 300;
    const barH = 18;
    const startX = (w - barW) / 2;

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 13px Pretendard, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🛡️ AI 대체 안전도  ${primaryInfo.aiSafetyScore}/10`, startX, barY);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(startX, barY + 6, barW, barH);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX, barY + 6, barW * (primaryInfo.aiSafetyScore / 10), barH);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(`🤝 AI 협업 시너지  ${primaryInfo.aiSynergyScore}/10`, startX, barY + 55);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(startX, barY + 61, barW, barH);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX, barY + 61, barW * (primaryInfo.aiSynergyScore / 10), barH);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '13px Pretendard, sans-serif';
    ctx.fillText('smartedu-pick.com', w / 2, 355);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Pretendard, sans-serif';
    ctx.fillText('나도 테스트 해보기 →', w / 2, 380);

    const link = document.createElement('a');
    link.download = `AI직업적성-${primaryInfo.label}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [primaryInfo]);

  return (
    <button onClick={generateImage} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      결과 카드 이미지 저장하기
    </button>
  );
}

/* ─── OtherTests ─── */
function OtherTests() {
  const tests = [
    { emoji: '📋', title: '나의 학습유형 테스트', desc: '12개 질문으로 알아보는 나만의 공부 스타일', href: '/test/learning-style' },
    { emoji: '🤖', title: 'AI 활용 능력 진단', desc: '당신의 AI 레벨은? Lv.1~Lv.5', href: '/test/ai-literacy' },
    { emoji: '🧠', title: 'AI 공부법 추천', desc: 'AI 도구+학습법 조합 나만의 루틴', href: '/test/ai-study-method' },
  ];
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">🎯 다른 테스트도 해보세요</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {tests.map((t) => (
          <Link key={t.title} href={t.href} className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">
            <span className="mb-2 block text-3xl">{t.emoji}</span>
            <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-primary">{t.title}</h3>
            <p className="mb-3 text-sm text-text-secondary">{t.desc}</p>
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">테스트 시작 →</span>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/test" className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white">모든 테스트 보기 →</Link>
      </div>
    </section>
  );
}

/* ─── Main Content ─── */
function CareerAIResultContent() {
  const searchParams = useSearchParams();
  const primaryParam = (searchParams.get('primary') || 'creator') as CareerAIType;
  const secondaryParam = (searchParams.get('secondary') || 'strategist') as CareerAIType;

  const primary = careerAITypes[primaryParam] ? primaryParam : 'creator';
  const secondary = careerAITypes[secondaryParam] ? secondaryParam : (primary === 'creator' ? 'strategist' : 'creator');

  const primaryInfo = careerAITypes[primary];
  const secondaryInfo = careerAITypes[secondary];

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back */}
        <div className="mb-6">
          <Link href="/test/career-ai" className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary">
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            다시 테스트하기
          </Link>
        </div>

        {/* ① Result Card */}
        <section className="overflow-hidden rounded-2xl border-2 text-center shadow-lg" style={{ borderColor: primaryInfo.color }}>
          <div className="px-6 py-8 md:px-8 md:py-10" style={{ backgroundColor: primaryInfo.bgColor }}>
            <span className="mb-3 block text-6xl">{primaryInfo.emoji}</span>
            <h1 className="mb-2 text-2xl font-extrabold text-text-primary md:text-3xl">{primaryInfo.label}</h1>
            <p className="mb-4 text-base font-medium" style={{ color: primaryInfo.color }}>{primaryInfo.shortDesc}</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm">
              <span style={{ color: secondaryInfo.color }}>{secondaryInfo.emoji}</span>
              <span className="text-text-secondary">서브: <strong className="text-text-primary">{secondaryInfo.label}</strong></span>
            </div>
          </div>
        </section>

        {/* ② AI Score 2-axis */}
        <div className="mt-8">
          <CareerAIScore info={primaryInfo} />
        </div>

        {/* Ad 1 */}
        <AdSlot className="my-8" />

        {/* ③ Description */}
        <section className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">{primaryInfo.emoji} {primaryInfo.label} 상세 분석</h2>
          <div className="space-y-3 text-[15px] leading-relaxed text-text-secondary md:text-base">
            {primaryInfo.description.split('\n\n').map((p, i) => <p key={i}>{p.trim()}</p>)}
          </div>
        </section>

        {/* Expert Tip */}
        <section className="mt-6 rounded-2xl border-2 p-6 md:p-8" style={{ borderColor: primaryInfo.color + '40', backgroundColor: primaryInfo.bgColor }}>
          <h3 className="mb-3 text-lg font-bold text-text-primary">전문가 팁</h3>
          <p className="text-[15px] leading-relaxed text-text-secondary md:text-base">{primaryInfo.expertTip}</p>
        </section>

        {/* ④ Fit Careers */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">🏢 어울리는 직업/역할</h2>
          <div className="space-y-4">
            {primaryInfo.fitCareers.map((career, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="border-b border-border px-5 py-3" style={{ backgroundColor: primaryInfo.bgColor }}>
                  <h3 className="text-base font-bold" style={{ color: primaryInfo.color }}>{career.title}</h3>
                </div>
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-4">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-text-secondary">🤖 AI의 역할</span>
                    <p className="text-sm leading-relaxed text-text-secondary">{career.aiRole}</p>
                  </div>
                  <div className="p-4">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-text-secondary">👤 인간의 역할</span>
                    <p className="text-sm leading-relaxed text-text-primary font-medium">{career.humanRole}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ⑤ Growth Path Timeline */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">🚀 커리어 성장 경로</h2>
          <div className="relative rounded-2xl border border-border bg-surface p-6 md:p-8">
            {[
              { label: '지금', emoji: '📍', text: primaryInfo.growthPath.now },
              { label: '6개월 후', emoji: '🎯', text: primaryInfo.growthPath.sixMonths },
              { label: '1년 후', emoji: '🏆', text: primaryInfo.growthPath.oneYear },
            ].map((step, i) => (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {i < 2 && (
                  <div className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-0.5" style={{ backgroundColor: primaryInfo.color + '20' }} />
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: primaryInfo.bgColor }}>
                  {step.emoji}
                </div>
                <div className="flex-1 pt-1">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider" style={{ color: primaryInfo.color }}>{step.label}</span>
                  <p className="text-sm leading-relaxed text-text-primary md:text-[15px]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ⑥ Skills + Tools */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">💪 키워야 할 스킬</h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {primaryInfo.recommendedSkills.map((skill) => (
              <span key={skill} className="rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ backgroundColor: primaryInfo.bgColor, color: primaryInfo.color }}>
                {skill}
              </span>
            ))}
          </div>
          <h3 className="mb-4 text-lg font-bold text-text-primary">🤖 추천 AI 도구</h3>
          <div className="space-y-3">
            {primaryInfo.recommendedTools.map((tool, i) => (
              <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: primaryInfo.bgColor }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-primary">{tool.name} <span className="text-xs text-text-secondary">↗</span></h4>
                  <p className="text-xs text-text-secondary">{tool.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* All Types Overview */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-text-primary">📊 6가지 AI 시대 직업 성향</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ALL_TYPES.map((t) => {
              const info = careerAITypes[t];
              const isCurrent = t === primary;
              return (
                <div key={t} className={`rounded-xl p-3 text-center transition-all ${isCurrent ? 'scale-105 shadow-md' : 'opacity-60'}`} style={{ backgroundColor: isCurrent ? info.bgColor : '#F9FAFB', border: isCurrent ? `2px solid ${info.color}` : '2px solid transparent' }}>
                  <span className="block text-2xl">{info.emoji}</span>
                  <span className="mt-1 block text-[10px] font-semibold leading-tight" style={{ color: isCurrent ? info.color : '#9CA3AF' }}>{info.label.replace('AI ', '').replace('AI시대 ', '')}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ad 2 */}
        <AdSlot className="my-8" />

        {/* Share + Image */}
        <div className="space-y-4">
          <ShareButtons primaryInfo={primaryInfo} />
          <ResultImageGenerator primaryInfo={primaryInfo} />
        </div>

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTests />
        </div>

        {/* Legal Notice */}
        <div className="mt-8 rounded-xl bg-gray-50 p-4 text-center text-xs text-text-secondary">
          <p>⚠️ 이 테스트는 재미와 참고를 위한 것으로, 전문적인 진로 상담을 대체하지 않습니다.</p>
          <p className="mt-1">정확한 진로 설계를 위해서는 전문 상담사와의 상담을 권장합니다.</p>
        </div>
      </div>
    </div>
  );
}

export default function CareerAIResultClient() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin text-4xl">⏳</div>
          <p className="text-text-secondary">결과를 불러오고 있어요...</p>
        </div>
      </div>
    }>
      <CareerAIResultContent />
    </Suspense>
  );
}
