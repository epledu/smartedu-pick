import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '우리 아이 학습 성향 분석 | 스마트에듀픽',
  description:
    '12개 질문으로 알아보는 우리 아이만의 학습 성향. 탐험가형, 창의가형, 사회형 등 6가지 성향 분석과 맞춤 교육법.',
  keywords: '아이학습성향테스트, 자녀공부스타일, 아이교육유형, 자녀학습유형진단, 우리아이학습성향',
  openGraph: {
    title: '우리 아이 학습 성향 분석 | 스마트에듀픽',
    description: '12개 질문으로 알아보는 우리 아이만의 학습 성향. 6가지 성향 분석과 맞춤 교육법 가이드.',
    url: 'https://smartedu-pick.com/test/child-type',
  },
};

export default function ChildTypeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
