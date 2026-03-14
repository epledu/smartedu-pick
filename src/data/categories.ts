export interface Category {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'ai-education',
    label: '교육 AI',
    emoji: '🏫',
    description: 'AI 코스웨어, 디지털 교과서, 학교 AI 도입 관련',
  },
  {
    id: 'study-tips',
    label: '학습법',
    emoji: '📚',
    description: '학습유형별 공부법, 자녀 교육법, 효율적 학습 전략',
  },
  {
    id: 'ai-tools',
    label: 'AI 도구',
    emoji: '🤖',
    description: 'ChatGPT, Claude 등 AI 도구 활용법 및 비교',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
