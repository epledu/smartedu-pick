'use client';

import { useCallback } from 'react';
import type { LearningTypeInfo } from '@/data/tests/learning-style';

interface ResultImageGeneratorProps {
  typeInfo: LearningTypeInfo;
}

export default function ResultImageGenerator({ typeInfo }: ResultImageGeneratorProps) {
  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = typeInfo.color;
    ctx.fillRect(0, 0, w, h);

    // Decorative circles
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(w - 50, 50, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(80, h - 40, 60, 0, Math.PI * 2);
    ctx.fill();

    // Header text
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '16px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('스마트에듀픽 학습유형 테스트', w / 2, 50);

    // Emoji (text fallback)
    ctx.font = '64px serif';
    ctx.fillText(typeInfo.emoji, w / 2, 140);

    // Result label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Pretendard, sans-serif';
    ctx.fillText(`나는 ${typeInfo.label}!`, w / 2, 210);

    // Short description
    ctx.font = '18px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`"${typeInfo.shortDesc}"`, w / 2, 250);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, 290);
    ctx.lineTo(w * 0.8, 290);
    ctx.stroke();

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px Pretendard, sans-serif';
    ctx.fillText('smartedu-pick.com', w / 2, 330);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Pretendard, sans-serif';
    ctx.fillText('나도 테스트 해보기 →', w / 2, 360);

    // Download
    const link = document.createElement('a');
    link.download = `학습유형테스트-${typeInfo.label}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [typeInfo]);

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
