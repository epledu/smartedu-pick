const INITIAL_COUNTS: Record<string, number> = {
  'learning-style': 1847,
  'ai-literacy': 1203,
  'child-type': 956,
  'ai-study-method': 634,
  'career-ai': 821,
};

/** 참여자 수 가져오기 */
export function getTestCount(testId: string): number {
  if (typeof window === 'undefined') return INITIAL_COUNTS[testId] || 0;
  const stored = localStorage.getItem(`test_count_${testId}`);
  return stored ? parseInt(stored, 10) : (INITIAL_COUNTS[testId] || 0);
}

/** 테스트 완료 시 +1 (세션 내 중복 방지) */
export function incrementTestCount(testId: string): number {
  if (typeof window === 'undefined') return getTestCount(testId);

  const sessionKey = `counted_${testId}`;
  if (sessionStorage.getItem(sessionKey)) {
    return getTestCount(testId);
  }

  const current = getTestCount(testId);
  const newCount = current + 1;
  localStorage.setItem(`test_count_${testId}`, String(newCount));
  sessionStorage.setItem(sessionKey, 'true');
  return newCount;
}

/** 숫자를 "1,234명 참여" 형태로 포맷 */
export function formatCount(count: number): string {
  return count.toLocaleString('ko-KR') + '명 참여';
}
