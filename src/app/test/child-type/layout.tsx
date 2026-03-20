import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 아이 학습 성향 테스트 | 우리 아이 공부 유형 분석',
  description:
    '무료 아이 학습 성향 테스트! 12개 질문으로 우리 아이의 학습 유형을 분석하고 맞춤 교육법을 확인하세요. 동물 캐릭터로 재미있게 결과를 알려드립니다.',
  keywords: '무료아이학습성향테스트, 자녀공부스타일, 아이교육유형, 자녀학습유형진단, 우리아이학습성향',
  openGraph: {
    title: '무료 아이 학습 성향 테스트 | 우리 아이 공부 유형 분석 - 스마트에듀픽',
    description: '무료 아이 학습 성향 테스트! 12개 질문으로 우리 아이의 학습 유형을 분석하고 맞춤 교육법을 확인하세요.',
    url: 'https://smartedu-pick.com/test/child-type',
  },
};

const quizJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '무료 아이 학습 성향 테스트',
  description: '12개 질문으로 우리 아이의 학습 유형을 분석하는 테스트',
  educationalLevel: '일반',
  numberOfQuestions: 12,
  provider: {
    '@type': 'Organization',
    name: '스마트에듀픽',
    url: 'https://smartedu-pick.com',
  },
};

export default function ChildTypeLayout({ children }: { children: React.ReactNode }) {
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
