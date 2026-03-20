import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 학습유형 테스트 | 나에게 맞는 공부법 찾기',
  description:
    '무료 학습유형 테스트로 나만의 공부 스타일을 알아보세요. 시각형·청각형·실행형·분석형 4가지 유형 중 나에게 맞는 학습법을 3분 만에 진단합니다.',
  keywords: '무료학습유형테스트, 공부스타일테스트, 학습성향진단, 나에게맞는공부법, 학습유형진단',
  openGraph: {
    title: '무료 학습유형 테스트 | 나에게 맞는 공부법 찾기 - 스마트에듀픽',
    description: '무료 학습유형 테스트로 나만의 공부 스타일을 알아보세요. 시각형·청각형·실행형·분석형 4가지 유형 중 나에게 맞는 학습법을 3분 만에 진단합니다.',
    url: 'https://smartedu-pick.com/test/learning-style',
  },
};

const quizJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '무료 학습유형 테스트',
  description: '나에게 맞는 공부법을 찾아주는 학습유형 진단 테스트',
  educationalLevel: '일반',
  numberOfQuestions: 12,
  provider: {
    '@type': 'Organization',
    name: '스마트에듀픽',
    url: 'https://smartedu-pick.com',
  },
};

export default function LearningStyleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      {children}
    </>
  );
}
