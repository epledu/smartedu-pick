import type { LearningType } from '@/data/tests/learning-style';
import type { AILevel } from '@/data/tests/ai-literacy';
import { LEVEL_RANGES, LEVEL_SCORE_RANGES } from '@/data/tests/ai-literacy';

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
