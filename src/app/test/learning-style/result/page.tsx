import type { Metadata } from 'next';
import ResultPageClient from './ResultPageClient';

export const metadata: Metadata = {
  title: '학습유형 테스트 결과 | 스마트에듀픽',
  description:
    '나의 학습유형 테스트 결과를 확인하세요. 시각형, 청각형, 실행형, 분석형 중 나에게 맞는 공부법과 추천 AI 도구를 알아보세요.',
  keywords: '학습유형테스트결과, 공부스타일, 학습성향분석, 맞춤학습법, AI도구추천',
  openGraph: {
    title: '나의 학습유형 테스트 결과 | 스마트에듀픽',
    description: '나에게 맞는 공부법과 추천 AI 도구를 확인하세요.',
    url: 'https://smartedu-pick.com/test/learning-style/result',
  },
};

export default function ResultPage() {
  return <ResultPageClient />;
}
