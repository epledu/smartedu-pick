'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { event as gaEvent } from '@/lib/analytics';
import { shareKakao } from '@/lib/kakao';
import { studyMethods } from '@/data/tests/ai-study-method';
import type { StudyMethodType } from '@/data/tests/ai-study-method';
import StudyRoutineCard from '@/components/test/StudyRoutineCard';
import AdSlot from '@/components/common/AdSlot';

const ALL_TYPES: StudyMethodType[] = [
  'prompt-writer', 'visual-noter', 'audio-learner', 'project-doer',
  'quiz-challenger', 'research-diver', 'summary-master', 'creative-maker',
];

function ShareButtons({ primaryInfo }: { primaryInfo: typeof studyMethods[StudyMethodType] }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://smartedu-pick.com/test/ai-study-method';
  const shareText = `나의 AI 공부법은 ${primaryInfo.emoji} ${primaryInfo.label}! AI 공부법 추천 테스트 →`;

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
      title: `나의 AI 공부법은 ${primaryInfo.emoji} ${primaryInfo.label}!`,
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
      <p className="mb-6 text-sm text-text-secondary">나의 AI 공부법을 공유하고 친구와 비교해보세요</p>

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
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      결과 카드 이미지 저장하기
    </button>
  );
}

function OtherTests() {
  const tests = [
    { emoji: '📋', title: '나의 학습유형 테스트', desc: '12개 질문으로 알아보는 나만의 공부 스타일', href: '/test/learning-style' },
    { emoji: '🤖', title: 'AI 활용 능력 진단', desc: '당신의 AI 레벨은? Lv.1~Lv.5', href: '/test/ai-literacy' },
    { emoji: '👶', title: '우리 아이 학습 성향 분석', desc: '아이에게 맞는 교육법을 알아보세요', href: '/test/child-type' },
  ];

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">🎯 다른 테스트도 해보세요</h2>
      <div className="grid gap-4 sm:grid-cols-3">
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
        <Link href="/test" className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white">
          모든 테스트 보기 →
        </Link>
      </div>
    </section>
  );
}

function StudyMethodResultContent() {
  const searchParams = useSearchParams();
  const primaryParam = (searchParams.get('primary') || 'prompt-writer') as StudyMethodType;
  const secondaryParam = (searchParams.get('secondary') || 'visual-noter') as StudyMethodType;

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

        {/* Share + Image */}
        <div className="space-y-4">
          <ShareButtons primaryInfo={primaryInfo} />
          <ResultImageGenerator primaryInfo={primaryInfo} secondaryInfo={secondaryInfo} />
        </div>

        {/* Other Tests */}
        <div className="mt-10">
          <OtherTests />
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
