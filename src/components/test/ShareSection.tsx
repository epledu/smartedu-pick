'use client';

import { useState } from 'react';
import { event as gaEvent } from '@/lib/analytics';
import { shareKakao } from '@/lib/kakao';

interface ShareSectionProps {
  heading: string;
  subtext: string;
  kakaoTitle: string;
  kakaoDescription?: string;
  shareUrl: string;
  twitterText: string;
}

export default function ShareSection({
  heading,
  subtext,
  kakaoTitle,
  kakaoDescription = '스마트에듀픽에서 테스트 해보세요!',
  shareUrl,
  twitterText,
}: ShareSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    gaEvent('share', { method: 'url_copy', content_type: 'test_result' });
    try {
      await navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = typeof window !== 'undefined' ? window.location.href : shareUrl;
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
      title: kakaoTitle,
      description: kakaoDescription,
      linkUrl: shareUrl,
      buttonTitle: '테스트 해보기',
    });
  };

  const handleTwitterShare = () => {
    gaEvent('share', { method: 'twitter', content_type: 'test_result' });
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  return (
    <section className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 text-center md:p-8">
      <h2 className="mb-1 text-xl font-bold text-text-primary md:text-2xl">{heading}</h2>
      <p className="mb-6 text-sm text-text-secondary">{subtext}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {/* 카카오톡 */}
        <button
          onClick={handleKakaoShare}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl px-6 text-base font-bold text-[#3B1E1E] shadow-sm transition-all hover:brightness-95 active:scale-[0.98] sm:w-auto"
          style={{ backgroundColor: '#FEE500' }}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.818 5.117 4.546 6.481-.14.507-.91 3.27-.94 3.482 0 0-.018.152.08.21.098.06.213.028.213.028.28-.04 3.243-2.14 3.756-2.502.74.106 1.51.162 2.345.162 5.523 0 10-3.462 10-7.691C22 6.463 17.523 3 12 3" />
          </svg>
          카카오톡으로 공유
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopyUrl}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-border bg-white px-6 text-base font-bold text-text-primary shadow-sm transition-all hover:border-primary hover:text-primary active:scale-[0.98] sm:w-auto"
        >
          {copied ? (
            <>
              <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              복사 완료!
            </>
          ) : (
            <>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              링크 복사하기
            </>
          )}
        </button>

        {/* X(트위터) */}
        <button
          onClick={handleTwitterShare}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-black px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-[0.98] sm:w-auto"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X에 공유
        </button>
      </div>
    </section>
  );
}
