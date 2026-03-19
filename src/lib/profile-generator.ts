export interface ProfileEntry {
  type: string;
  label: string;
  emoji: string;
  completedAt: string;
}

export type ProfileResults = Partial<Record<string, ProfileEntry>>;

const TEST_IDS = ['learning-style', 'ai-literacy', 'child-type', 'ai-study-method', 'career-ai'] as const;

const TEST_META: Record<string, { title: string; href: string; startHref: string; emoji: string }> = {
  'learning-style': { title: '나의 학습유형 테스트', href: '/test/learning-style/result', startHref: '/test/learning-style', emoji: '📋' },
  'ai-literacy': { title: 'AI 활용 능력 진단', href: '/test/ai-literacy/result', startHref: '/test/ai-literacy', emoji: '🤖' },
  'child-type': { title: '우리 아이 학습 성향', href: '/test/child-type/result', startHref: '/test/child-type', emoji: '👶' },
  'ai-study-method': { title: 'AI 공부법 추천', href: '/test/ai-study-method/result', startHref: '/test/ai-study-method', emoji: '🧠' },
  'career-ai': { title: 'AI 시대 직업 적성', href: '/test/career-ai/result', startHref: '/test/career-ai', emoji: '💼' },
};

/** localStorage에서 모든 프로필 결과 읽기 */
export function getAllProfileResults(): ProfileResults {
  if (typeof window === 'undefined') return {};
  const results: ProfileResults = {};
  for (const id of TEST_IDS) {
    const raw = localStorage.getItem(`profile_${id}`);
    if (raw) {
      try { results[id] = JSON.parse(raw); } catch { /* skip */ }
    }
  }
  return results;
}

/** 완료된 테스트 수 */
export function getCompletedCount(results: ProfileResults): number {
  return Object.keys(results).length;
}

/** 테스트 메타 정보 가져오기 */
export function getTestMeta(testId: string) {
  return TEST_META[testId];
}

/** 모든 테스트 ID 목록 */
export function getAllTestIds() {
  return [...TEST_IDS];
}

/** 종합 프로필 문구 자동 생성 */
export function generateProfileSummary(results: ProfileResults): string {
  const parts: string[] = [];

  if (results['learning-style']) {
    const typeMap: Record<string, string> = {
      visual: '시각적 콘텐츠에 강하고',
      auditory: '듣고 이해하는 데 뛰어나며',
      kinesthetic: '직접 해보며 배우고',
      analytical: '논리적으로 분석하며',
    };
    parts.push(typeMap[results['learning-style'].type] || '');
  }

  if (results['ai-literacy']) {
    const levelMap: Record<string, string> = {
      '1': 'AI 입문을 시작한',
      '2': 'AI 기초를 익힌',
      '3': 'AI를 실무에 활용하는',
      '4': 'AI를 자유자재로 다루는',
      '5': 'AI 전문가 수준의',
    };
    parts.push(levelMap[results['ai-literacy'].type] || '');
  }

  if (results['career-ai']) {
    const careerMap: Record<string, string> = {
      creator: '창작 분야에서 빛나는',
      strategist: '전략적 사고가 뛰어난',
      connector: '소통으로 연결하는',
      analyst: '데이터로 인사이트를 뽑는',
      educator: '가르치며 성장하는',
      builder: '직접 만들며 혁신하는',
    };
    parts.push(careerMap[results['career-ai'].type] || '');
  }

  if (results['ai-study-method']) {
    parts.push('나만의 학습 루틴을 가진');
  }

  if (results['child-type']) {
    parts.push('자녀 교육에도 관심이 높은');
  }

  const filtered = parts.filter(Boolean);
  if (filtered.length === 0) return '나만의 프로필을 완성해보세요';
  return filtered.join(', ') + ' 학습자';
}

/** 프로필 저장 (테스트 결과 페이지에서 호출) */
export function saveProfileResult(testId: string, entry: ProfileEntry) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`profile_${testId}`, JSON.stringify(entry));
}
