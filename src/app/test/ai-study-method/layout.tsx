import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 AI 공부법 추천 테스트 | 나만의 AI 학습 루틴',
  description:
    '무료 AI 공부법 테스트로 나에게 맞는 AI 학습 루틴을 찾아보세요. 프롬프트 작성형, 영상 요약형 등 8가지 유형 중 최적의 공부법을 추천합니다.',
  keywords: '무료AI공부법테스트, AI학습루틴, AI공부법추천, AI학습방법, AI활용공부',
  openGraph: {
    title: '무료 AI 공부법 추천 테스트 | 나만의 AI 학습 루틴 - 스마트에듀픽',
    description: '무료 AI 공부법 테스트로 나에게 맞는 AI 학습 루틴을 찾아보세요. 8가지 유형 중 최적의 공부법을 추천합니다.',
    url: 'https://smartedu-pick.com/test/ai-study-method',
  },
};

const quizJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '무료 AI 공부법 추천 테스트',
  description: 'AI 도구와 학습법 조합으로 나만의 AI 학습 루틴을 찾아주는 테스트',
  educationalLevel: '일반',
  numberOfQuestions: 10,
  provider: {
    '@type': 'Organization',
    name: '스마트에듀픽',
    url: 'https://smartedu-pick.com',
  },
};

export default function AIStudyMethodLayout({ children }: { children: React.ReactNode }) {
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
