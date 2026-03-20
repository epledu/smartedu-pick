import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나의 AI 학습 프로필 | 테스트 종합 결과',
  description:
    '스마트에듀픽 테스트 결과를 종합한 나만의 AI 학습 프로필을 확인하세요.',
  openGraph: {
    title: '나의 AI 학습 프로필 | 테스트 종합 결과 - 스마트에듀픽',
    description: '스마트에듀픽 테스트 결과를 종합한 나만의 AI 학습 프로필을 확인하세요.',
    url: 'https://smartedu-pick.com/test/my-profile',
  },
};

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
