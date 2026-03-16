export type CareerAIType =
  | 'creator'
  | 'strategist'
  | 'connector'
  | 'analyst'
  | 'educator'
  | 'builder';

export interface CareerAIInfo {
  id: CareerAIType;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  shortDesc: string;
  description: string;
  expertTip: string;

  aiSafetyScore: number;
  aiSynergyScore: number;

  fitCareers: {
    title: string;
    aiRole: string;
    humanRole: string;
  }[];

  growthPath: {
    now: string;
    sixMonths: string;
    oneYear: string;
  };

  recommendedSkills: string[];
  recommendedTools: { name: string; desc: string; url: string }[];
}

export const careerAITypes: Record<CareerAIType, CareerAIInfo> = {
  creator: {
    id: 'creator',
    emoji: '🎨',
    label: 'AI 창작 협업가',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    shortDesc: 'AI와 함께 새로운 것을 만들어내는 사람!',
    description: `당신은 AI 시대의 "창작 협업가" 타입입니다!

AI가 아무리 발전해도 "무엇을 만들 것인가"를 결정하는 것은 인간의 몫이에요. 당신은 AI를 강력한 창작 도구로 활용하여 콘텐츠, 디자인, 기획 등 창작 영역에서 빛을 발할 타입입니다.

AI가 초안을 만들어주면 당신이 방향을 잡고, 감성을 입히고, 완성도를 높이는 — "AI 디렉터" 역할이에요.`,

    expertTip:
      '실제로 AI 콘텐츠 디렉터 직군은 2025년부터 급격히 늘어나고 있어요. AI 도구 3가지 이상을 자유자재로 쓸 수 있으면 시장에서 큰 경쟁력을 갖게 됩니다.',

    aiSafetyScore: 8,
    aiSynergyScore: 9,

    fitCareers: [
      { title: 'AI 콘텐츠 디렉터', aiRole: '초안 생성, 변형 제작', humanRole: '방향 설정, 브랜드 감성, 최종 판단' },
      { title: 'AI 기반 마케터', aiRole: '카피 초안, 데이터 분석', humanRole: '전략 수립, 크리에이티브 콘셉트' },
      { title: 'UX/UI 디자이너', aiRole: '디자인 시안 생성', humanRole: '사용자 경험 설계, 감성적 판단' },
      { title: '영상 크리에이터', aiRole: '스크립트, 편집 보조', humanRole: '기획, 연출, 스토리텔링' },
    ],

    growthPath: {
      now: 'AI 창작 도구(Canva AI, Gamma, 뤼튼) 3가지 이상 익히기',
      sixMonths: 'AI를 활용한 콘텐츠 포트폴리오 10개 만들기',
      oneYear: 'AI 콘텐츠 디렉터로서 팀이나 프로젝트 리딩',
    },

    recommendedSkills: ['프롬프트 엔지니어링', '브랜딩/마케팅', '스토리텔링', 'AI 도구 활용력'],
    recommendedTools: [
      { name: 'Canva AI', desc: 'AI 디자인/콘텐츠 제작', url: 'https://canva.com' },
      { name: 'ChatGPT', desc: '카피/기획 초안 생성', url: 'https://chat.openai.com' },
      { name: 'Gamma', desc: 'AI 발표자료/문서 제작', url: 'https://gamma.app' },
    ],
  },

  strategist: {
    id: 'strategist',
    emoji: '🧭',
    label: 'AI 전략 설계자',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    shortDesc: 'AI를 활용한 비즈니스 전략을 설계하는 사람!',
    description: `당신은 AI 시대의 "전략 설계자" 타입입니다!

AI 도구를 개별적으로 쓰는 것을 넘어서, "AI를 비즈니스에 어떻게 적용할 것인가"를 설계하는 역할이에요. 큰 그림을 보고, AI 도입 전략을 세우고, 조직의 방향을 결정하는 — AI 시대의 핵심 인재입니다.`,

    expertTip:
      'AI 전략 컨설턴트 수요가 폭발적으로 늘고 있어요. AI 트렌드를 꾸준히 팔로업하면서 실제 비즈니스 사례를 분석하는 습관이 핵심입니다.',

    aiSafetyScore: 9,
    aiSynergyScore: 8,

    fitCareers: [
      { title: 'AI 전략 컨설턴트', aiRole: '데이터 분석, 시장 조사', humanRole: '전략 수립, 의사결정, 클라이언트 설득' },
      { title: '프로덕트 매니저', aiRole: '사용자 데이터 분석, 프로토타입', humanRole: '제품 비전, 우선순위 결정, 이해관계자 조율' },
      { title: 'AI 도입 담당자', aiRole: '업무 프로세스 분석', humanRole: '도입 전략 수립, 조직 변화 관리' },
      { title: '스타트업 창업자', aiRole: 'MVP 빠르게 구축', humanRole: '비전, 팀 빌딩, 사업 모델 설계' },
    ],

    growthPath: {
      now: 'AI 트렌드 뉴스레터 3개 구독 + 주간 분석 습관 만들기',
      sixMonths: 'AI 도입 사례 10개 분석 + 자기 분야 AI 전략 문서 작성',
      oneYear: '조직 내 AI 도입 프로젝트 리딩 또는 AI 관련 사이드 프로젝트 런칭',
    },

    recommendedSkills: ['비즈니스 분석', 'AI 트렌드 파악', '프로젝트 관리', '의사결정 프레임워크'],
    recommendedTools: [
      { name: 'Perplexity', desc: 'AI 트렌드/시장 리서치', url: 'https://perplexity.ai' },
      { name: 'Notion AI', desc: '전략 문서 작성/관리', url: 'https://notion.so' },
      { name: 'Claude', desc: '복잡한 비즈니스 분석', url: 'https://claude.ai' },
    ],
  },

  connector: {
    id: 'connector',
    emoji: '🤝',
    label: 'AI 시대 소통 전문가',
    color: '#059669',
    bgColor: '#ECFDF5',
    shortDesc: '사람과 사람, 사람과 AI를 연결하는 사람!',
    description: `당신은 AI 시대의 "소통 전문가" 타입입니다!

AI가 아무리 발전해도 사람의 감정을 이해하고, 신뢰를 쌓고, 관계를 만드는 것은 AI가 못 하는 영역이에요. 당신은 소통 능력으로 AI 시대에 가장 안전하면서도 가장 가치 있는 포지션을 차지할 타입입니다.`,

    expertTip:
      'AI 시대에 "사람을 이해하는 능력"은 오히려 더 귀해지고 있어요. AI로 효율을 높이되, 관계 구축에 집중하는 것이 최고의 전략입니다.',

    aiSafetyScore: 9,
    aiSynergyScore: 7,

    fitCareers: [
      { title: '상담사/코치', aiRole: '사전 분석, 자료 정리', humanRole: '공감, 신뢰 형성, 맞춤 조언' },
      { title: '영업/고객 관리', aiRole: '고객 데이터 분석, 이메일 초안', humanRole: '관계 구축, 협상, 신뢰 형성' },
      { title: 'HR/인사 담당', aiRole: '이력서 스크리닝, 일정 관리', humanRole: '면접, 조직 문화, 갈등 중재' },
      { title: '커뮤니티 매니저', aiRole: '콘텐츠 초안, 데이터 분석', humanRole: '커뮤니티 운영, 멤버 케어' },
    ],

    growthPath: {
      now: 'AI 도구로 소통 업무 효율화 연습 (이메일 초안, 미팅 요약)',
      sixMonths: '온라인 커뮤니티나 스터디 그룹 운영 경험 쌓기',
      oneYear: '팀/조직에서 "AI + 사람" 협업 문화를 만드는 리더 역할',
    },

    recommendedSkills: ['공감/경청', '커뮤니케이션', '갈등 관리', 'AI 도구 기본 활용'],
    recommendedTools: [
      { name: 'ChatGPT', desc: '이메일/커뮤니케이션 초안', url: 'https://chat.openai.com' },
      { name: 'Clova Note', desc: '미팅/상담 녹음 요약', url: 'https://clovanote.naver.com' },
      { name: 'Notion AI', desc: '회의록/상담 기록 정리', url: 'https://notion.so' },
    ],
  },

  analyst: {
    id: 'analyst',
    emoji: '📊',
    label: 'AI 데이터 분석가',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    shortDesc: 'AI와 데이터로 인사이트를 뽑아내는 사람!',
    description: `당신은 AI 시대의 "데이터 분석가" 타입입니다!

AI가 데이터를 처리하는 속도는 인간을 압도하지만, "어떤 질문을 던질 것인가"와 "데이터가 말하는 의미"를 해석하는 것은 인간의 영역이에요. 당신은 AI를 분석 파트너로 두고, 데이터에서 가치 있는 인사이트를 뽑아내는 역할에 최적입니다.`,

    expertTip:
      'ChatGPT Code Interpreter만 잘 활용해도 데이터 분석 전문가 수준의 인사이트를 뽑을 수 있어요. 코딩을 못 해도 괜찮습니다.',

    aiSafetyScore: 7,
    aiSynergyScore: 10,

    fitCareers: [
      { title: '데이터 분석가', aiRole: '데이터 처리, 패턴 탐지', humanRole: '질문 설계, 인사이트 해석, 의사결정 지원' },
      { title: '마케팅 분석가', aiRole: '고객 데이터 분석, A/B 테스트', humanRole: '마케팅 전략 도출, 캠페인 기획' },
      { title: '비즈니스 인텔리전스', aiRole: '대시보드 자동 생성', humanRole: '경영진 보고, 전략적 해석' },
      { title: 'AI/ML 엔지니어', aiRole: '모델 학습, 코드 생성', humanRole: '문제 정의, 아키텍처 설계, 품질 검증' },
    ],

    growthPath: {
      now: 'AI 데이터 분석 도구 (ChatGPT Code Interpreter, 구글 시트 AI) 활용 시작',
      sixMonths: '실제 데이터를 AI로 분석하고 인사이트 리포트 5개 작성',
      oneYear: 'AI 기반 데이터 분석 역량으로 팀 내 핵심 인재 포지션',
    },

    recommendedSkills: ['데이터 리터러시', '논리적 사고', '시각화', '기본 프로그래밍'],
    recommendedTools: [
      { name: 'ChatGPT Code Interpreter', desc: 'AI 데이터 분석', url: 'https://chat.openai.com' },
      { name: 'Claude', desc: '복잡한 데이터 해석/분석', url: 'https://claude.ai' },
      { name: 'Hex', desc: 'AI 기반 데이터 노트북', url: 'https://hex.tech' },
    ],
  },

  educator: {
    id: 'educator',
    emoji: '🎓',
    label: 'AI 시대 교육자',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    shortDesc: '사람을 가르치고 성장시키는 AI 시대의 스승!',
    description: `당신은 AI 시대의 "교육자" 타입입니다!

AI가 지식 전달은 대신할 수 있지만, 동기 부여, 멘토링, 성장 설계는 여전히 인간 교육자의 몫이에요. AI를 교육 도구로 활용하면서 "학습 설계자"이자 "성장 파트너"로 역할을 확장하는 당신은 AI 시대 가장 가치 있는 직업 중 하나입니다.`,

    expertTip:
      '전국 200개+ 학교에서 AI 코스웨어를 도입해본 결과, 교사의 역할이 "지식 전달자"에서 "학습 설계자+동기부여자"로 확실히 변하고 있어요. 이 변화를 선도하는 교사가 AI 시대 핵심 인재입니다.',

    aiSafetyScore: 8,
    aiSynergyScore: 9,

    fitCareers: [
      { title: '교사/강사', aiRole: '맞춤 학습 자료 생성, 자동 채점', humanRole: '동기 부여, 멘토링, 수업 설계' },
      { title: '교육 기획자', aiRole: '커리큘럼 초안, 학습 데이터 분석', humanRole: '교육 목표 설정, 학습 경험 설계' },
      { title: '기업 교육 담당', aiRole: '교육 콘텐츠 자동 생성', humanRole: '교육 니즈 파악, 조직 학습 문화 구축' },
      { title: '에듀테크 전문가', aiRole: 'AI 교육 도구 활용', humanRole: '교육 + 기술의 접점 설계' },
    ],

    growthPath: {
      now: 'AI 교육 도구 3가지(코스웨어, ChatGPT, NotebookLM) 직접 체험',
      sixMonths: 'AI를 활용한 수업/교육 프로그램 1개 설계 + 실행',
      oneYear: 'AI 교육 전문가로서 워크숍/강의/콘텐츠 제작',
    },

    recommendedSkills: ['교수 설계', '퍼실리테이션', 'AI 도구 활용', '학습 데이터 분석'],
    recommendedTools: [
      { name: 'NotebookLM', desc: '학습 자료 AI 분석/팟캐스트', url: 'https://notebooklm.google.com' },
      { name: 'Gamma', desc: 'AI 교육 슬라이드 제작', url: 'https://gamma.app' },
      { name: 'ChatGPT', desc: '교안/평가 문항 자동 생성', url: 'https://chat.openai.com' },
    ],
  },

  builder: {
    id: 'builder',
    emoji: '🛠️',
    label: 'AI 기술 구축자',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    shortDesc: 'AI 시스템을 직접 만들고 구축하는 사람!',
    description: `당신은 AI 시대의 "기술 구축자" 타입입니다!

AI를 사용하는 것을 넘어서, AI 시스템을 직접 만들고 구축하는 역할이에요. 코딩, 자동화, AI 서비스 개발 등 기술적 역량으로 AI 시대의 인프라를 만드는 핵심 인재입니다.

AI 도구를 가장 깊이 활용할 수 있는 타입이며, AI 시대에 대체 불가능한 포지션이에요.`,

    expertTip:
      'AI 코딩 도구(Claude Code, Cursor)의 등장으로 개발 생산성이 5~10배 올라갔어요. 코딩 경험이 없어도 지금 시작하면 6개월 후 놀라운 결과를 만들 수 있습니다.',

    aiSafetyScore: 9,
    aiSynergyScore: 10,

    fitCareers: [
      { title: 'AI 엔지니어', aiRole: '코드 생성, 디버깅 보조', humanRole: '아키텍처 설계, 문제 정의, 품질 검증' },
      { title: '풀스택 개발자', aiRole: 'AI 코파일럿 활용 코딩', humanRole: '시스템 설계, 사용자 경험, 의사결정' },
      { title: 'AI 자동화 전문가', aiRole: '워크플로우 실행', humanRole: '자동화 전략 수립, 프로세스 최적화' },
      { title: 'CTO/기술 리더', aiRole: '기술 조사, 프로토타입', humanRole: '기술 비전, 팀 리딩, 기술 의사결정' },
    ],

    growthPath: {
      now: 'Claude Code 또는 Cursor로 AI 코딩 체험 + 미니 프로젝트 1개',
      sixMonths: 'AI API 연동 프로젝트 3개 완성 + GitHub 포트폴리오',
      oneYear: 'AI 기반 서비스/프로덕트 런칭 또는 AI 팀 리딩',
    },

    recommendedSkills: ['프로그래밍', 'AI/ML 기초', 'API 연동', '시스템 설계'],
    recommendedTools: [
      { name: 'Claude Code', desc: 'AI 기반 코딩', url: 'https://claude.ai' },
      { name: 'Vercel', desc: 'AI 웹 앱 배포', url: 'https://vercel.com' },
      { name: 'n8n', desc: 'AI 자동화 워크플로우', url: 'https://n8n.io' },
    ],
  },
};

