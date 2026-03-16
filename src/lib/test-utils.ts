import type { LearningType } from '@/data/tests/learning-style';
import type { AILevel } from '@/data/tests/ai-literacy';
import { LEVEL_RANGES, LEVEL_SCORE_RANGES } from '@/data/tests/ai-literacy';
import type { ChildType } from '@/data/tests/child-type';
import type { StudyMethodType } from '@/data/tests/ai-study-method';
import type { CareerAIType } from '@/data/tests/career-ai';

export function calculateResult(answers: LearningType[]): LearningType {
  const scores: Record<LearningType, number> = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    analytical: 0,
  };

  answers.forEach((type) => {
    scores[type]++;
  });

  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as LearningType;
}

export function getScorePercentages(answers: LearningType[]): Record<LearningType, number> {
  const scores: Record<LearningType, number> = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    analytical: 0,
  };

  answers.forEach((type) => {
    scores[type]++;
  });

  const total = answers.length || 1;
  return {
    visual: Math.round((scores.visual / total) * 100),
    auditory: Math.round((scores.auditory / total) * 100),
    kinesthetic: Math.round((scores.kinesthetic / total) * 100),
    analytical: Math.round((scores.analytical / total) * 100),
  };
}

// AI 활용 능력 진단 유틸리티
export function calculateAILevel(scores: number[]): AILevel {
  const totalScore = scores.reduce((sum, s) => sum + s, 0);
  const range = LEVEL_RANGES.find((r) => totalScore >= r.min && totalScore <= r.max);
  return range ? range.level : totalScore < 10 ? 1 : 5;
}

export function calculateExpProgress(scores: number[]): {
  totalScore: number;
  level: AILevel;
  currentLevelMin: number;
  currentLevelMax: number;
  progressInLevel: number;
  nextLevel: AILevel | null;
} {
  const totalScore = scores.reduce((sum, s) => sum + s, 0);
  const level = calculateAILevel(scores);
  const { min, max } = LEVEL_SCORE_RANGES[level];
  const range = max - min + 1;
  const progressInLevel = Math.round(((totalScore - min) / range) * 100);

  return {
    totalScore,
    level,
    currentLevelMin: min,
    currentLevelMax: max,
    progressInLevel: Math.min(100, Math.max(0, progressInLevel)),
    nextLevel: level < 5 ? ((level + 1) as AILevel) : null,
  };
}

// 아이 학습 성향 분석 유틸리티
export interface ChildResult {
  primary: ChildType;
  secondary: ChildType;
  scores: Record<ChildType, number>;
}

export function calculateChildType(answers: ChildType[]): ChildResult {
  const scores: Record<ChildType, number> = {
    explorer: 0,
    creative: 0,
    social: 0,
    logical: 0,
    steady: 0,
    perfectionist: 0,
  };

  answers.forEach((type) => {
    scores[type]++;
  });

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return {
    primary: sorted[0][0] as ChildType,
    secondary: sorted[1][0] as ChildType,
    scores,
  };
}

export function getChildScorePercentages(
  scores: Record<ChildType, number>
): Record<ChildType, number> {
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0) || 1;
  const result: Partial<Record<ChildType, number>> = {};
  for (const [key, val] of Object.entries(scores)) {
    result[key as ChildType] = Math.round((val / total) * 100);
  }
  return result as Record<ChildType, number>;
}

// AI 공부법 추천 유틸리티
export interface StudyMethodResult {
  primary: StudyMethodType;
  secondary: StudyMethodType;
  scores: Record<StudyMethodType, number>;
}

export function calculateStudyMethod(answers: StudyMethodType[]): StudyMethodResult {
  const scores: Record<StudyMethodType, number> = {
    'prompt-writer': 0, 'visual-noter': 0, 'audio-learner': 0, 'project-doer': 0,
    'quiz-challenger': 0, 'research-diver': 0, 'summary-master': 0, 'creative-maker': 0,
  };
  answers.forEach((type) => { scores[type]++; });
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  return {
    primary: sorted[0][0] as StudyMethodType,
    secondary: sorted[1][0] as StudyMethodType,
    scores,
  };
}

// AI 시대 직업 적성 유틸리티
export interface CareerAIResult {
  primary: CareerAIType;
  secondary: CareerAIType;
  scores: Record<CareerAIType, number>;
}

export function calculateCareerAI(answers: CareerAIType[]): CareerAIResult {
  const scores: Record<CareerAIType, number> = {
    creator: 0, strategist: 0, connector: 0, analyst: 0, educator: 0, builder: 0,
  };
  answers.forEach((type) => { scores[type]++; });
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  return {
    primary: sorted[0][0] as CareerAIType,
    secondary: sorted[1][0] as CareerAIType,
    scores,
  };
}
