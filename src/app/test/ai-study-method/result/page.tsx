import type { Metadata } from 'next';
import StudyMethodResultClient from './StudyMethodResultClient';

export const metadata: Metadata = {
  title: 'AI 공부법 추천 결과 | 스마트에듀픽',
  description:
    '나에게 맞는 AI 공부법 결과를 확인하세요. AI 도구와 학습법을 조합한 나만의 학습 루틴을 알아보세요.',
  keywords: 'AI공부법추천, AI학습법테스트, 나에게맞는공부법, AI학습루틴',
  openGraph: {
    title: 'AI 공부법 추천 결과 | 스마트에듀픽',
    description: '나만의 AI 학습 루틴과 추천 도구를 확인하세요.',
    url: 'https://smartedu-pick.com/test/ai-study-method/result',
  },
  // Direct crawl sees an empty template; the real content depends on test
  // answers stored in URL params/localStorage. Noindex keeps it out of
  // Search Console while OG still works for shares.
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  alternates: { canonical: 'https://smartedu-pick.com/test/ai-study-method' },
};

export default function ResultPage() {
  return <StudyMethodResultClient />;
}
