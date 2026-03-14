'use client';

import { useState } from 'react';

interface NewsletterCTAProps {
  variant?: 'sidebar' | 'bottom';
}

export default function NewsletterCTA({ variant = 'bottom' }: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  if (variant === 'sidebar') {
    return (
      <div className="mt-6 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
        <h3 className="mb-2 text-sm font-bold text-text-primary">📬 뉴스레터</h3>
        <p className="mb-3 text-[13px] text-text-secondary">
          교육 AI 트렌드를 매주 받아보세요.
        </p>
        {submitted ? (
          <p className="text-sm font-semibold text-secondary">✅ 구독 감사합니다!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-secondary focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-secondary/90"
            >
              구독하기
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-secondary/20 bg-secondary/5 p-6 md:p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-text-primary">📬 뉴스레터 구독</h2>
      <p className="mb-4 text-sm text-text-secondary">
        교육 AI 최신 트렌드와 유용한 정보를 매주 이메일로 받아보세요.
      </p>
      {submitted ? (
        <p className="text-base font-semibold text-secondary">✅ 구독해주셔서 감사합니다!</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full border border-border bg-bg px-5 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-secondary focus:outline-none"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-secondary/90"
          >
            무료 구독 →
          </button>
        </form>
      )}
    </section>
  );
}
