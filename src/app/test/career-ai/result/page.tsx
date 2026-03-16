import type { Metadata } from 'next';
import CareerAIResultClient from './CareerAIResultClient';

export const metadata: Metadata = {
  title: 'AI 시대 직업 적성 테스트 결과 | 스마트에듀픽',
  description:
    'AI 시대 나에게 맞는 직업 적성 결과를 확인하세요. AI 대체 안전도와 AI 협업 시너지를 분석합니다.',
  keywords: 'AI시대직업테스트, AI대체직업, 미래직업적성, AI직업적성, AI시대진로',
  openGraph: {
    title: 'AI 시대 직업 적성 테스트 결과 | 스마트에듀픽',
    description: 'AI 대체 안전도와 AI 협업 시너지를 확인하세요.',
    url: 'https://smartedu-pick.com/test/career-ai/result',
  },
};

export default function ResultPage() {
  return <CareerAIResultClient />;
}
