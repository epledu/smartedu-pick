'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { shareKakao } from '@/lib/kakao';
import {
  getAllProfileResults,
  getCompletedCount,
  getAllTestIds,
  getTestMeta,
  generateProfileSummary,
  type ProfileResults,
  type ProfileEntry,
} from '@/lib/profile-generator';

/* ── Profile Image Generator ── */
function ProfileImageGenerator({ results, summary }: { results: ProfileResults; summary: string }) {
  const generate = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600, h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2563EB');
    grad.addColorStop(1, '#7C3AED');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative circles
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.arc(w - 60, 60, 90, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(70, h - 50, 70, 0, Math.PI * 2); ctx.fill();

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 나의 AI 학습 프로필', w / 2, 45);

    // Emojis row
    const entries = Object.values(results).filter((e): e is ProfileEntry => !!e);
    const emojis = entries.map(e => e.emoji);
    ctx.font = '44px serif';
    const emojiWidth = 60;
    const startX = w / 2 - (emojis.length * emojiWidth) / 2 + emojiWidth / 2;
    emojis.forEach((em, i) => {
      ctx.fillText(em, startX + i * emojiWidth, 110);
    });

    // Labels row
    ctx.font = '13px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    entries.forEach((entry: ProfileEntry, i: number) => {
      const shortLabel = entry.label.length > 6 ? entry.label.slice(0, 6) + '…' : entry.label;
      ctx.fillText(shortLabel, startX + i * emojiWidth, 140);
    });

    // Summary
    ctx.font = '16px Pretendard, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    // Wrap text if too long
    const maxWidth = w * 0.8;
    const words = `"${summary}"`;
    if (ctx.measureText(words).width > maxWidth) {
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid);
      const line2 = words.slice(mid);
      ctx.fillText(line1, w / 2, 195);
      ctx.fillText(line2, w / 2, 220);
    } else {
      ctx.fillText(words, w / 2, 205);
    }

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(w * 0.2, 260); ctx.lineTo(w * 0.8, 260); ctx.stroke();

    // Completed count
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '13px Pretendard, sans-serif';
    ctx.fillText(`${entries.length}/5 테스트 완료`, w / 2, 295);

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.fillText('smartedu-pick.com', w / 2, 340);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Pretendard, sans-serif';
    ctx.fillText('나도 프로필 만들기 →', w / 2, 370);

    const link = document.createElement('a');
    link.download = 'AI학습프로필.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [results, summary]);

  return (
    <button
      onClick={generate}
      className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-primary/30 bg-primary/5 text-base font-bold text-primary shadow-sm transition-all hover:bg-primary/10 active:scale-[0.98]"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      프로필 카드 이미지 저장 📸
    </button>
  );
}

/* ── Share Buttons ── */
function ProfileShareButtons({ summary }: { summary: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://smartedu-pick.com/test/my-profile';
  const shareText = `나의 AI 학습 프로필: ${summary} — 스마트에듀픽에서 만들어보세요!`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
        }}
        className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-border bg-surface px-6 text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95"
      >
        {copied ? '✅ 복사됨!' : '🔗 링크 복사'}
      </button>
      <button
        onClick={() => shareKakao({ title: '🎯 나의 AI 학습 프로필', description: summary, linkUrl: shareUrl, buttonTitle: '프로필 만들기' })}
        className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-[#3B1E1E] transition-all hover:brightness-95 active:scale-95"
        style={{ backgroundColor: '#FEE500' }}
      >
        💬 카카오톡
      </button>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
      >
        𝕏 공유
      </button>
    </div>
  );
}

