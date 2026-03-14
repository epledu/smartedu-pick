import type { Metadata } from 'next';
import AIResultClient from './AIResultClient';

export const metadata: Metadata = {
  title: 'AI 활용 능력 진단 결과 | 스마트에듀픽',
  description:
    'AI 활용 능력 진단 결과를 확인하세요. Lv.1~Lv.5 중 나의 AI 레벨과 맞춤 레벨업 방법을 알아보세요.',
  keywords: 'AI활용능력결과, AI레벨, AI리터러시진단, AI역량테스트결과',
  openGraph: {
    title: 'AI 활용 능력 진단 결과 | 스마트에듀픽',
    description: '나의 AI 활용 레벨과 맞춤 레벨업 방법을 확인하세요.',
    url: 'https://smartedu-pick.com/test/ai-literacy/result',
  },
};

export default function AIResultPage() {
  return <AIResultClient />;
}
