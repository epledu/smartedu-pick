'use client';

import { SITE } from '@/lib/constants';

export default function ContactPage() {
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
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4 rounded-xl border border-border bg-surface p-6"
            >
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-primary">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-text-primary">
                  문의 유형
                </label>
                <select
                  id="type"
                  className="h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="general">일반 문의</option>
                  <option value="content">콘텐츠 제안</option>
                  <option value="ad">광고 문의</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-text-primary">
                  메시지
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="문의 내용을 입력하세요"
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-primary font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                보내기
              </button>
              <p className="text-xs text-text-secondary">
                * 문의 폼은 현재 준비 중입니다. 이메일로 직접 문의해 주세요.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
