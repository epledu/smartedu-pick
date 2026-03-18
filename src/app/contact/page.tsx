'use client';

import { useState } from 'react';
import { SITE } from '@/lib/constants';

const INQUIRY_TYPES = [
  { value: 'general', label: '일반 문의' },
  { value: 'content', label: '콘텐츠 제안' },
  { value: 'ad', label: '광고 문의' },
  { value: 'other', label: '기타' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '이름을 입력해주세요.';
    if (!email.trim()) errs.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = '올바른 이메일 형식이 아닙니다.';
    if (!message.trim()) errs.message = '메시지를 입력해주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const typeLabel = INQUIRY_TYPES.find((t) => t.value === type)?.label || '일반 문의';
    const subject = encodeURIComponent(`[스마트에듀픽 문의] ${typeLabel}`);
    const body = encodeURIComponent(
      `${name}님의 문의\n\n${message}\n\n회신 이메일: ${email}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  const inputClass = (field: string) =>
    `h-11 w-full rounded-lg border bg-bg px-4 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-1 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-border focus:border-primary focus:ring-primary'
    }`;

  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-text-primary md:text-4xl">
          문의하기
        </h1>
        <p className="mb-12 text-center text-text-secondary">
          궁금한 점이 있으시면 언제든 문의해 주세요.
        </p>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Contact Info */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-text-primary">연락 방법</h2>
            <div className="rounded-xl border border-border bg-surface p-4">
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="mb-1 block font-semibold text-text-primary">📧 이메일</span>
                  <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <span className="mb-1 block font-semibold text-text-primary">📝 교육AI 블로그</span>
                  <a href={SITE.links.blogA} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
                    blog.naver.com/gkseogur77
                  </a>
                </li>
                <li>
                  <span className="mb-1 block font-semibold text-text-primary">📝 AI활용 블로그</span>
                  <a href={SITE.links.blogB} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
                    blog.naver.com/nexttzp
                  </a>
                </li>
                <li>
                  <span className="mb-1 block font-semibold text-text-primary">🎬 유튜브</span>
                  <a href={SITE.links.youtube} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
                    youtube.com/@YOULIFE-IT
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <h2 className="mb-4 text-lg font-bold text-text-primary">문의 양식</h2>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-primary">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                  className={inputClass('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="회신받을 이메일을 입력하세요"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  className={inputClass('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-text-primary">
                  문의 유형
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-text-primary">
                  메시지 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="문의 내용을 입력하세요"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
                  className={`w-full rounded-lg border bg-bg px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-1 ${
                    errors.message
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-primary font-semibold text-white transition-colors hover:bg-primary-dark active:scale-[0.98]"
              >
                보내기
              </button>

              <p className="text-xs leading-relaxed text-text-secondary">
                보내기 버튼을 누르면 메일 앱이 열립니다.
                메일 앱이 설정되어 있지 않다면{' '}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-primary hover:underline">
                  {SITE.email}
                </a>
                으로 직접 보내주세요.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
