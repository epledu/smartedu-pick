'use client';

import { useState } from 'react';
import { event as gaEvent } from '@/lib/analytics';

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export default function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://smartedu-pick.com/articles/${slug}`;
  const shareText = `${title} | 스마트에듀픽`;

  const handleCopy = async () => {
    gaEvent('share', { method: 'url_copy', content_type: 'article' });
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-text-secondary">공유:</span>
      <button
        onClick={handleCopy}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-xs font-semibold text-text-primary transition-all hover:border-primary hover:text-primary active:scale-95"
      >
        {copied ? '✓ 복사됨' : '🔗 URL'}
      </button>
      <button
        onClick={() => {
          gaEvent('share', { method: 'kakao', content_type: 'article' });
          window.open(
            `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            '_blank',
            'width=600,height=400'
          );
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#3B1E1E] transition-all hover:brightness-95 active:scale-95"
        style={{ backgroundColor: '#FEE500' }}
      >
        💬 카카오톡
      </button>
      <button
        onClick={() => {
          gaEvent('share', { method: 'twitter', content_type: 'article' });
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
          );
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black px-4 text-xs font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
      >
        𝕏 트위터
      </button>
    </div>
  );
}
