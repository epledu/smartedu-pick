import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 AI 시대 직업 적성 테스트 | AI 대체 안전도 진단',
  description:
    '무료 AI 직업 적성 테스트! AI 대체 안전도와 AI 협업 시너지를 분석하고 AI 시대에 맞는 커리어 방향을 확인하세요.',
  keywords: '무료AI직업적성테스트, AI대체안전도, AI시대직업, AI커리어진단, 직업적성테스트',
  openGraph: {
    title: '무료 AI 시대 직업 적성 테스트 | AI 대체 안전도 진단 - 스마트에듀픽',
    description: '무료 AI 직업 적성 테스트! AI 대체 안전도와 AI 협업 시너지를 분석하고 AI 시대에 맞는 커리어 방향을 확인하세요.',
    url: 'https://smartedu-pick.com/test/career-ai',
  },
};

const quizJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '무료 AI 시대 직업 적성 테스트',
  description: 'AI 대체 안전도와 AI 협업 시너지를 분석하는 직업 적성 테스트',
  educationalLevel: '일반',
  numberOfQuestions: 12,
  provider: {
    '@type': 'Organization',
    name: '스마트에듀픽',
    url: 'https://smartedu-pick.com',
  },
};

export default function CareerAILayout({ children }: { children: React.ReactNode }) {
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
