import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: '소개',
  description: `${SITE.name}을 소개합니다. 현직 에듀테크 전문가가 운영하는 AI 교육 정보 플랫폼입니다.`,
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-text-primary md:text-4xl">
          스마트에듀픽을 소개합니다
        </h1>

        {/* Site Intro */}
        <section className="mb-12 rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">사이트 소개</h2>
          <p className="leading-relaxed text-text-secondary">
            스마트에듀픽은 현직 에듀테크 전문가가 운영하는 AI 교육 정보 플랫폼입니다.
          </p>
          <p className="mt-3 leading-relaxed text-text-secondary">
            학습유형 테스트, AI 도구 큐레이션, 교육 AI 가이드를 통해 학생·교사·학부모 모두에게
            &ldquo;나에게 딱 맞는 교육&rdquo;을 찾아드립니다.
          </p>
        </section>

        {/* Author Info */}
        <section className="mb-12 rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">운영자 소개</h2>

          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
              <span>🏢</span> 현업 경험
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                에듀테크 기업에서 AI 코스웨어, 맞춤학습 플랫폼 개발
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                전국 200+ 학교에 AI 교육 솔루션 도입 지원
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                AI 기반 생기부 점검, 수행평가 자동 채점 시스템 운영
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
              <span>✍️</span> 콘텐츠 채널
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <a href={SITE.links.blogA} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  교육 AI 전문 블로그 운영
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <a href={SITE.links.blogB} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  AI 활용 정보 블로그 운영
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <a href={SITE.links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  유튜브 채널 운영
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-primary/5 p-4 text-sm text-text-secondary">
            <p>※ 현업에서 직접 경험한 교육 AI 현장의 이야기를 전합니다.</p>
            <p className="mt-2 italic text-text-secondary/70">
              ※ 교육 현장에서 직접 경험한 이야기를 이곳에 기록하고 있습니다.
            </p>
          </div>
        </section>

        {/* Why */}
        <section className="mb-12 rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">왜 이 사이트를 만들었나요?</h2>
          <div className="space-y-3 leading-relaxed text-text-secondary">
            <p>
              에듀테크 회사에서 전국 학교에 AI 교육 솔루션을 도입하는 일을 하고 있습니다.
              현장에서 교사, 학부모, 학생을 만나며 느낀 것은
              &lsquo;좋은 AI 도구와 정보는 많지만, 나에게 맞는 것을 찾기가 어렵다&rsquo;는 것이었습니다.
            </p>
            <p>
              학습유형 테스트로 내 공부 스타일을 파악하고,
              검증된 AI 도구를 추천받고,
              현직자의 시각에서 정리한 교육 AI 가이드를 읽을 수 있는 곳.
              그래서 스마트에듀픽을 만들었습니다.
            </p>
          </div>
        </section>

        {/* Difference */}
        <section className="mb-12 rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-4 text-xl font-bold text-text-primary">다른 사이트와 뭐가 다른가요?</h2>
          <div className="space-y-3 leading-relaxed text-text-secondary">
            <p>
              인터넷에 AI 교육 정보는 넘쳐나지만,
              실제로 학교 현장에서 도입하고 운영해본 사람의 이야기는 드뭅니다.
            </p>
            <p>
              스마트에듀픽의 모든 콘텐츠에는 현장 경험이 담겨 있습니다.
              AI 코스웨어를 학교에 납품하면서 느낀 점,
              교사 연수에서 선생님들이 실제로 고민하는 것,
              학부모 상담에서 반복되는 질문들.
              이런 현장의 목소리가 스마트에듀픽의 차별점입니다.
            </p>
          </div>
        </section>

        {/* Provided Content */}
        <section className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-6 text-xl font-bold text-text-primary">사이트 제공 콘텐츠</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <span className="mb-2 block text-2xl">📋</span>
              <h3 className="mb-1 text-sm font-bold text-text-primary">학습유형·성향 진단 테스트</h3>
              <p className="text-xs text-text-secondary">나에게 맞는 학습법을 찾아보세요</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <span className="mb-2 block text-2xl">🤖</span>
              <h3 className="mb-1 text-sm font-bold text-text-primary">AI 도구 추천 및 비교</h3>
              <p className="text-xs text-text-secondary">용도별 최적의 AI 도구를 추천합니다</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <span className="mb-2 block text-2xl">📰</span>
              <h3 className="mb-1 text-sm font-bold text-text-primary">교육 AI 아티클</h3>
              <p className="text-xs text-text-secondary">트렌드, 활용법, 가이드 제공</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <span className="mb-2 block text-2xl">📚</span>
              <h3 className="mb-1 text-sm font-bold text-text-primary">단계별 AI 활용 가이드</h3>
              <p className="text-xs text-text-secondary">초보부터 전문가까지 단계별 안내</p>
            </div>
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 font-semibold text-white transition-all hover:bg-primary-dark"
          >
            문의하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
