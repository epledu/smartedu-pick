import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${SITE.name}의 개인정보처리방침입니다.`,
};

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-text-primary md:text-4xl">
          개인정보처리방침
        </h1>
        <p className="mb-12 text-center text-sm text-text-secondary">시행일: 2026년 3월 14일</p>

        <div className="space-y-10 rounded-2xl border border-border bg-surface p-8">
          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">1. 개인정보 수집 항목</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span><strong>테스트 이용 시:</strong> 수집하지 않음 (비회원 이용)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span><strong>뉴스레터 구독 시:</strong> 이메일 주소</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span><strong>문의 시:</strong> 이름, 이메일, 메시지 내용</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">2. 수집 목적</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                뉴스레터 발송
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                문의 응대
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">3. 보유 기간</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                뉴스레터: 구독 해지 시 즉시 파기
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                문의: 응대 완료 후 1년간 보관 후 파기
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">4. 제3자 제공</h2>
            <p className="mb-3 text-sm text-text-secondary">
              다음의 제3자 서비스를 이용하며, 해당 서비스의 개인정보처리방침에 따릅니다.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span><strong>Google Analytics:</strong> 웹사이트 이용 통계 분석</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span><strong>Google AdSense:</strong> 맞춤형 광고 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span><strong>스티비:</strong> 뉴스레터 발송 대행</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">5. 쿠키 사용 안내</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                Google AdSense는 광고 개인화를 위해 쿠키를 사용할 수 있습니다.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                Google Analytics는 방문자 분석을 위해 쿠키를 사용합니다.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                브라우저 설정에서 쿠키 사용을 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">6. 이용자 권리</h2>
            <p className="text-sm text-text-secondary">
              이용자는 언제든지 개인정보의 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
              아래 연락처를 통해 요청해 주세요.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-text-primary">7. 연락처</h2>
            <p className="text-sm text-text-secondary">
              개인정보 관련 문의: <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
