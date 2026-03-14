export type LearningType = 'visual' | 'auditory' | 'kinesthetic' | 'analytical';

export interface StudyMethod {
  title: string;
  desc: string;
  icon: string;
}

export interface RecommendedTool {
  name: string;
  desc: string;
  url: string;
}

export interface Compatibility {
  best: LearningType;
  bestLabel: string;
  bestDesc: string;
}

export interface LearningTypeInfo {
  id: LearningType;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  shortDesc: string;
  description: string;
  expertTip: string;
  studyMethods: StudyMethod[];
  recommendedTools: RecommendedTool[];
  compatibility: Compatibility;
}

export const learningTypes: Record<LearningType, LearningTypeInfo> = {
  visual: {
    id: 'visual',
    emoji: '👁️',
    label: '시각형 학습자',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    shortDesc: '보면서 이해하는 당신!',
    description: `당신은 눈으로 보면서 학습할 때 가장 효과적인 시각형 학습자입니다.

마인드맵, 도표, 영상 강의 등 시각 자료를 활용하면 복잡한 내용도 빠르게 이해할 수 있어요. 교과서의 그림이나 차트를 먼저 보는 습관이 있다면 전형적인 시각형입니다.

이미지와 색상을 활용한 노트 정리, 개념 지도 작성이 당신의 학습 효율을 크게 높여줄 거예요.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 시각형 학습자는 AI 이미지 생성 도구를 활용해 추상적인 개념을 시각화하면 이해 속도가 2배 이상 빨라집니다. 개념별 색상 코드를 정해두면 복습할 때 기억 회상이 훨씬 쉬워져요.',
    studyMethods: [
      {
        title: '마인드맵 학습법',
        desc: '핵심 개념을 중심에 놓고, 관련 내용을 가지치기로 연결하세요. 색상을 다르게 사용하면 기억력이 2배 이상 향상됩니다.',
        icon: '🗺️',
      },
      {
        title: '영상 + 스크린샷 정리',
        desc: '강의 영상을 보면서 핵심 장면을 스크린샷으로 캡처하세요. 텍스트보다 이미지로 복습하면 훨씬 효과적입니다.',
        icon: '📸',
      },
      {
        title: '컬러 노트 필기',
        desc: '4가지 색상 펜으로 중요도를 구분하며 필기하세요. 빨강(핵심), 파랑(설명), 초록(예시), 검정(기본).',
        icon: '🖊️',
      },
    ],
    recommendedTools: [
      {
        name: 'Canva',
        desc: 'AI로 학습 자료를 시각적으로 정리',
        url: 'https://www.canva.com',
      },
      {
        name: 'Miro',
        desc: '마인드맵과 개념 지도 제작',
        url: 'https://miro.com',
      },
      {
        name: 'YouTube',
        desc: '시각적 강의 콘텐츠의 보고',
        url: 'https://www.youtube.com',
      },
    ],
    compatibility: {
      best: 'analytical',
      bestLabel: '분석형',
      bestDesc: '시각형의 직관 + 분석형의 체계 = 최강의 학습 조합!',
    },
  },

  auditory: {
    id: 'auditory',
    emoji: '👂',
    label: '청각형 학습자',
    color: '#059669',
    bgColor: '#ECFDF5',
    shortDesc: '들으면서 이해하는 당신!',
    description: `당신은 귀로 들으면서 학습할 때 가장 효과적인 청각형 학습자입니다.

강의를 듣거나 토론에 참여할 때 내용이 잘 들어오고, 혼잣말로 되뇌면서 공부하면 기억에 오래 남아요. 음악을 들으며 공부하는 것도 청각형에게는 방해가 아닌 도움이 될 수 있습니다.

중요한 내용을 소리 내어 읽거나, 녹음해서 반복 청취하는 것이 효과적이에요.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 청각형 학습자는 NotebookLM의 팟캐스트 생성 기능을 활용하면 학습 자료를 대화 형식으로 변환해 들을 수 있어요. 통학길 학습 효율이 극대화됩니다.',
    studyMethods: [
      {
        title: '강의 녹음 + 반복 청취',
        desc: '수업이나 강의를 녹음하고, 통학길이나 운동 시간에 반복 청취하세요. 2~3회 반복이면 핵심이 자연스럽게 기억됩니다.',
        icon: '🎧',
      },
      {
        title: '스터디 그룹 토론',
        desc: '친구나 동료와 배운 내용을 서로 설명하세요. 말로 표현하는 과정에서 이해가 깊어지고, 빈틈을 발견할 수 있어요.',
        icon: '💬',
      },
      {
        title: '소리 내어 읽기',
        desc: '중요한 내용은 반드시 소리 내어 읽으세요. 눈으로만 읽을 때보다 기억 유지율이 70% 이상 높아집니다.',
        icon: '🗣️',
      },
    ],
    recommendedTools: [
      {
        name: 'Clova Note',
        desc: 'AI 음성 인식 기반 강의 노트 정리',
        url: 'https://clovanote.naver.com',
      },
      {
        name: 'Podcast',
        desc: '교육 관련 팟캐스트 청취',
        url: 'https://podcasts.apple.com',
      },
      {
        name: 'NotebookLM',
        desc: '구글 AI 기반 학습 자료 요약 & 팟캐스트 생성',
        url: 'https://notebooklm.google.com',
      },
    ],
    compatibility: {
      best: 'kinesthetic',
      bestLabel: '실행형',
      bestDesc: '청각형의 이해력 + 실행형의 행동력 = 빠른 실전 적용!',
    },
  },

  kinesthetic: {
    id: 'kinesthetic',
    emoji: '🖐️',
    label: '실행형 학습자',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    shortDesc: '직접 해보면서 이해하는 당신!',
    description: `당신은 직접 해보면서 학습할 때 가장 효과적인 실행형 학습자입니다.

이론보다 실습을 좋아하고, 프로젝트나 실험을 통해 배울 때 가장 빠르게 습득해요. 가만히 앉아서 듣기만 하면 집중이 안 되고, 무언가를 만들어볼 때 눈이 번쩍 뜨이는 타입이에요.

배운 내용을 바로 적용해보는 습관이 당신의 최고 무기입니다.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 실행형 학습자는 ChatGPT에 "이걸 연습할 수 있는 실습 과제를 만들어줘"라고 요청하면 즉시 실행 가능한 과제를 받을 수 있어요. 배우고 바로 해보는 사이클을 만드세요.',
    studyMethods: [
      {
        title: '프로젝트 기반 학습',
        desc: '배운 내용을 바로 작은 프로젝트에 적용하세요. "AI 도구 사용법"을 배웠다면, 바로 자기소개서를 AI로 작성해보는 식이에요.',
        icon: '🔨',
      },
      {
        title: '30분 학습 + 30분 실습',
        desc: '이론 30분, 실습 30분을 번갈아 하세요. 이론만 2시간보다 훨씬 효과적입니다.',
        icon: '⏱️',
      },
      {
        title: '가르치면서 배우기',
        desc: '배운 것을 다른 사람에게 가르쳐보세요. 블로그 포스팅이나 짧은 영상 만들기도 좋은 방법입니다.',
        icon: '👨‍🏫',
      },
    ],
    recommendedTools: [
      {
        name: 'ChatGPT',
        desc: '즉시 실험해볼 수 있는 AI 대화 도구',
        url: 'https://chat.openai.com',
      },
      {
        name: 'Replit',
        desc: '코딩을 바로 실습할 수 있는 온라인 환경',
        url: 'https://replit.com',
      },
      {
        name: 'Gamma',
        desc: 'AI로 발표자료 직접 만들어보기',
        url: 'https://gamma.app',
      },
    ],
    compatibility: {
      best: 'auditory',
      bestLabel: '청각형',
      bestDesc: '실행형의 실천력 + 청각형의 소통력 = 팀 프로젝트 최강!',
    },
  },

  analytical: {
    id: 'analytical',
    emoji: '🧠',
    label: '분석형 학습자',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    shortDesc: '논리적으로 파고드는 당신!',
    description: `당신은 체계적으로 분석하며 학습할 때 가장 효과적인 분석형 학습자입니다.

"왜?"라는 질문을 끊임없이 던지고, 원리를 이해해야 다음으로 넘어가는 타입이에요. 요약 정리를 잘하고, 비교표나 체크리스트를 만드는 것을 좋아합니다.

복잡한 내용을 단계별로 쪼개서 이해하는 능력이 뛰어나 깊이 있는 학습에 강점이 있어요.`,
    expertTip:
      '💡 현직 에듀테크 전문가 팁: 분석형 학습자는 Claude에 "이 개념을 단계별로 분해해서 설명해줘"라고 요청하면 체계적인 학습이 가능해요. 비교표 생성도 AI에게 맡기면 효율이 극대화됩니다.',
    studyMethods: [
      {
        title: '비교표 + 체크리스트',
        desc: '배운 개념들을 비교표로 정리하세요. "A vs B" 형식으로 정리하면 차이점이 명확해지고 기억에 오래 남습니다.',
        icon: '📊',
      },
      {
        title: '왜(Why) 5번 파고들기',
        desc: '하나의 개념에 대해 "왜?"를 5번 반복하세요. 표면적 이해에서 근본 원리까지 도달할 수 있습니다.',
        icon: '🔍',
      },
      {
        title: '요약 노트 → 한 장 정리',
        desc: '배운 내용을 A4 한 장에 압축 정리하세요. 핵심만 추리는 과정 자체가 최고의 복습입니다.',
        icon: '📝',
      },
    ],
    recommendedTools: [
      {
        name: 'Notion AI',
        desc: '체계적 노트 정리 + AI 요약',
        url: 'https://www.notion.so',
      },
      {
        name: 'Claude',
        desc: '논리적 분석과 비교에 강한 AI 어시스턴트',
        url: 'https://claude.ai',
      },
      {
        name: 'Perplexity',
        desc: '출처 기반 정확한 리서치 도구',
        url: 'https://www.perplexity.ai',
      },
    ],
    compatibility: {
      best: 'visual',
      bestLabel: '시각형',
      bestDesc: '분석형의 깊이 + 시각형의 정리력 = 완벽한 학습 노트!',
    },
  },
};

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    type: LearningType;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: '새로운 앱이나 프로그램을 처음 사용할 때, 당신은?',
    options: [
      { text: '화면을 이리저리 눌러보며 직접 탐색한다', type: 'kinesthetic' },
      { text: '사용법 영상이나 스크린샷 가이드를 먼저 찾는다', type: 'visual' },
      { text: '주변 사람에게 사용법을 물어보거나 설명을 듣는다', type: 'auditory' },
      { text: '설정 메뉴와 기능 목록을 체계적으로 살펴본다', type: 'analytical' },
    ],
  },
  {
    id: 2,
    text: '중요한 시험이나 발표를 앞두고 있을 때, 당신의 준비 방법은?',
    options: [
      { text: '핵심 내용을 도표나 그림으로 정리한다', type: 'visual' },
      { text: '내용을 소리 내어 반복해서 읽는다', type: 'auditory' },
      { text: '실제 발표 연습이나 모의 시험을 해본다', type: 'kinesthetic' },
      { text: '요약 노트를 만들고 체크리스트로 점검한다', type: 'analytical' },
    ],
  },
  {
    id: 3,
    text: '처음 가는 장소를 찾아갈 때, 당신은?',
    options: [
      { text: '지도 앱을 보며 경로를 시각적으로 확인한다', type: 'visual' },
      { text: '누군가에게 길을 물어보고 설명을 듣는다', type: 'auditory' },
      { text: '일단 출발해서 걸어가면서 찾는다', type: 'kinesthetic' },
      { text: '주소와 교통편을 미리 꼼꼼하게 검색한다', type: 'analytical' },
    ],
  },
  {
    id: 4,
    text: '온라인 강의를 들을 때, 당신이 가장 선호하는 방식은?',
    options: [
      { text: '시각 자료가 풍부한 영상 강의', type: 'visual' },
      { text: '설명이 자세한 오디오 강의나 팟캐스트', type: 'auditory' },
      { text: '실습 과제가 포함된 인터랙티브 강의', type: 'kinesthetic' },
      { text: '체계적으로 구성된 텍스트 기반 강의', type: 'analytical' },
    ],
  },
  {
    id: 5,
    text: '친구에게 최근에 본 영화를 추천할 때, 당신은?',
    options: [
      { text: '인상적인 장면이나 영상미를 먼저 설명한다', type: 'visual' },
      { text: '대사나 OST 등 기억에 남는 소리를 언급한다', type: 'auditory' },
      { text: '감정적으로 어떤 느낌이었는지를 전달한다', type: 'kinesthetic' },
      { text: '줄거리 구조나 감독의 의도를 분석해서 설명한다', type: 'analytical' },
    ],
  },
  {
    id: 6,
    text: '새로운 기술이나 트렌드를 접했을 때, 당신의 반응은?',
    options: [
      { text: '관련 영상이나 인포그래픽을 찾아본다', type: 'visual' },
      { text: '전문가의 설명이나 인터뷰를 들어본다', type: 'auditory' },
      { text: '직접 사용해보거나 체험해본다', type: 'kinesthetic' },
      { text: '원리와 작동 방식을 깊이 조사한다', type: 'analytical' },
    ],
  },
  {
    id: 7,
    text: '집중이 안 될 때, 당신만의 집중 방법은?',
    options: [
      { text: '공간을 정리하고 시각적으로 깔끔한 환경을 만든다', type: 'visual' },
      { text: '집중용 음악이나 백색 소음을 틀어놓는다', type: 'auditory' },
      { text: '잠깐 산책하거나 스트레칭을 하고 온다', type: 'kinesthetic' },
      { text: 'To-Do 리스트를 작성하고 우선순위를 정한다', type: 'analytical' },
    ],
  },
  {
    id: 8,
    text: '회의나 수업에서 당신이 가장 잘 기억하는 것은?',
    options: [
      { text: '칠판에 적힌 내용이나 보여준 자료', type: 'visual' },
      { text: '발표자가 말한 핵심 멘트나 어조', type: 'auditory' },
      { text: '직접 참여했던 활동이나 토론 내용', type: 'kinesthetic' },
      { text: '전체 흐름과 논리 구조', type: 'analytical' },
    ],
  },
  {
    id: 9,
    text: '쇼핑할 때 당신의 결정 방식은?',
    options: [
      { text: '디자인이나 색상 등 외관을 가장 중시한다', type: 'visual' },
      { text: '주변 사람들의 추천이나 리뷰를 많이 참고한다', type: 'auditory' },
      { text: '직접 만져보고 사용감을 확인해봐야 한다', type: 'kinesthetic' },
      { text: '가격, 사양, 후기를 비교표로 정리해서 판단한다', type: 'analytical' },
    ],
  },
  {
    id: 10,
    text: 'AI 도구(ChatGPT 등)를 사용한다면, 당신이 가장 하고 싶은 것은?',
    options: [
      { text: '멋진 이미지나 디자인을 생성하는 것', type: 'visual' },
      { text: 'AI와 대화하며 아이디어를 발전시키는 것', type: 'auditory' },
      { text: '실제 업무나 과제에 바로 활용하는 것', type: 'kinesthetic' },
      { text: 'AI의 작동 원리와 한계를 파악하는 것', type: 'analytical' },
    ],
  },
  {
    id: 11,
    text: '책을 읽을 때, 당신의 습관은?',
    options: [
      { text: '그림, 도표, 사진이 많은 책을 선호한다', type: 'visual' },
      { text: '오디오북으로 듣거나 소리 내어 읽는다', type: 'auditory' },
      { text: '읽으면서 바로 메모하거나 밑줄을 긋는다', type: 'kinesthetic' },
      { text: '목차를 먼저 보고 전체 구조를 파악한다', type: 'analytical' },
    ],
  },
  {
    id: 12,
    text: '가장 기억에 남는 수업/강의는?',
    options: [
      { text: '슬라이드나 시각 자료가 인상적이었던 수업', type: 'visual' },
      { text: '선생님의 설명이나 이야기가 재미있었던 수업', type: 'auditory' },
      { text: '직접 실험하거나 만들어본 수업', type: 'kinesthetic' },
      { text: '논리적으로 완벽하게 설명된 수업', type: 'analytical' },
    ],
  },
];