/* ── Main Page ── */
export default function MyProfilePage() {
  const [results, setResults] = useState<ProfileResults>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResults(getAllProfileResults());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin text-4xl">⏳</div>
          <p className="text-text-secondary">프로필을 불러오고 있어요...</p>
        </div>
      </div>
    );
  }

  const completedCount = getCompletedCount(results);
  const allTestIds = getAllTestIds();
  const summary = generateProfileSummary(results);
  const isProfileReady = completedCount >= 3;

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-4">
          <Link href="/test" className="inline-flex items-center text-sm text-text-secondary transition-colors hover:text-primary">
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            테스트 목록
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-text-primary md:text-4xl">
            🎯 나의 AI 학습 프로필
          </h1>
          <p className="text-base text-text-secondary">
            여러 테스트 결과를 종합하여 나만의 프로필을 만들어보세요
          </p>
        </div>

        {/* Progress Bar */}
        <section className="mb-8 rounded-2xl border border-border bg-surface p-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-text-primary">테스트 완료 현황</span>
            <span className="font-bold text-primary">{completedCount}/5 완료</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </section>

        {/* Test Status Cards */}
        <section className="mb-10 space-y-3">
          {allTestIds.map((testId) => {
            const meta = getTestMeta(testId);
            const result = results[testId];

            if (result) {
              return (
                <div key={testId} className="flex items-center gap-4 rounded-2xl border-2 border-secondary/30 bg-secondary/5 p-4 md:p-5">
                  <span className="text-3xl">{result.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-secondary">✅ 완료</span>
                      <span className="text-xs text-text-secondary">{result.completedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-text-primary">{meta.title}</h3>
                    <p className="text-sm text-text-secondary">{result.label}</p>
                  </div>
                  <Link
                    href={meta.href}
                    className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all hover:border-primary hover:text-primary"
                  >
                    결과 보기 →
                  </Link>
                </div>
              );
            }

            return (
              <div key={testId} className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-bg/50 p-4 md:p-5">
                <span className="text-3xl opacity-40">{meta.emoji}</span>
                <div className="flex-1">
                  <span className="text-xs font-bold text-text-secondary">⬜ 미완료</span>
                  <h3 className="text-base font-bold text-text-primary">{meta.title}</h3>
                </div>
                <Link
                  href={meta.startHref}
                  className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-dark"
                >
                  테스트하기 →
                </Link>
              </div>
            );
          })}
        </section>

        {/* Profile Card or Locked Card */}
        {isProfileReady ? (
          <>
            {/* Completed Profile Card */}
            <section className="overflow-hidden rounded-2xl border-2 border-primary shadow-lg">
              <div className="bg-gradient-to-br from-primary to-[#7C3AED] px-6 py-8 text-center text-white md:px-8 md:py-10">
                <h2 className="mb-5 text-lg font-bold text-white/80">🎯 나의 AI 학습 프로필</h2>

                {/* Emoji badges */}
                <div className="mb-5 flex items-center justify-center gap-3">
                  {Object.values(results).filter((e): e is ProfileEntry => !!e).map((entry, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 rounded-xl bg-white/15 px-3 py-3 backdrop-blur-sm">
                      <span className="text-3xl">{entry.emoji}</span>
                      <span className="text-[11px] font-semibold text-white/90">
                        {entry.label.length > 6 ? entry.label.slice(0, 6) + '…' : entry.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <p className="mx-auto max-w-sm text-base leading-relaxed text-white/90">
                  &ldquo;{summary}&rdquo;
                </p>

                <p className="mt-4 text-sm text-white/50">smartedu-pick.com</p>
              </div>
            </section>

            {/* Share & Download */}
            <div className="mt-6 space-y-4">
              <ProfileImageGenerator results={results} summary={summary} />

              <div className="rounded-2xl border border-border bg-surface p-6 text-center">
                <h3 className="mb-2 text-lg font-bold text-text-primary">프로필을 공유하세요!</h3>
                <p className="mb-5 text-sm text-text-secondary">친구와 AI 학습 프로필을 비교해보세요</p>
                <ProfileShareButtons summary={summary} />
              </div>
            </div>
          </>
        ) : (
          <section className="rounded-2xl border-2 border-dashed border-border bg-bg/50 p-8 text-center">
            <span className="mb-3 block text-5xl">🔒</span>
            <h2 className="mb-2 text-xl font-bold text-text-primary">종합 프로필을 완성하세요!</h2>
            <p className="mb-4 text-sm text-text-secondary">
              테스트 <strong className="text-primary">3개 이상</strong> 완료하면<br />
              나만의 AI 학습 프로필 카드가 생성됩니다.
            </p>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold">
              현재: <span className="text-primary">{completedCount}/5</span> 완료
            </div>
            <div>
              {(() => {
                const nextTest = allTestIds.find((id) => !results[id]);
                if (!nextTest) return null;
                const meta = getTestMeta(nextTest);
                return (
                  <Link
                    href={meta.startHref}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95"
                  >
                    다음 테스트 하러 가기 →
                  </Link>
                );
              })()}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
