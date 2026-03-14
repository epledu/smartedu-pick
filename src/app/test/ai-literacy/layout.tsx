import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 활용 능력 진단 | 스마트에듀픽',
  description:
    '10개 질문으로 알아보는 나의 AI 활용 레벨. Lv.1 입문자부터 Lv.5 전문가까지, 당신의 AI 능력을 진단해보세요.',
  keywords: 'AI활용능력진단, AI레벨테스트, AI리터러시, 인공지능활용, AI역량진단',
  openGraph: {
    title: 'AI 활용 능력 진단 | 스마트에듀픽',
    description: '10개 질문으로 알아보는 나의 AI 활용 레벨. 당신의 AI 능력은 몇 레벨?',
    url: 'https://smartedu-pick.com/test/ai-literacy',
  },
};

export default function AILiteracyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
