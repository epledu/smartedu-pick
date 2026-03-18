import type { Metadata } from 'next';
import Link from 'next/link';
import GuideChecklist from '@/components/guide/GuideChecklist';

export const metadata: Metadata = {
  title: 'AI 활용 가이드 | 입문부터 전문가까지 - 스마트에듀픽',
  description:
    'AI 입문자, 교사, 학부모를 위한 단계별 AI 활용 가이드. 내 레벨에 맞는 학습 경로를 찾아보세요.',
  keywords: 'AI활용가이드, AI입문, 교사AI활용, 학부모AI교육, AI학습로드맵',
};

export default function GuidePage() {
  return (
    <>
      {/* ── Hero: 선택형 진입 ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-3 text-[32px] font-extrabold text-text-primary md:text-4xl">
            어디서부터 시작하면 좋을까요?
          </h1>
          <p className="mb-10 text-base text-text-secondary md:text-lg">
            나에게 맞는 가이드를 찾아보세요
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="#guide-beginner"
              className="group rounded-2xl border-2 border-transparent p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              style={{ backgroundColor: '#ECFDF5' }}
            >
              <span className="mb-4 block text-5xl transition-transform duration-200 group-hover:scale-110">🌱</span>
              <p className="text-lg font-bold text-text-primary">AI가<br />처음이에요</p>
            </a>
            <a
              href="#guide-teacher"
              className="group rounded-2xl border-2 border-transparent p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <span className="mb-4 block text-5xl transition-transform duration-200 group-hover:scale-110">🏫</span>
              <p className="text-lg font-bold text-text-primary">수업에<br />AI를 쓰고 싶어요</p>
            </a>
            <a
              href="#guide-parent"
              className="group rounded-2xl border-2 border-transparent p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              <span className="mb-4 block text-5xl transition-transform duration-200 group-hover:scale-110">👨‍👩‍👧</span>
              <p className="text-lg font-bold text-text-primary">우리 아이<br />교육이 궁금해요</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── 가이드 1: 입문자 — 타임라인형 ── */}
      <section id="guide-beginner" className="scroll-mt-16 py-16 md:py-20" style={{ backgroundColor: '#ECFDF5' }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">입문자 대상</span>
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              🌱 AI가 처음인 분을 위한 시작 가이드
            </h2>
            <p className="text-text-secondary">
              AI를 한 번도 써본 적 없어도 괜찮아요. 4단계면 충분합니다.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative space-y-0 pl-8">
            {/* Line */}
            <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-0.5 bg-emerald-300" />

            {[
              { num: 1, title: 'AI가 뭔지 알아보기', desc: 'AI의 기본 개념을 쉽게 이해합니다. 어렵지 않아요.', link: { label: 'AI 코스웨어란?', href: '/articles/ai-courseware-guide' } },
              { num: 2, title: 'ChatGPT 가입하기', desc: '5분이면 끝나는 무료 가입 방법. 바로 시작할 수 있어요.', link: { label: 'ChatGPT 초보자 가이드', href: '/articles/chatgpt-beginner-guide-2026' } },
              { num: 3, title: '첫 대화 해보기', desc: '"오늘 저녁 뭐 먹을까?" 같은 가벼운 질문부터 시작하세요.', link: null },
              { num: 4, title: '나의 AI 레벨 확인', desc: '지금 어디쯤인지 체크하고 다음 단계를 알아보세요.', link: { label: 'AI 활용 능력 진단 →', href: '/test/ai-literacy' } },
            ].map((step) => (
              <div key={step.num} className="relative flex gap-4 pb-8 last:pb-0">
                <div className="relative z-10 flex h-8 w-8 shrink-0 -translate-x-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md">
                  {step.num}
                </div>
                <div className="-ml-8 flex-1 pt-0.5">
                  <h3 className="mb-1 text-lg font-bold text-text-primary">{step.title}</h3>
                  <p className="mb-2 text-sm text-text-secondary">{step.desc}</p>
                  {step.link && (
                    <Link href={step.link.href} className="inline-flex items-center text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-800">
                      📰 {step.link.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 가이드 2: 교사용 — 카드 스텝형 ── */}
      <section id="guide-teacher" className="scroll-mt-16 py-16 md:py-20" style={{ backgroundColor: '#EFF6FF' }}>
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">교사 대상</span>
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              🏫 수업에 AI를 활용하고 싶은 선생님을 위한 가이드
            </h2>
            <p className="text-text-secondary">
              현직 에듀테크 전문가가 현장 경험을 바탕으로 안내합니다.
            </p>
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { num: 1, title: '이해', desc: 'AI 코스웨어', link: '/articles/ai-courseware-guide', article: 'AI 코스웨어 가이드' },
              { num: 2, title: '활용', desc: '수업에 AI 도구', link: '/articles/teacher-ai-tools-5', article: '교사 AI 도구 5선' },
              { num: 3, title: '평가', desc: '평가에 AI 활용', link: '/articles/ai-courseware-mistakes', article: 'AI 코스웨어 실수' },
              { num: 4, title: '주의', desc: '꼭 알아야 할 것', link: '/articles/ai-courseware-mistakes', article: '실패 사례에서 배우기' },
            ].map((step, i) => (
              <Link
                key={step.num}
                href={step.link}
                className="group relative rounded-2xl border border-blue-200 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
              >
                {i < 3 && (
                  <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-blue-300 md:block">→</span>
                )}
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-1 text-base font-bold text-text-primary group-hover:text-blue-600">{step.title}</h3>
                <p className="mb-2 text-xs text-text-secondary">{step.desc}</p>
                <span className="text-[11px] font-medium text-blue-500">{step.article}</span>
              </Link>
            ))}
          </div>

          {/* Teacher CTA */}
          <div className="mt-8 rounded-2xl bg-white/80 p-6 text-center">
            <p className="mb-3 text-base font-semibold text-text-primary">
              선생님의 학생들은 어떤 유형일까요?
            </p>
            <Link href="/test/learning-style" className="inline-flex h-11 items-center rounded-full bg-blue-500 px-6 text-sm font-bold text-white transition-all hover:bg-blue-600 active:scale-95">
              📋 학습유형 테스트 해보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 가이드 3: 학부모용 — 체크리스트형 ── */}
      <section id="guide-parent" className="scroll-mt-16 py-16 md:py-20" style={{ backgroundColor: '#FFFBEB' }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10">
            <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">학부모 대상</span>
            <h2 className="mb-2 text-2xl font-bold text-text-primary md:text-3xl">
              👨‍👩‍👧 우리 아이 AI 시대 교육이 궁금한 부모님을 위한 가이드
            </h2>
            <p className="text-text-secondary">
              불안하지 않아도 돼요. 이것만 알면 충분합니다.
            </p>
          </div>

          <GuideChecklist />
        </div>
      </section>

      {/* ── 하단 CTA ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#1E293B' }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            아직 잘 모르겠다면, <span className="text-accent">테스트</span>부터 시작하세요
          </h2>
          <p className="mb-8 text-slate-300">2~3분이면 나에게 맞는 방향을 찾을 수 있어요</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: '🤖', title: 'AI 활용 능력 진단', desc: '내 AI 레벨 확인', href: '/test/ai-literacy' },
              { emoji: '📋', title: '학습유형 테스트', desc: '나만의 공부법 찾기', href: '/test/learning-style' },
              { emoji: '👶', title: '아이 학습 성향', desc: '맞춤 교육법 안내', href: '/test/child-type' },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group rounded-2xl bg-slate-700/50 p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-slate-600/50"
              >
                <span className="mb-2 block text-3xl">{t.emoji}</span>
                <h3 className="mb-1 text-base font-bold text-white group-hover:text-accent">{t.title}</h3>
                <p className="text-sm text-slate-300">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
