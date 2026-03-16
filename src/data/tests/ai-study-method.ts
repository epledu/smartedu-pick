export type StudyMethodType =
  | 'prompt-writer'
  | 'visual-noter'
  | 'audio-learner'
  | 'project-doer'
  | 'quiz-challenger'
  | 'research-diver'
  | 'summary-master'
  | 'creative-maker';

export interface StudyMethodInfo {
  id: StudyMethodType;
  emoji: string;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  shortDesc: string;
  description: string;
  expertTip: string;

  dailyRoutine: {
    morning: string;
    afternoon: string;
    evening: string;
    weekend: string;
  };

  recommendedTools: {
    name: string;
    desc: string;
    usage: string;
    url: string;
  }[];

  tips: string[];
}

export const studyMethods: Record<StudyMethodType, StudyMethodInfo> = {
  'prompt-writer': {
    id: 'prompt-writer',
    emoji: '💬',
    label: 'AI 대화형 학습자',
    shortLabel: '대화형',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    shortDesc: 'AI와 대화하면서 이해를 깊게 파는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI와 대화하며 배우기"입니다!

ChatGPT나 Claude에게 질문을 던지고, 답변을 받고, 다시 꼬리 질문을 이어가는 방식이 당신에게 최적이에요. "이게 무슨 뜻이야?", "예시를 들어줘", "더 쉽게 설명해줘" 같은 대화를 통해 개념이 자연스럽게 머릿속에 정리됩니다.

핵심은 수동적으로 답을 받는 게 아니라, 능동적으로 질문을 설계하는 것이에요.`,

    expertTip:
      '실제로 전국 200개+ 학교에서 AI 코스웨어를 도입해본 결과, 학생들이 AI에게 "왜?"라고 꼬리 질문을 3번 이상 이어가면 이해도가 눈에 띄게 올라갔어요.',

    dailyRoutine: {
      morning:
        '오늘 공부할 주제를 AI에게 "5살에게 설명하듯" 요약 요청 → 핵심 개념 3개 파악',
      afternoon:
        '이해 안 되는 부분을 AI에게 꼬리 질문 3~5회 → "왜?"를 끝까지 파기',
      evening:
        'AI에게 "오늘 배운 내용으로 퀴즈 5개 만들어줘" 요청 → 셀프 테스트',
      weekend:
        'AI에게 "이번 주 배운 내용을 블로그 글로 정리해줘" 요청 → 편집하며 복습',
    },

    recommendedTools: [
      {
        name: 'ChatGPT',
        desc: '가장 자연스러운 대화 학습',
        usage:
          '모르는 개념을 대화체로 질문. "초등학생에게 설명하듯 알려줘"가 핵심 프롬프트',
        url: 'https://chat.openai.com',
      },
      {
        name: 'Claude',
        desc: '긴 맥락 유지에 강점',
        usage:
          '복잡한 주제를 여러 턴에 걸쳐 깊이 파고들기. Projects 기능으로 과목별 대화 관리',
        url: 'https://claude.ai',
      },
      {
        name: 'Perplexity',
        desc: '출처 기반 학습',
        usage:
          '"이 내용의 원본 출처를 알려줘"로 팩트 체크하며 학습',
        url: 'https://perplexity.ai',
      },
    ],

    tips: [
      '질문을 미리 3개 적어두고 AI와 대화를 시작하면 효율이 2배',
      '같은 개념을 ChatGPT와 Claude에 각각 물어보면 다른 관점을 얻을 수 있어요',
      'AI 답변을 그대로 믿지 말고 "정말? 확실해?"로 검증 습관 만들기',
    ],
  },

  'visual-noter': {
    id: 'visual-noter',
    emoji: '🗺️',
    label: 'AI 시각화 정리형',
    shortLabel: '시각화형',
    color: '#059669',
    bgColor: '#ECFDF5',
    shortDesc: 'AI로 마인드맵과 인포그래픽을 만드는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI로 시각화하며 정리하기"입니다!

텍스트로 읽기보다 도표, 마인드맵, 인포그래픽으로 정리할 때 이해가 빠른 타입이에요. AI 도구로 복잡한 개념을 시각 자료로 변환하면, 공부 시간도 줄이고 기억도 오래 갑니다.`,

    expertTip:
      '학교 현장에서 AI로 만든 비교표와 마인드맵을 활용한 수업이 단순 텍스트 수업보다 학생 만족도가 30% 이상 높았습니다.',

    dailyRoutine: {
      morning:
        'AI에게 오늘 배울 내용의 마인드맵 구조를 요청 → 전체 그림 파악',
      afternoon:
        '학습 내용을 AI로 비교표/도표로 변환 요청 → 핵심 시각 자료 완성',
      evening: 'Canva에서 오늘 배운 내용을 1장 인포그래픽으로 정리',
      weekend:
        '한 주간 만든 시각 자료를 모아서 "주간 학습 갤러리" 만들기',
    },

    recommendedTools: [
      {
        name: 'Canva AI',
        desc: '인포그래픽/시각 자료 제작',
        usage:
          'AI에게 정리한 내용을 Canva에서 예쁜 인포그래픽으로 디자인',
        url: 'https://canva.com',
      },
      {
        name: 'ChatGPT',
        desc: '마인드맵 구조 생성',
        usage: '"이 내용을 마인드맵 형태로 정리해줘"로 구조화 요청',
        url: 'https://chat.openai.com',
      },
      {
        name: 'Gamma',
        desc: 'AI 발표자료 자동 생성',
        usage:
          '배운 내용을 슬라이드로 정리하면 복습과 발표 준비를 동시에',
        url: 'https://gamma.app',
      },
    ],

    tips: [
      'AI에게 "표로 정리해줘", "비교표로 만들어줘"를 습관적으로 요청하세요',
      '하나의 개념을 3가지 형태(마인드맵/표/인포그래픽)로 정리하면 기억력 3배',
      '시각 자료를 SNS에 공유하면 자연스럽게 복습 + 아웃풋 훈련이 됩니다',
    ],
  },

  'audio-learner': {
    id: 'audio-learner',
    emoji: '🎧',
    label: 'AI 음성 활용형',
    shortLabel: '음성형',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    shortDesc: '들으면서 배우고, 말하면서 기억하는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI 음성으로 듣고 말하며 배우기"입니다!

통학길, 운동 시간 등 이동 중에도 학습이 가능하고, AI와 음성으로 대화하면 기억에 더 오래 남아요. AI가 만들어주는 팟캐스트나 음성 요약을 반복 청취하는 것이 당신에게 최적의 학습법입니다.`,

    expertTip:
      'NotebookLM의 AI 팟캐스트 기능은 교사 연수에서도 매우 호평받고 있어요. 교재를 넣으면 대화형 요약 팟캐스트를 만들어줍니다.',

    dailyRoutine: {
      morning: '통근 시간에 NotebookLM이 생성한 학습 팟캐스트 청취',
      afternoon:
        'AI에게 핵심 내용을 소리 내어 설명하며 이해도 체크',
      evening:
        '오늘 배운 내용을 AI에게 요약 요청 → 음성으로 변환 → 취침 전 청취',
      weekend: '한 주간 학습 내용을 3분 음성 요약으로 정리',
    },

    recommendedTools: [
      {
        name: 'NotebookLM',
        desc: '학습 자료 → AI 팟캐스트 생성',
        usage:
          '공부할 자료를 업로드하면 대화형 팟캐스트를 자동 생성',
        url: 'https://notebooklm.google.com',
      },
      {
        name: 'Clova Note',
        desc: '강의 녹음 → AI 텍스트 변환',
        usage:
          '강의를 녹음하면 AI가 자동으로 텍스트와 요약을 생성',
        url: 'https://clovanote.naver.com',
      },
      {
        name: 'ChatGPT Voice',
        desc: 'AI와 음성 대화로 학습',
        usage: '모바일에서 음성 대화 모드로 걸으면서 공부',
        url: 'https://chat.openai.com',
      },
    ],

    tips: [
      '같은 내용을 3번 들으면 자연스럽게 기억됩니다 — 1번은 이해, 2번은 정리, 3번은 암기',
      '배운 내용을 혼잣말로 설명해보세요. 막히는 부분이 곧 복습 포인트',
      '잠들기 전 10분 음성 복습이 기억 정착에 가장 효과적이에요',
    ],
  },

  'project-doer': {
    id: 'project-doer',
    emoji: '🔨',
    label: 'AI 실전 프로젝트형',
    shortLabel: '프로젝트형',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    shortDesc: '배운 것을 바로 만들어보는 실전파!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI와 함께 프로젝트를 만들며 배우기"입니다!

이론을 읽는 것보다 직접 무언가를 만들어볼 때 학습 효과가 극대화되는 타입이에요. AI를 파트너 삼아 작은 프로젝트를 완성해가면서 자연스럽게 실력이 늡니다.`,

    expertTip:
      '실제로 AI 코딩 도구(Claude Code, Cursor)로 미니 프로젝트를 완성한 학생들이 이론만 배운 학생보다 실무 적응이 3배 빨랐습니다.',

    dailyRoutine: {
      morning:
        '오늘 만들 미니 프로젝트 주제 정하기 (AI에게 아이디어 요청)',
      afternoon:
        'AI와 함께 프로젝트 진행 — 모르는 부분은 바로 AI에게 질문',
      evening:
        '완성한 결과물을 블로그/SNS에 공유 → 배운 것 정리',
      weekend:
        '주간 프로젝트 회고: "이번 주 AI로 뭘 만들었나?" 정리',
    },

    recommendedTools: [
      {
        name: 'ChatGPT',
        desc: '프로젝트 아이디어 + 코파일럿',
        usage:
          '"오늘 30분 안에 만들 수 있는 미니 프로젝트 추천해줘"',
        url: 'https://chat.openai.com',
      },
      {
        name: 'Gamma',
        desc: 'AI 발표자료 프로젝트',
        usage: '배운 주제로 5분 발표자료 만들기 프로젝트',
        url: 'https://gamma.app',
      },
      {
        name: 'Canva',
        desc: 'AI 디자인 프로젝트',
        usage:
          '학습 내용을 인포그래픽이나 포스터로 제작하는 프로젝트',
        url: 'https://canva.com',
      },
    ],

    tips: [
      '"30분 안에 완성"이 룰 — 완벽하지 않아도 완성하는 습관이 핵심',
      '프로젝트 결과물을 모아두면 자연스럽게 포트폴리오가 됩니다',
      '매주 1개씩 AI 미니 프로젝트를 완성하면 3개월 후 실력이 폭발적으로 성장해요',
    ],
  },

  'quiz-challenger': {
    id: 'quiz-challenger',
    emoji: '🎯',
    label: 'AI 퀴즈 반복형',
    shortLabel: '퀴즈형',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    shortDesc: '문제를 풀면서 실력을 다지는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI가 만든 퀴즈를 풀면서 반복 학습하기"입니다!

읽기만 해서는 기억에 안 남고, 직접 문제를 풀어봐야 "아, 이 부분을 몰랐구나"를 발견하는 타입이에요. AI에게 맞춤형 문제를 무한으로 만들어달라고 하면, 최고의 셀프 튜터가 됩니다.`,

    expertTip:
      'AI 코스웨어에서 가장 효과적인 기능이 바로 "AI 문제 출제"입니다. 틀린 문제를 기반으로 유사 문제를 반복 출제하면 정답률이 급격히 올라가요.',

    dailyRoutine: {
      morning:
        'AI에게 어제 배운 내용으로 퀴즈 5개 요청 → 아침 복습 퀴즈',
      afternoon:
        '새 내용 학습 후 AI에게 "방금 배운 것으로 난이도별 문제 3개씩" 요청',
      evening:
        '틀린 문제만 모아서 AI에게 유사 문제 재출제 요청 → 약점 보완',
      weekend:
        '주간 종합 테스트: AI에게 "이번 주 전체 내용으로 20문항 시험 만들어줘"',
    },

    recommendedTools: [
      {
        name: 'ChatGPT',
        desc: '맞춤 문제 무한 생성',
        usage:
          '"이 내용으로 OX 퀴즈 10개 만들어줘, 해설도 포함"',
        url: 'https://chat.openai.com',
      },
      {
        name: 'Quizlet',
        desc: 'AI 플래시카드',
        usage: '핵심 개념을 플래시카드로 만들어 반복 학습',
        url: 'https://quizlet.com',
      },
      {
        name: 'Claude',
        desc: '심화 문제 출제',
        usage:
          '"이 개념을 응용한 서술형 문제 3개와 모범답안 작성해줘"',
        url: 'https://claude.ai',
      },
    ],

    tips: [
      '틀린 문제 노트를 따로 관리하세요 — AI에게 "이 오답을 바탕으로 유사 문제 만들어줘"가 최강',
      '난이도를 단계별로 올려가며 요청하면 게임처럼 재미있어요 (초급→중급→고급)',
      '시험 2주 전부터 AI에게 매일 모의고사를 만들어달라고 하면 실전 감각이 확 올라요',
    ],
  },

  'research-diver': {
    id: 'research-diver',
    emoji: '🔬',
    label: 'AI 리서치 탐구형',
    shortLabel: '리서치형',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    shortDesc: '깊이 파고들어 전문가 수준까지 가는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI로 깊이 리서치하며 전문성 쌓기"입니다!

표면적인 이해로는 만족하지 못하고, 원본 자료와 근거를 찾아 깊이 파고드는 타입이에요. AI를 리서치 어시스턴트로 활용하면, 전문가 수준의 지식을 효율적으로 쌓을 수 있습니다.`,

    expertTip:
      'Perplexity + NotebookLM 조합은 리서치 학습에 최강입니다. 출처 확인이 자동으로 되기 때문에 신뢰도 높은 자료를 빠르게 모을 수 있어요.',

    dailyRoutine: {
      morning:
        'Perplexity로 오늘 탐구할 주제의 최신 자료/논문 검색',
      afternoon:
        '핵심 자료를 NotebookLM에 업로드 → AI와 심층 대화로 분석',
      evening: '리서치 결과를 Notion에 체계적으로 정리',
      weekend:
        '한 주간 리서치를 종합하여 "주간 리서치 노트" 발행',
    },

    recommendedTools: [
      {
        name: 'Perplexity',
        desc: '출처 기반 심층 리서치',
        usage: '학술 자료와 최신 정보를 출처와 함께 검색',
        url: 'https://perplexity.ai',
      },
      {
        name: 'NotebookLM',
        desc: '자료 기반 AI 분석',
        usage:
          'PDF, 논문, 웹 자료를 업로드하고 AI와 깊이 있는 대화',
        url: 'https://notebooklm.google.com',
      },
      {
        name: 'Notion AI',
        desc: '리서치 노트 정리',
        usage:
          '리서치 결과를 체계적으로 분류하고 AI로 요약/정리',
        url: 'https://notion.so',
      },
    ],

    tips: [
      'AI가 말하는 것을 무조건 믿지 말고, "출처를 알려줘"를 습관화하세요',
      '한 주제를 최소 3개 이상의 출처에서 교차 검증하면 진짜 전문성이 쌓여요',
      '리서치 결과를 글로 정리하면 이해도가 한 단계 더 올라갑니다 — 블로그 포스팅 추천',
    ],
  },

  'summary-master': {
    id: 'summary-master',
    emoji: '📝',
    label: 'AI 요약 정리형',
    shortLabel: '요약형',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    shortDesc: '핵심만 쏙쏙 뽑아서 정리하는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "AI로 핵심만 빠르게 요약하고 정리하기"입니다!

방대한 내용을 효율적으로 압축해서 핵심만 기억하는 것을 선호하는 타입이에요. AI의 요약 능력을 최대한 활용하되, 직접 요약을 다시 한번 정리하는 과정이 핵심입니다.`,

    expertTip:
      'AI 요약을 그대로 쓰면 학습 효과가 반감됩니다. AI 요약 → 나만의 한 줄 요약 추가 → 이 과정이 진짜 학습이에요.',

    dailyRoutine: {
      morning:
        'AI에게 오늘 학습 자료를 "핵심 3줄 요약" 요청 → 전체 흐름 파악',
      afternoon:
        '학습 후 AI에게 "이 내용을 5가지 포인트로 정리해줘" → 구조화',
      evening:
        'AI 요약을 바탕으로 자기만의 "한 줄 요약" 작성 → 초압축 복습',
      weekend:
        '한 주간 요약 노트를 모아 "주간 1페이지 정리" 완성',
    },

    recommendedTools: [
      {
        name: 'Claude',
        desc: '긴 문서 요약에 최강',
        usage:
          '교재/논문/긴 아티클을 통째로 넣고 "핵심만 요약해줘"',
        url: 'https://claude.ai',
      },
      {
        name: 'Notion AI',
        desc: '노트 자동 요약',
        usage:
          '작성한 노트를 AI가 자동으로 요약, 액션 아이템 추출',
        url: 'https://notion.so',
      },
      {
        name: 'ChatGPT',
        desc: '단계별 요약',
        usage:
          '"초등학생도 이해할 수 있게 → 대학생 수준으로 → 전문가 수준으로" 3단계 요약',
        url: 'https://chat.openai.com',
      },
    ],

    tips: [
      'AI 요약을 그대로 쓰지 말고, 반드시 "나만의 한 줄 요약"을 추가하세요 — 이 과정이 진짜 학습',
      '"3줄 요약 → 1줄 요약 → 한 단어 요약"으로 점점 압축하는 연습이 효과적',
      '요약 노트를 시험 전날 한 번만 훑어도 전체 내용이 떠오르는 경험을 하게 될 거예요',
    ],
  },

  'creative-maker': {
    id: 'creative-maker',
    emoji: '✨',
    label: 'AI 창작 학습형',
    shortLabel: '창작형',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    shortDesc: '배운 것을 콘텐츠로 만들며 익히는 당신!',
    description: `당신에게 가장 맞는 AI 공부법은 "배운 내용을 AI로 콘텐츠를 만들며 학습하기"입니다!

블로그 글, 유튜브 스크립트, 인스타 카드뉴스 등 "남에게 보여줄 콘텐츠"를 만드는 과정에서 가장 깊이 학습하는 타입이에요. 아웃풋이 곧 공부인 당신에게 AI는 최고의 창작 파트너입니다.`,

    expertTip:
      '학생들이 배운 내용을 카드뉴스로 만들어 공유하는 수업이 시험 점수 향상에도 효과적이었어요. 만드는 과정 자체가 복습이니까요.',

    dailyRoutine: {
      morning:
        '오늘 배울 내용을 어떤 콘텐츠로 만들지 기획 (블로그? 쇼츠? 카드뉴스?)',
      afternoon: '학습 후 AI와 함께 콘텐츠 초안 제작',
      evening:
        '초안을 편집하고 발행 → 배운 내용이 자연스럽게 장기 기억에 저장',
      weekend:
        '한 주간 만든 콘텐츠 리뷰 + 가장 반응 좋은 주제로 다음 주 기획',
    },

    recommendedTools: [
      {
        name: 'ChatGPT',
        desc: '콘텐츠 초안 생성',
        usage:
          '"이 내용을 블로그 포스트 / 쇼츠 스크립트 / 카드뉴스로 만들어줘"',
        url: 'https://chat.openai.com',
      },
      {
        name: 'Canva AI',
        desc: '시각 콘텐츠 제작',
        usage:
          '학습 내용을 인스타 카드뉴스나 인포그래픽으로 변환',
        url: 'https://canva.com',
      },
      {
        name: 'Gamma',
        desc: 'AI 슬라이드 제작',
        usage: '배운 내용을 5분 분량 발표자료로 자동 생성',
        url: 'https://gamma.app',
      },
    ],

    tips: [
      '완벽한 콘텐츠보다 "매일 1개 발행"이 핵심 — 양이 질을 만듭니다',
      '배운 내용을 3가지 다른 포맷(글/영상/이미지)으로 만들면 이해도가 3배',
      '콘텐츠를 만드는 과정에서 "아, 이 부분은 내가 잘 모르겠다"를 발견하는 게 최고의 복습',
    ],
  },
};

export interface StudyMethodQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    type: StudyMethodType;
  }[];
}

export const studyMethodQuestions: StudyMethodQuestion[] = [
  {
    id: 1,
    text: '새로운 개념을 처음 접할 때, 가장 먼저 하고 싶은 것은?',
    options: [
      { text: 'AI에게 "이게 뭐야?" 물어보고 대화를 이어가기', type: 'prompt-writer' },
      { text: '관련 다이어그램이나 도표를 찾아보기', type: 'visual-noter' },
      { text: '바로 관련 문제를 풀어보기', type: 'quiz-challenger' },
      { text: '원본 자료나 논문을 찾아 깊이 읽기', type: 'research-diver' },
    ],
  },
  {
    id: 2,
    text: '공부한 내용을 가장 오래 기억하는 방법은?',
    options: [
      { text: '배운 걸로 직접 프로젝트를 만들어봤을 때', type: 'project-doer' },
      { text: '핵심을 한 장으로 요약 정리했을 때', type: 'summary-master' },
      { text: '누군가에게 설명하는 콘텐츠를 만들었을 때', type: 'creative-maker' },
      { text: '반복해서 들었을 때', type: 'audio-learner' },
    ],
  },
  {
    id: 3,
    text: '통근/통학 시간에 공부한다면?',
    options: [
      { text: '학습 팟캐스트나 강의 오디오를 듣기', type: 'audio-learner' },
      { text: '어제 배운 내용 요약 노트를 훑어보기', type: 'summary-master' },
      { text: 'AI에게 모바일로 질문하며 대화하기', type: 'prompt-writer' },
      { text: '플래시카드 퀴즈 앱으로 문제 풀기', type: 'quiz-challenger' },
    ],
  },
  {
    id: 4,
    text: '시험이나 발표 준비를 위해 AI를 쓴다면?',
    options: [
      { text: 'AI에게 모의 시험 문제를 만들어달라고 요청', type: 'quiz-challenger' },
      { text: 'AI에게 전체 내용을 요약해달라고 요청', type: 'summary-master' },
      { text: 'AI로 발표 자료를 직접 제작', type: 'creative-maker' },
      { text: 'AI에게 질문하며 내가 이해한 게 맞는지 확인', type: 'prompt-writer' },
    ],
  },
  {
    id: 5,
    text: '새로운 AI 도구를 발견했을 때, 당신의 반응은?',
    options: [
      { text: '바로 실습 프로젝트에 활용해보기', type: 'project-doer' },
      { text: '도구의 원리와 기능을 깊이 조사하기', type: 'research-diver' },
      { text: '도구 사용법을 정리해서 블로그에 올리기', type: 'creative-maker' },
      { text: '도구로 학습 시각 자료를 만들어보기', type: 'visual-noter' },
    ],
  },
  {
    id: 6,
    text: '어려운 개념을 이해하기 위해 선호하는 방식은?',
    options: [
      { text: '그림이나 도표로 시각화해서 보기', type: 'visual-noter' },
      { text: '전문가의 설명을 음성으로 듣기', type: 'audio-learner' },
      { text: '직접 관련 프로젝트를 해보며 체득하기', type: 'project-doer' },
      { text: '여러 자료를 비교하며 깊이 분석하기', type: 'research-diver' },
    ],
  },
  {
    id: 7,
    text: '학습 결과를 정리하는 당신만의 방식은?',
    options: [
      { text: '마인드맵이나 인포그래픽으로 시각 정리', type: 'visual-noter' },
      { text: '핵심 포인트를 3줄로 초압축 요약', type: 'summary-master' },
      { text: '배운 걸로 콘텐츠(글/영상/카드뉴스) 만들기', type: 'creative-maker' },
      { text: '음성 메모나 녹음으로 정리', type: 'audio-learner' },
    ],
  },
  {
    id: 8,
    text: '스터디 그룹에서 가장 잘 하는 역할은?',
    options: [
      { text: '질문을 많이 던지며 토론 이끌기', type: 'prompt-writer' },
      { text: '조사한 자료를 깊이 있게 공유하기', type: 'research-diver' },
      { text: '팀 프로젝트 결과물 제작 담당', type: 'project-doer' },
      { text: '문제 만들어서 서로 퀴즈 내기', type: 'quiz-challenger' },
    ],
  },
  {
    id: 9,
    text: 'AI를 가장 많이 활용하고 싶은 상황은?',
    options: [
      { text: '긴 자료를 빠르게 요약받고 싶을 때', type: 'summary-master' },
      { text: '직접 뭔가를 만들어야 하는데 도움이 필요할 때', type: 'project-doer' },
      { text: '해당 분야의 최신 트렌드를 파악하고 싶을 때', type: 'research-diver' },
      { text: '학습 내용을 매력적으로 전달하고 싶을 때', type: 'creative-maker' },
    ],
  },
  {
    id: 10,
    text: '이상적인 하루 학습 루틴이 있다면?',
    options: [
      { text: '아침에 듣고 → 낮에 이해하고 → 저녁에 복습', type: 'audio-learner' },
      { text: '읽고 → 정리하고 → 요약하고 → 시각화', type: 'visual-noter' },
      { text: '배우고 → 문제 풀고 → 틀린 거 다시 풀기', type: 'quiz-challenger' },
      { text: '배우고 → 만들고 → 공유하고 → 피드백 받기', type: 'prompt-writer' },
    ],
  },
];
