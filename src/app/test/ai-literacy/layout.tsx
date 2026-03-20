import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '무료 AI 활용 능력 테스트 | 나의 AI 레벨 진단',
  description:
    '무료 AI 활용 능력 테스트로 나의 AI 레벨을 확인하세요. Lv.1 입문부터 Lv.5 전문가까지, 10개 문항으로 AI 활용 수준을 진단합니다.',
  keywords: '무료AI활용능력테스트, AI레벨테스트, AI리터러시, 인공지능활용, AI역량진단',
  openGraph: {
    title: '무료 AI 활용 능력 테스트 | 나의 AI 레벨 진단 - 스마트에듀픽',
    description: '무료 AI 활용 능력 테스트로 나의 AI 레벨을 확인하세요. Lv.1 입문부터 Lv.5 전문가까지, 10개 문항으로 AI 활용 수준을 진단합니다.',
    url: 'https://smartedu-pick.com/test/ai-literacy',
  },
};

const quizJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '무료 AI 활용 능력 테스트',
  description: '나의 AI 활용 수준을 Lv.1~Lv.5로 진단하는 테스트',
  educationalLevel: '일반',
  numberOfQuestions: 10,
  provider: {
    '@type': 'Organization',
    name: '스마트에듀픽',
    url: 'https://smartedu-pick.com',
  },
};

export default function AILiteracyLayout({ children }: { children: React.ReactNode }) {
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
