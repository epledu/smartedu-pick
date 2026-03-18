export type ToolTarget = '교사용' | '학생용' | '직장인용' | '학부모용';
export type ToolPricing = '무료' | '무료+유료' | '유료';

export interface AITool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  target: ToolTarget;
  pricing: ToolPricing;
  rating: 1 | 2 | 3 | 4 | 5;
  url: string;
  expertTip: string;
}

export const TARGET_EMOJI: Record<ToolTarget, string> = {
  '교사용': '🏫',
  '학생용': '📚',
  '직장인용': '💼',
  '학부모용': '👶',
};

export const PRICING_STYLE: Record<ToolPricing, { bg: string; text: string }> = {
  '무료': { bg: '#DCFCE7', text: '#166534' },
  '무료+유료': { bg: '#DBEAFE', text: '#1E40AF' },
  '유료': { bg: '#FEF3C7', text: '#92400E' },
};

export const aiTools: AITool[] = [
  // 교사용 (4개)
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    emoji: '💬',
    description: '수업 설계, 평가 문항 생성, 학생 피드백 작성까지 — 교사의 만능 AI 비서',
    target: '교사용',
    pricing: '무료+유료',
    rating: 5,
    url: 'https://chat.openai.com',
    expertTip: '프롬프트에 "한국 중학교 2학년 수학" 같이 구체적 맥락을 넣으면 퀄리티가 확 올라갑니다.',
  },
  {
    id: 'claude',
    name: 'Claude',
    emoji: '🧠',
    description: '긴 문서 분석, 세특 작성 보조, 교육과정 문서 요약에 탁월한 AI',
    target: '교사용',
    pricing: '무료+유료',
    rating: 5,
    url: 'https://claude.ai',
    expertTip: '교육과정 PDF를 통째로 업로드하면 성취기준별 수업 아이디어를 바로 받을 수 있어요.',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    emoji: '📊',
    description: 'AI가 발표 자료를 자동으로 만들어주는 프레젠테이션 도구',
    target: '교사용',
    pricing: '무료',
    rating: 4,
    url: 'https://gamma.app',
    expertTip: '수업 주제만 입력하면 10분 만에 깔끔한 발표자료가 완성됩니다.',
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    emoji: '📓',
    description: '학습 자료를 업로드하면 AI가 분석·요약·팟캐스트까지 생성',
    target: '교사용',
    pricing: '무료',
    rating: 4,
    url: 'https://notebooklm.google.com',
    expertTip: '교과서 PDF + 수업자료를 함께 올리면 학생용 학습 가이드를 자동 생성할 수 있어요.',
  },

  // 학생용 (3개)
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    emoji: '🎓',
    description: 'AI 튜터 Khanmigo와 함께하는 무료 맞춤형 학습 플랫폼',
    target: '학생용',
    pricing: '무료',
    rating: 5,
    url: 'https://www.khanacademy.org',
    expertTip: '수학, 과학 기초가 부족할 때 가장 효과적입니다. 자기 페이스로 반복 학습이 핵심이에요.',
  },
  {
    id: 'quizlet',
    name: 'Quizlet',
    emoji: '🃏',
    description: 'AI가 만들어주는 플래시카드와 반복학습으로 암기 효율 극대화',
    target: '학생용',
    pricing: '무료+유료',
    rating: 4,
    url: 'https://quizlet.com',
    expertTip: '시험 2주 전부터 매일 10분씩 Quizlet 반복하면 암기 과목 점수가 확 오릅니다.',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    emoji: '🔍',
    description: '출처가 명확한 AI 검색 엔진 — 과제 리서치와 팩트체크에 최적',
    target: '학생용',
    pricing: '무료',
    rating: 4,
    url: 'https://www.perplexity.ai',
    expertTip: '구글 검색 대신 Perplexity로 리서치하면 출처까지 정리된 답변을 바로 받을 수 있어요.',
  },

  // 직장인용 (3개)
  {
    id: 'notion-ai',
    name: 'Notion AI',
    emoji: '📝',
    description: '문서 작성, 회의록 요약, 업무 정리를 AI가 도와주는 올인원 워크스페이스',
    target: '직장인용',
    pricing: '유료',
    rating: 5,
    url: 'https://www.notion.so/product/ai',
    expertTip: '회의록을 Notion에 붙여넣고 "액션 아이템 추출"하면 업무 효율이 2배가 됩니다.',
  },
  {
    id: 'wrtn',
    name: '뤼튼 (Wrtn)',
    emoji: '✍️',
    description: '한국어에 특화된 AI 글쓰기 도구 — 보고서, 이메일, SNS 글 작성',
    target: '직장인용',
    pricing: '무료',
    rating: 4,
    url: 'https://wrtn.ai',
    expertTip: '보고서 초안을 뤼튼으로 잡고, 본인의 데이터와 인사이트를 추가하는 게 가장 효율적이에요.',
  },
  {
    id: 'canva-ai',
    name: 'Canva AI',
    emoji: '🎨',
    description: 'AI로 디자인과 발표자료를 자동 생성하는 올인원 디자인 툴',
    target: '직장인용',
    pricing: '무료+유료',
    rating: 4,
    url: 'https://www.canva.com',
    expertTip: 'Magic Design 기능으로 텍스트만 입력하면 프로 수준의 카드뉴스가 완성됩니다.',
  },

  {
    id: 'gemini',
    name: 'Gemini',
    emoji: '✨',
    description: '구글의 AI 어시스턴트. 검색과 연동되어 최신 정보 기반 답변에 강점',
    target: '직장인용',
    pricing: '무료+유료',
    rating: 4,
    url: 'https://gemini.google.com',
    expertTip: '구글 워크스페이스(Gmail, Docs)와 연동하면 업무 효율이 크게 올라갑니다.',
  },

  {
    id: 'suno',
    name: 'Suno AI',
    emoji: '🎵',
    description: '텍스트만 입력하면 노래를 만들어주는 AI 음악 생성 도구',
    target: '학생용',
    pricing: '무료+유료',
    rating: 4,
    url: 'https://suno.com',
    expertTip: '영어 단어를 노래 가사로 만들면 재미있게 외울 수 있어요. 학생들 반응이 폭발적!',
  },
  {
    id: 'speak',
    name: '스픽 (Speak)',
    emoji: '🗣️',
    description: 'AI 튜터와 영어 회화 연습. 발음 교정과 실시간 피드백 제공',
    target: '학생용',
    pricing: '무료+유료',
    rating: 5,
    url: 'https://www.speak.com',
    expertTip: '매일 10분씩 스픽으로 말하기 연습하면 3개월 후 체감 변화가 큽니다.',
  },

  {
    id: 'miricanvas',
    name: '미리캔버스',
    emoji: '🖼️',
    description: '한국형 디자인 도구. 학습지, 상장, 안내문 등 교육 템플릿이 풍부',
    target: '교사용',
    pricing: '무료',
    rating: 4,
    url: 'https://www.miricanvas.com',
    expertTip: '학교 공문서, 가정통신문 템플릿이 많아서 한국 교사에게는 Canva보다 편할 수 있어요.',
  },

  // 학부모용 (2개)
  {
    id: 'khan-kids',
    name: 'Khan Academy Kids',
    emoji: '🧒',
    description: '2~8세 아이를 위한 무료 AI 학습 앱 — 수학, 읽기, 논리 사고',
    target: '학부모용',
    pricing: '무료',
    rating: 5,
    url: 'https://learn.khanacademy.org/khan-academy-kids/',
    expertTip: '하루 20분씩 꾸준히 하면 효과가 큽니다. 아이가 직접 고르게 해주세요.',
  },
  {
    id: 'autodraw',
    name: 'AutoDraw',
    emoji: '✏️',
    description: '구글 AI가 낙서를 예쁜 그림으로 바꿔주는 무료 그림 도구',
    target: '학부모용',
    pricing: '무료',
    rating: 3,
    url: 'https://www.autodraw.com',
    expertTip: '아이와 함께 그림 그리기 놀이를 하면서 자연스럽게 AI를 경험하게 해줄 수 있어요.',
  },
];

export const ALL_TARGETS: ToolTarget[] = ['교사용', '학생용', '직장인용', '학부모용'];
