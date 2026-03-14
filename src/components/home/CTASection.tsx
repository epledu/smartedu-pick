'use client';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
          매주 월요일, AI 교육 트렌드를 메일로 받아보세요
        </h2>
        <p className="mb-8 text-blue-100">
          교육 AI 뉴스, 추천 도구, 활용 팁을 정리해서 보내드립니다.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            className="h-12 flex-1 rounded-full border-0 bg-white/20 px-6 text-white placeholder-blue-200 backdrop-blur-sm focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-accent px-8 font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl"
          >
            구독하기
          </button>
        </form>
        <p className="mt-4 text-xs text-blue-200">스팸 없이, 언제든 구독 해지 가능합니다.</p>
      </div>
    </section>
  );
}
