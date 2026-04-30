import type { Metadata } from 'next';
import ChildResultClient from './ChildResultClient';

export const metadata: Metadata = {
  title: '우리 아이 학습 성향 분석 결과 | 스마트에듀픽',
  description:
    '우리 아이 학습 성향 분석 결과를 확인하세요. 탐험가형, 창의가형, 사회형 등 6가지 성향과 맞춤 교육법 가이드.',
  keywords: '아이학습성향결과, 자녀학습유형, 아이교육성향분석, 맞춤교육법, 부모가이드',
  openGraph: {
    title: '우리 아이 학습 성향 분석 결과 | 스마트에듀픽',
    description: '우리 아이의 학습 성향과 맞춤 교육법을 확인하세요.',
    url: 'https://smartedu-pick.com/test/child-type/result',
  },
  // See sibling result pages — noindex because direct crawls hit the empty
  // template; real content needs test answers from the user flow.
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  alternates: { canonical: 'https://smartedu-pick.com/test/child-type' },
};

export default function ChildResultPage() {
  return <ChildResultClient />;
}