export interface CareerAIQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    type: CareerAIType;
  }[];
}

export const careerAIQuestions: CareerAIQuestion[] = [
  {
    id: 1,
    text: '업무 중 AI를 가장 쓰고 싶은 상황은?',
    options: [
      { text: '콘텐츠나 디자인 초안을 빠르게 만들 때', type: 'creator' },
      { text: '시장 분석이나 비즈니스 전략을 세울 때', type: 'strategist' },
      { text: '이메일이나 커뮤니케이션을 효율화할 때', type: 'connector' },
      { text: '데이터를 분석하고 인사이트를 뽑을 때', type: 'analyst' },
    ],
  },
  {
    id: 2,
    text: '"AI가 내 직업을 대체할까?"에 대한 당신의 생각은?',
    options: [
      { text: 'AI를 도구로 써서 더 좋은 결과물을 만들 수 있어 기대돼', type: 'creator' },
      { text: 'AI를 활용해서 사람을 더 잘 도울 수 있을 것 같아', type: 'educator' },
      { text: 'AI 시스템을 직접 만드는 쪽으로 가면 안전하지', type: 'builder' },
      { text: '사람과의 관계는 AI가 대신 못 해, 괜찮아', type: 'connector' },
    ],
  },
  {
    id: 3,
    text: '팀에서 가장 잘 하는 역할은?',
    options: [
      { text: '크리에이티브한 아이디어를 내는 역할', type: 'creator' },
      { text: '전체 전략과 방향을 잡는 역할', type: 'strategist' },
      { text: '팀원들 사이를 조율하고 소통하는 역할', type: 'connector' },
      { text: '기술적으로 구현하고 만드는 역할', type: 'builder' },
    ],
  },
  {
    id: 4,
    text: '가장 흥미로운 AI 관련 뉴스는?',
    options: [
      { text: 'AI가 그린 그림이 미술 대회에서 1등', type: 'creator' },
      { text: 'AI가 암 진단을 의사보다 정확하게 해냄', type: 'analyst' },
      { text: 'AI 교사가 학생 맞춤 수업을 제공', type: 'educator' },
      { text: 'AI 에이전트가 스스로 코드를 작성하고 배포', type: 'builder' },
    ],
  },
  {
    id: 5,
    text: '5년 후 당신이 되고 싶은 모습은?',
    options: [
      { text: 'AI를 활용해 영향력 있는 콘텐츠를 만드는 사람', type: 'creator' },
      { text: '조직의 AI 전략을 설계하는 리더', type: 'strategist' },
      { text: '데이터로 의사결정을 지원하는 전문가', type: 'analyst' },
      { text: 'AI 시대의 교육을 혁신하는 교육자', type: 'educator' },
    ],
  },
  {
    id: 6,
    text: '주말에 AI로 사이드 프로젝트를 한다면?',
    options: [
      { text: 'AI로 블로그/유튜브 콘텐츠 만들기', type: 'creator' },
      { text: 'AI 자동화 시스템 구축하기', type: 'builder' },
      { text: 'AI 교육 프로그램/강의 만들기', type: 'educator' },
      { text: 'AI로 시장/트렌드 분석 리포트 작성', type: 'strategist' },
    ],
  },
  {
    id: 7,
    text: '회사에서 AI 도입 프로젝트가 시작됐을 때 맡고 싶은 역할은?',
    options: [
      { text: 'AI 도입 전략 기획 및 로드맵 작성', type: 'strategist' },
      { text: 'AI 도구를 직접 세팅하고 구축', type: 'builder' },
      { text: '직원들에게 AI 사용법 교육', type: 'educator' },
      { text: '도입 후 효과 분석 및 데이터 리포팅', type: 'analyst' },
    ],
  },
  {
    id: 8,
    text: 'AI와 협업할 때 가장 자신 있는 부분은?',
    options: [
      { text: 'AI 결과물에 감성과 스토리를 입히기', type: 'creator' },
      { text: '사람들의 니즈를 파악하고 AI에게 전달하기', type: 'connector' },
      { text: 'AI가 분석한 데이터의 의미를 해석하기', type: 'analyst' },
      { text: 'AI 시스템을 직접 커스텀하고 개선하기', type: 'builder' },
    ],
  },
  {
    id: 9,
    text: 'AI 시대에 가장 중요하다고 생각하는 능력은?',
    options: [
      { text: '창의력과 미적 감각', type: 'creator' },
      { text: '전략적 사고와 의사결정', type: 'strategist' },
      { text: '공감과 소통 능력', type: 'connector' },
      { text: '기술 이해력과 문제 해결', type: 'builder' },
    ],
  },
  {
    id: 10,
    text: 'AI 관련 강의를 듣는다면?',
    options: [
      { text: 'AI 콘텐츠 제작 마스터클래스', type: 'creator' },
      { text: 'AI 비즈니스 전략 과정', type: 'strategist' },
      { text: 'AI 시대 리더십/소통 과정', type: 'connector' },
      { text: 'AI 개발/코딩 부트캠프', type: 'builder' },
    ],
  },
  {
    id: 11,
    text: '가장 공감되는 문장은?',
    options: [
      { text: '"AI로 사람을 더 잘 가르칠 수 있다면 최고"', type: 'educator' },
      { text: '"데이터에서 남들이 못 보는 패턴을 찾는 게 재밌다"', type: 'analyst' },
      { text: '"결국 사람 마음을 움직이는 건 사람이야"', type: 'connector' },
      { text: '"직접 만들어봐야 진짜 이해할 수 있어"', type: 'builder' },
    ],
  },
  {
    id: 12,
    text: 'AI 시대, 나의 슈퍼파워는?',
    options: [
      { text: '남들과 다른 관점으로 새로운 것을 만드는 힘', type: 'creator' },
      { text: '복잡한 상황을 정리하고 방향을 제시하는 힘', type: 'strategist' },
      { text: '가르치고 성장시키는 힘', type: 'educator' },
      { text: '숫자와 데이터 뒤에 숨은 이야기를 읽는 힘', type: 'analyst' },
    ],
  },
];
