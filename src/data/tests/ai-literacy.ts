export type AILevel = 1 | 2 | 3 | 4 | 5;

export interface AILevelInfo {
  level: AILevel;
  emoji: string;
  title: string;
  label: string;
  color: string;
  bgColor: string;
  shortDesc: string;
  description: string;
  expertTip: string;
  currentSkills: string[];
  levelUpTips: { title: string; desc: string; icon: string }[];
  recommendedTools: { name: string; desc: string; url: string; difficulty: string }[];
  recommendedContent: { title: string; url: string }[];
}

export const aiLevels: Record<AILevel, AILevelInfo> = {
  1: {
    level: 1,
    emoji: '🌱',
    title: 'Lv.1 AI 입문자',
    label: 'AI 입문자',
    color: '#6B7280',
    bgColor: '#F9FAFB',
    shortDesc: 'AI 세계에 첫 발을 내딛는 당신!',
    description: `당신은 아직 AI를 본격적으로 사용해보지 않은 입문 단계입니다.

하지만 걱정하지 마세요! AI는 누구나 쉽게 시작할 수 있고, 지금이 바로 시작하기 가장 좋은 시점입니다. 간단한 질문을 던지는 것부터 시작해보세요.

"오늘 저녁 뭐 먹을까?" 같은 일상적인 질문도 훌륭한 시작입니다. AI와 친해지는 것이 첫 번째 단계예요.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: AI 입문자에게 가장 중요한 건 "완벽한 질문"이 아니라 "일단 써보는 것"입니다. ChatGPT에 하루 한 번, 아무 질문이나 해보세요. 2주만 지나면 어떤 질문이 좋은 답을 이끌어내는지 감이 옵니다.',
    currentSkills: [
      'AI에 대한 기본적인 관심이 있다',
      'ChatGPT 등 AI 도구의 존재를 알고 있다',
      'AI가 미래에 중요해질 것이라는 인식이 있다',
    ],
    levelUpTips: [
      {
        title: 'ChatGPT 가입 & 첫 대화',
        desc: '무료 계정을 만들고 "자기소개 해줘", "오늘 날씨 관련 옷 추천해줘" 같은 간단한 대화를 시작하세요.',
        icon: '💬',
      },
      {
        title: '하루 1질문 챌린지',
        desc: '매일 하나씩 AI에게 질문해보세요. 요리 레시피, 이메일 초안, 여행 계획 등 일상적인 것부터!',
        icon: '📅',
      },
      {
        title: 'AI 입문 콘텐츠 시청',
        desc: '유튜브에서 "ChatGPT 사용법" 검색! 10분짜리 영상 하나면 기본기가 잡힙니다.',
        icon: '📺',
      },
    ],
    recommendedTools: [
      { name: 'ChatGPT', desc: '가장 쉽게 시작할 수 있는 AI 대화 도구', url: 'https://chat.openai.com', difficulty: '입문' },
      { name: '뤼튼', desc: '한국어에 최적화된 AI 글쓰기 도우미', url: 'https://wrtn.ai', difficulty: '입문' },
      { name: 'Copilot', desc: 'MS 통합 AI 어시스턴트 (엣지 브라우저 내장)', url: 'https://copilot.microsoft.com', difficulty: '입문' },
    ],
    recommendedContent: [
      { title: 'AI 시대, 이것만 알면 된다', url: '/articles' },
      { title: 'ChatGPT 완전 초보 가이드', url: '/guide' },
    ],
  },
  2: {
    level: 2,
    emoji: '🌿',
    title: 'Lv.2 AI 초보자',
    label: 'AI 초보자',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    shortDesc: 'AI와 조금씩 친해지고 있는 당신!',
    description: `당신은 AI를 몇 번 사용해본 초보 단계입니다. ChatGPT 등에 질문을 던져본 경험이 있고, AI가 꽤 유용하다는 것을 느끼기 시작했어요.

이제 "어떻게 질문하면 더 좋은 답을 얻을 수 있을까?"를 고민할 시기입니다. 프롬프트 작성의 기본기를 익히면 AI 활용 효율이 크게 달라집니다.

한 가지 도구에 익숙해졌다면, 다른 AI 도구도 체험해보며 각 도구의 특징을 비교해보세요.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 초보 단계에서 가장 효과적인 학습법은 "같은 질문을 다르게 해보기"입니다. 같은 주제를 3가지 방식으로 물어보면, 프롬프트가 결과에 얼마나 큰 영향을 미치는지 체감할 수 있어요.',
    currentSkills: [
      'AI 채팅 도구에 질문을 던질 수 있다',
      '간단한 글쓰기, 번역에 AI를 활용할 수 있다',
      'AI 답변의 한계를 어느 정도 인식한다',
    ],
    levelUpTips: [
      {
        title: '프롬프트 기본 패턴 익히기',
        desc: '"역할 + 상황 + 구체적 요청" 패턴을 연습하세요. 예: "영어 선생님이 되어, 이 문장을 자연스럽게 고쳐줘"',
        icon: '✍️',
      },
      {
        title: 'AI 도구 3개 비교 체험',
        desc: 'ChatGPT, Claude, Gemini에 같은 질문을 해보세요. 각 도구의 강점과 차이를 체감할 수 있어요.',
        icon: '🔄',
      },
      {
        title: '업무/학습에 주 3회 활용',
        desc: '이메일 초안, 보고서 요약, 아이디어 브레인스토밍 등 실제 업무에 적용해보세요.',
        icon: '💼',
      },
    ],
    recommendedTools: [
      { name: 'Claude', desc: '긴 문서 분석과 논리적 대화에 강한 AI', url: 'https://claude.ai', difficulty: '초급' },
      { name: 'Gemini', desc: '구글 통합 AI, 검색+생성 동시 가능', url: 'https://gemini.google.com', difficulty: '초급' },
      { name: 'Gamma', desc: 'AI로 프레젠테이션 자동 생성', url: 'https://gamma.app', difficulty: '초급' },
    ],
    recommendedContent: [
      { title: 'ChatGPT vs Claude vs Gemini 비교 가이드', url: '/articles' },
      { title: '프롬프트 작성법 기초', url: '/guide' },
    ],
  },
  3: {
    level: 3,
    emoji: '🌳',
    title: 'Lv.3 AI 활용자',
    label: 'AI 활용자',
    color: '#059669',
    bgColor: '#ECFDF5',
    shortDesc: 'AI를 실전에서 잘 활용하는 당신!',
    description: `당신은 AI를 일상과 업무에 꾸준히 활용하는 활용자 단계입니다. 프롬프트를 어떻게 작성해야 좋은 결과가 나오는지 감이 잡혔고, 여러 AI 도구의 특징도 알고 있어요.

AI 할루시네이션의 존재를 인식하고, 팩트 체크의 중요성도 알고 있습니다. 이제 단순 질문/답변을 넘어 AI를 더 전략적으로 활용할 수 있는 단계로 나아갈 차례예요.

Notion AI, Perplexity 같은 특화 도구를 활용하면 생산성이 한 단계 더 올라갑니다.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 활용자 단계에서 숙련자로 넘어가는 핵심은 "워크플로우에 AI를 통합"하는 것입니다. 개별 질문이 아니라, 업무 프로세스 자체에 AI를 녹여보세요. 아침 브리핑 → AI 요약 → 핵심 정리 → 공유, 이런 루틴을 만들어보세요.',
    currentSkills: [
      '프롬프트를 수정하며 원하는 결과를 얻을 수 있다',
      '여러 AI 도구를 상황에 맞게 선택할 수 있다',
      'AI 할루시네이션을 인식하고 팩트체크 한다',
    ],
    levelUpTips: [
      {
        title: '시스템 프롬프트 활용',
        desc: 'AI에게 역할, 톤, 출력 형식을 지정하는 시스템 프롬프트를 설정해보세요. 일관된 품질의 결과를 얻을 수 있습니다.',
        icon: '⚙️',
      },
      {
        title: 'AI 자동화 입문 (Zapier/Make)',
        desc: '반복 작업을 AI+자동화로 처리해보세요. "새 이메일 → AI 요약 → 슬랙 전송" 같은 간단한 자동화부터!',
        icon: '🤖',
      },
      {
        title: 'AI 콘텐츠 파이프라인 구축',
        desc: '글쓰기, 이미지 생성, PPT 제작까지 AI 도구 조합으로 콘텐츠 제작 파이프라인을 만들어보세요.',
        icon: '🔗',
      },
    ],
    recommendedTools: [
      { name: 'Notion AI', desc: '문서 관리+AI 통합, 워크플로우 최적화', url: 'https://www.notion.so', difficulty: '중급' },
      { name: 'Perplexity', desc: '출처 기반 AI 리서치 도구', url: 'https://www.perplexity.ai', difficulty: '중급' },
      { name: 'Otter.ai', desc: '회의 녹음 → AI 요약 자동화', url: 'https://otter.ai', difficulty: '중급' },
    ],
    recommendedContent: [
      { title: '프롬프트 엔지니어링 중급 가이드', url: '/guide' },
      { title: 'AI 업무 자동화 시작하기', url: '/articles' },
    ],
  },
  4: {
    level: 4,
    emoji: '🌲',
    title: 'Lv.4 AI 숙련자',
    label: 'AI 숙련자',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    shortDesc: 'AI를 전략적으로 활용하는 당신!',
    description: `당신은 AI를 업무 전반에 전략적으로 통합한 숙련자 단계입니다. Few-shot 프롬프팅, Chain of Thought 같은 고급 기법을 활용하고, API 연동 경험도 있어요.

AI 자동화 도구(Zapier, Make)를 사용해 반복 업무를 줄이고, AI의 한계를 정확히 인지하며 RAG나 그라운딩 개념도 이해하고 있습니다.

이제 AI 도구를 "사용"하는 것을 넘어 "설계"하는 단계로 넘어갈 준비가 되어 있습니다.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 숙련자에서 전문가로의 도약은 "AI로 새로운 가치를 만들어내는 경험"입니다. 사내 AI 활용 가이드를 만들거나, AI 기반 프로세스를 설계해보세요. 다른 사람의 AI 활용을 도울 수 있을 때 진정한 전문가입니다.',
    currentSkills: [
      'Few-shot, CoT 등 고급 프롬프트 기법을 사용한다',
      'API 연동이나 자동화 도구를 활용할 수 있다',
      'RAG, 할루시네이션 대처법 등 AI 심화 개념을 이해한다',
    ],
    levelUpTips: [
      {
        title: 'AI 에이전트/워크플로우 설계',
        desc: '단일 프롬프트가 아닌, 여러 AI 호출을 연결한 에이전트 워크플로우를 설계해보세요.',
        icon: '🏗️',
      },
      {
        title: '커뮤니티 기여 & 지식 공유',
        desc: 'AI 활용 노하우를 블로그, 커뮤니티에 공유하세요. 가르치면서 가장 많이 배웁니다.',
        icon: '🌐',
      },
      {
        title: 'AI 프로젝트 리딩',
        desc: '팀이나 조직에서 AI 도입 프로젝트를 주도해보세요. 실전 경험이 전문가의 핵심 역량입니다.',
        icon: '🚀',
      },
    ],
    recommendedTools: [
      { name: 'Make.com', desc: 'AI+업무 자동화 플랫폼', url: 'https://www.make.com', difficulty: '고급' },
      { name: 'Claude API', desc: 'AI를 내 서비스에 직접 연동', url: 'https://docs.anthropic.com', difficulty: '고급' },
      { name: 'Cursor', desc: 'AI 기반 코드 에디터, 개발 생산성 극대화', url: 'https://cursor.com', difficulty: '고급' },
    ],
    recommendedContent: [
      { title: 'AI 자동화 고급 가이드', url: '/guide' },
      { title: 'AI 에이전트란 무엇인가', url: '/articles' },
    ],
  },
  5: {
    level: 5,
    emoji: '🏔️',
    title: 'Lv.5 AI 전문가',
    label: 'AI 전문가',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    shortDesc: 'AI로 새로운 가치를 창조하는 당신!',
    description: `당신은 AI를 깊이 이해하고 새로운 가치를 만들어내는 전문가 단계입니다. AI 도구를 사용하는 것을 넘어, AI 기반 솔루션을 직접 설계하고 구축할 수 있어요.

LangChain, Vercel AI SDK 같은 프레임워크를 다루고, 커스텀 AI 파이프라인을 구축하며, AI의 최신 트렌드와 기술을 실시간으로 팔로업합니다.

당신의 다음 단계는 AI를 통해 사회적 영향력을 만드는 것입니다.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: AI 전문가의 진짜 가치는 기술력이 아니라 "AI로 해결할 수 있는 문제를 정의하는 능력"입니다. 기술을 넘어 도메인 전문성과 결합하면, AI가 만들어내는 가치가 기하급수적으로 커집니다.',
    currentSkills: [
      'AI 기반 솔루션을 직접 설계하고 구축할 수 있다',
      '커스텀 API 자동화와 AI 파이프라인을 운영한다',
      'AI 커뮤니티에 기여하며 최신 트렌드를 리드한다',
    ],
    levelUpTips: [
      {
        title: 'AI 프로덕트 빌딩',
        desc: 'AI를 핵심으로 한 프로덕트나 서비스를 직접 만들어보세요. 사이드 프로젝트부터 시작해도 좋습니다.',
        icon: '💎',
      },
      {
        title: 'AI 교육 & 멘토링',
        desc: '후배나 동료에게 AI 활용법을 교육하세요. 조직 전체의 AI 역량을 끌어올리는 것이 진정한 리더십입니다.',
        icon: '🎓',
      },
      {
        title: 'AI 윤리 & 거버넌스 참여',
        desc: 'AI의 책임감 있는 사용, 편향성 문제, 거버넌스에 대한 논의에 참여하세요. 기술 너머의 관점이 필요합니다.',
        icon: '⚖️',
      },
    ],
    recommendedTools: [
      { name: 'Claude Code', desc: 'AI 기반 CLI 개발 도구', url: 'https://claude.ai', difficulty: '고급' },
      { name: 'LangChain', desc: 'AI 에이전트 & 체인 프레임워크', url: 'https://www.langchain.com', difficulty: '고급' },
      { name: 'Vercel AI SDK', desc: 'AI 앱 개발을 위한 풀스택 도구', url: 'https://sdk.vercel.ai', difficulty: '고급' },
    ],
    recommendedContent: [
      { title: 'AI 에이전트 아키텍처 심화', url: '/guide' },
      { title: 'AI 프로덕트 빌딩 가이드', url: '/articles' },
    ],
  },
};

export interface AIQuestion {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

export const aiQuestions: AIQuestion[] = [
  {
    id: 1,
    text: 'AI에 대한 현재 당신의 상태는?',
    options: [
      { text: 'AI를 사용해본 적이 없다', score: 1 },
      { text: '몇 번 사용해본 적이 있다', score: 2 },
      { text: '정기적으로 활용하고 있다', score: 3 },
      { text: 'API 연동이나 자동화까지 경험이 있다', score: 4 },
    ],
  },
  {
    id: 2,
    text: '"프롬프트 엔지니어링"이라는 말을 들으면?',
    options: [
      { text: '처음 듣는 용어다', score: 1 },
      { text: '들어봤지만 잘 모른다', score: 2 },
      { text: '기본적인 프롬프트 작성법을 안다', score: 3 },
      { text: 'Few-shot, Chain of Thought 등을 사용한다', score: 4 },
    ],
  },
  {
    id: 3,
    text: 'AI가 엉뚱한 답변을 하면 어떻게 하나요?',
    options: [
      { text: '당황해서 더 이상 사용하지 않는다', score: 1 },
      { text: '같은 질문을 다시 한번 물어본다', score: 2 },
      { text: '프롬프트를 수정해서 다시 시도한다', score: 3 },
      { text: '시스템 프롬프트나 컨텍스트를 조정한다', score: 4 },
    ],
  },
  {
    id: 4,
    text: 'AI 도구를 몇 개나 알고 있나요?',
    options: [
      { text: 'ChatGPT 정도만 안다', score: 1 },
      { text: '2~3개 정도 알고 있다', score: 2 },
      { text: '5개 이상, 상황별로 다른 도구를 사용한다', score: 3 },
      { text: '10개 이상, API까지 파악하고 있다', score: 4 },
    ],
  },
  {
    id: 5,
    text: 'AI를 얼마나 자주 활용하나요?',
    options: [
      { text: '거의 사용하지 않는다', score: 1 },
      { text: '가끔 필요할 때 사용한다', score: 2 },
      { text: '매일 또는 주 3회 이상 사용한다', score: 3 },
      { text: '업무 전체에 AI가 통합되어 있다', score: 4 },
    ],
  },
  {
    id: 6,
    text: 'AI를 활용한 콘텐츠 제작 경험은?',
    options: [
      { text: '없다', score: 1 },
      { text: '텍스트 생성 정도는 해봤다', score: 2 },
      { text: '이미지, 영상, PPT 등 다양한 콘텐츠를 만들어봤다', score: 3 },
      { text: '콘텐츠 제작 파이프라인을 구축했다', score: 4 },
    ],
  },
  {
    id: 7,
    text: '"AI 할루시네이션"이 뭔지 아시나요?',
    options: [
      { text: '처음 듣는 말이다', score: 1 },
      { text: 'AI가 거짓말을 한다는 것 정도 안다', score: 2 },
      { text: '원인과 대처법을 알고 있다', score: 3 },
      { text: 'RAG, 그라운딩 등 기술적 해결 방법을 적용한다', score: 4 },
    ],
  },
  {
    id: 8,
    text: 'AI 관련 학습이나 자기계발은 어떻게 하나요?',
    options: [
      { text: '특별히 하고 있지 않다', score: 1 },
      { text: '유튜브나 블로그를 가끔 본다', score: 2 },
      { text: '온라인 강의를 정기적으로 수강한다', score: 3 },
      { text: 'AI 커뮤니티에 기여하며 활동 중이다', score: 4 },
    ],
  },
  {
    id: 9,
    text: 'AI 자동화 경험이 있나요?',
    options: [
      { text: '자동화가 뭔지 잘 모른다', score: 1 },
      { text: '개념은 알지만 해본 적 없다', score: 2 },
      { text: 'Zapier, Make 등으로 자동화를 사용한다', score: 3 },
      { text: '커스텀 API로 자동화 시스템을 구축했다', score: 4 },
    ],
  },
  {
    id: 10,
    text: 'AI의 미래에 대한 당신의 생각은?',
    options: [
      { text: '나와는 거리가 먼 이야기다', score: 1 },
      { text: '관심을 갖기 시작했다', score: 2 },
      { text: 'AI 시대를 준비하고 있다', score: 3 },
      { text: 'AI로 새로운 기회를 만들어가고 있다', score: 4 },
    ],
  },
];

// 점수 범위 → 레벨 매핑
export const LEVEL_RANGES: { min: number; max: number; level: AILevel }[] = [
  { min: 10, max: 14, level: 1 },
  { min: 15, max: 21, level: 2 },
  { min: 22, max: 28, level: 3 },
  { min: 29, max: 34, level: 4 },
  { min: 35, max: 40, level: 5 },
];

// 각 레벨의 최소/최대 점수
export const LEVEL_SCORE_RANGES: Record<AILevel, { min: number; max: number }> = {
  1: { min: 10, max: 14 },
  2: { min: 15, max: 21 },
  3: { min: 22, max: 28 },
  4: { min: 29, max: 34 },
  5: { min: 35, max: 40 },
};

export const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  '입문': { bg: '#F3F4F6', text: '#6B7280' },
  '초급': { bg: '#EFF6FF', text: '#2563EB' },
  '중급': { bg: '#ECFDF5', text: '#059669' },
  '고급': { bg: '#FFFBEB', text: '#F59E0B' },
};
