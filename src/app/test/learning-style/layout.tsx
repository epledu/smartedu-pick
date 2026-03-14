import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나의 학습유형 테스트',
  description:
    '12개 질문으로 알아보는 나만의 공부 스타일. 시각형, 청각형, 실행형, 분석형 중 나는 어떤 유형?',
  keywords: '학습유형테스트, 공부스타일테스트, 학습성향진단, 나에게맞는공부법',
  openGraph: {
    title: '나의 학습유형 테스트 | 스마트에듀픽',
    description: '12개 질문으로 알아보는 나만의 공부 스타일. 시각형, 청각형, 실행형, 분석형 중 나는 어떤 유형?',
    url: 'https://smartedu-pick.com/test/learning-style',
  },
};

export default function LearningStyleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
