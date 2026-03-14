export type ChildType = 'explorer' | 'creative' | 'social' | 'logical' | 'steady' | 'perfectionist';

export interface ChildTypeInfo {
  id: ChildType;
  emoji: string;
  animal: string;
  label: string;
  color: string;
  bgColor: string;
  shortDesc: string;
  description: string;
  expertTip: string;

  traits: string[];

  learningEnvironment: {
    title: string;
    tips: string[];
  };

  studyMethods: {
    title: string;
    desc: string;
    icon: string;
  }[];

  doList: string[];
  dontList: string[];

  aiTools: {
    name: string;
    desc: string;
    url: string;
    ageRange: string;
  }[];
}

export const childTypes: Record<ChildType, ChildTypeInfo> = {
  explorer: {
    id: 'explorer',
    emoji: '🔭',
    animal: '🐱 호기심 고양이',
    label: '탐험가형',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    shortDesc: '세상 모든 것이 궁금한 아이!',
    description: `우리 아이는 호기심이 넘치는 탐험가형입니다!

"왜?", "어떻게?"를 입에 달고 살고, 새로운 것을 발견하면 눈이 반짝거려요. 한 가지에 깊이 빠지기보다는 다양한 분야를 넓게 탐색하는 것을 좋아합니다.

이런 아이에게는 다양한 경험의 기회를 주되, 하나의 주제를 조금 더 깊이 파보는 연습도 함께 해주면 좋아요. 탐험가형 아이의 호기심은 미래의 가장 큰 자산이 됩니다!`,

    expertTip: '💡 현직 에듀테크 전문가 팁: AI 코스웨어를 도입한 학교에서 탐험가형 아이들이 자기주도 학습률이 가장 높았어요. 다양한 콘텐츠를 자유롭게 탐색할 수 있는 환경이 이 아이들의 학습 동기를 크게 높여줍니다.',

    traits: [
      '새로운 것에 대한 호기심이 매우 강함',
      '질문이 많고 "왜?"를 자주 물어봄',
      '한 곳에 오래 앉아있기 힘들어함',
      '다양한 분야에 관심을 보이고 빠르게 전환함',
    ],

    learningEnvironment: {
      title: '탐험가형에게 딱 맞는 학습 환경',
      tips: [
        '다양한 주제의 책과 자료를 손닿는 곳에 비치하기',
        '질문에 바로 답하기보다 "같이 찾아볼까?" 유도하기',
        '30분 단위로 과목/활동을 바꿔가며 학습하기',
        '체험 학습, 박물관, 과학관 등 현장 경험 자주 제공하기',
      ],
    },

    studyMethods: [
      {
        title: '주제 탐색 → 깊이 파기 루틴',
        desc: '이번 주는 다양한 주제를 자유롭게 탐색하고, 그중 가장 흥미로운 1가지를 골라 다음 주에 깊이 파보는 2주 사이클이 효과적이에요.',
        icon: '🔍',
      },
      {
        title: '질문 일기 쓰기',
        desc: '하루에 궁금한 것 3가지를 적고, 그중 1가지를 직접 찾아보는 습관을 만들어주세요. 탐구력과 자기주도 학습의 기초가 됩니다.',
        icon: '📓',
      },
      {
        title: '프로젝트 기반 학습',
        desc: '"우리 동네 지도 만들기", "좋아하는 동물 보고서 쓰기" 같은 미니 프로젝트로 호기심을 학습으로 연결해주세요.',
        icon: '🗂️',
      },
    ],

    doList: [
      '질문할 때 "좋은 질문이야!"라고 격려해주세요',
      '다양한 체험 기회를 적극적으로 만들어주세요',
      '관심사가 바뀌어도 자연스러운 과정으로 받아들여주세요',
      'AI 도구로 궁금한 것을 직접 찾아보게 도와주세요',
    ],
    dontList: [
      '"그만 물어봐"라고 호기심을 차단하지 마세요',
      '한 과목만 오래 붙잡아두지 마세요 (역효과)',
      '정답만 알려주지 말고, 찾는 과정을 함께 해주세요',
      '관심사가 자주 바뀐다고 산만하다고 판단하지 마세요',
    ],

    aiTools: [
      { name: 'ChatGPT', desc: '궁금한 것을 바로 물어볼 수 있는 AI 친구', url: 'https://chat.openai.com', ageRange: '초등 고학년+' },
      { name: 'YouTube Kids', desc: '안전한 탐험형 영상 콘텐츠', url: 'https://www.youtubekids.com', ageRange: '초등 저학년' },
      { name: 'Khan Academy', desc: '다양한 과목을 자유롭게 탐색', url: 'https://ko.khanacademy.org', ageRange: '초등~중등' },
    ],
  },

  creative: {
    id: 'creative',
    emoji: '🎨',
    animal: '🦋 상상 나비',
    label: '창의가형',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    shortDesc: '상상력이 풍부한 예술가 아이!',
    description: `우리 아이는 풍부한 상상력을 가진 창의가형입니다!

그림 그리기, 이야기 만들기, 새로운 놀이 발명하기를 좋아해요. 정해진 틀보다는 자유롭게 표현할 수 있는 환경에서 빛이 납니다.

"이건 이렇게 해야 해"보다 "네 방식대로 해봐"라는 말에 더 동기부여 되는 아이예요. 창의가형의 독창적인 시각은 AI 시대에 가장 귀한 능력이 됩니다!`,

    expertTip: '💡 현직 에듀테크 전문가 팁: 창의가형 아이에게 AI 그리기 도구를 소개하면 놀라운 시너지가 나요. 상상한 것을 AI로 시각화하고, 그 위에 자기만의 아이디어를 덧붙이는 경험이 창의력을 배가시킵니다.',

    traits: [
      '그림, 글쓰기, 만들기 등 창작 활동을 즐김',
      '정해진 방식보다 자기만의 방법을 선호함',
      '상상 속 이야기를 자주 함',
      '예술적 감각이 뛰어나고 색감/디자인에 관심이 많음',
    ],

    learningEnvironment: {
      title: '창의가형에게 딱 맞는 학습 환경',
      tips: [
        '그리기 도구, 색연필, 스케치북을 항상 준비해두기',
        '교과 내용을 그림이나 만화로 표현하게 하기',
        '정답이 없는 열린 질문으로 대화하기',
        '작품 전시 공간(벽, 냉장고)을 만들어 성취감 주기',
      ],
    },

    studyMethods: [
      {
        title: '그림으로 공부하기',
        desc: '수학 개념을 그림으로, 역사를 만화로, 과학을 실험 일러스트로 표현하면 교과 내용이 오래 기억에 남아요.',
        icon: '🖌️',
      },
      {
        title: '이야기 만들기 학습법',
        desc: '외울 내용을 이야기로 만들어보세요. "조선시대 왕들의 모험" 같은 스토리로 역사를 배우면 놀랍게 기억해요.',
        icon: '📖',
      },
      {
        title: 'AI로 창작 활동하기',
        desc: 'AI 그림 도구로 상상한 장면을 시각화하거나, AI와 함께 이야기를 써보는 경험이 창의력을 더 키워줘요.',
        icon: '✨',
      },
    ],

    doList: [
      '자유롭게 표현할 시간과 공간을 충분히 주세요',
      '"멋지다! 어떻게 생각한 거야?"로 과정을 칭찬해주세요',
      '다양한 창작 재료와 도구를 접하게 해주세요',
      'AI 그리기/글쓰기 도구를 함께 탐색해보세요',
    ],
    dontList: [
      '"이건 이렇게 해야 해"라고 정답을 강요하지 마세요',
      '창작 결과물을 다른 아이와 비교하지 마세요',
      '공부 시간에 낙서한다고 혼내지 마세요 (표현 방식임)',
      '상상 이야기를 "거짓말"이라고 하지 마세요',
    ],

    aiTools: [
      { name: 'Canva', desc: '직접 디자인하고 작품 만들기', url: 'https://www.canva.com', ageRange: '초등 고학년+' },
      { name: '뤼튼', desc: 'AI와 함께 이야기 쓰기', url: 'https://wrtn.ai', ageRange: '초등 고학년+' },
      { name: 'AutoDraw', desc: '구글의 AI 그림 도구', url: 'https://autodraw.com', ageRange: '초등 저학년+' },
    ],
  },

  social: {
    id: 'social',
    emoji: '🤝',
    animal: '🐶 친화력 강아지',
    label: '사회형',
    color: '#059669',
    bgColor: '#ECFDF5',
    shortDesc: '함께할 때 빛나는 아이!',
    description: `우리 아이는 사람들과 함께할 때 가장 빛나는 사회형입니다!

친구와 어울리기를 좋아하고, 팀 활동에서 리더십을 발휘해요. 혼자 공부하면 집중이 안 되지만, 스터디 그룹이나 토론에서는 눈이 반짝거립니다.

협동 학습과 발표 기회를 많이 만들어주면 학습 효과가 크게 올라갑니다. 사회형 아이의 소통 능력은 AI가 대체할 수 없는 미래 핵심 역량이에요!`,

    expertTip: '💡 현직 에듀테크 전문가 팁: 사회형 아이에게 "배운 것을 동생/친구에게 설명해봐"라고 해보세요. 가르치는 과정에서 이해도가 80% 이상 높아지는 것이 연구로 입증되어 있어요.',

    traits: [
      '친구와 함께 공부할 때 집중력이 높아짐',
      '발표하거나 설명하는 것을 좋아함',
      '팀 프로젝트에서 자연스럽게 리더 역할을 맡음',
      '감정 표현이 풍부하고 공감 능력이 뛰어남',
    ],

    learningEnvironment: {
      title: '사회형에게 딱 맞는 학습 환경',
      tips: [
        '친구와 함께 공부하는 스터디 그룹 만들어주기',
        '배운 내용을 가족에게 "수업"하는 시간 만들기',
        '토론, 발표 기회를 자주 제공하기',
        '온라인 학습 커뮤니티에 참여하게 하기',
      ],
    },

    studyMethods: [
      {
        title: '가르치며 배우기',
        desc: '배운 내용을 동생이나 부모님에게 설명하게 해보세요. 가르치는 과정에서 이해도가 80% 이상 높아집니다.',
        icon: '👨‍🏫',
      },
      {
        title: '토론식 학습',
        desc: '"이게 맞을까 틀릴까?"를 주제로 부모와 미니 토론을 해보세요. 정답보다 생각하는 과정이 중요해요.',
        icon: '💬',
      },
      {
        title: '협동 프로젝트',
        desc: '친구와 함께 발표 자료를 만들거나, 가족과 함께 요리 레시피를 연구하는 등 협동 과제가 효과적이에요.',
        icon: '🤝',
      },
    ],

    doList: [
      '친구와 함께 공부하는 환경을 적극적으로 만들어주세요',
      '발표나 설명 기회를 자주 만들어주세요',
      '"네 생각은 어때?"라고 의견을 자주 물어봐주세요',
      '그룹 활동/캠프 등 사회적 학습 경험을 제공해주세요',
    ],
    dontList: [
      '혼자 조용히 공부하라고 강요하지 마세요',
      '"떠들지 마"로 소통 욕구를 억누르지 마세요',
      '다른 아이들과 성적만으로 비교하지 마세요',
      '친구와 노는 시간을 "공부 시간 낭비"로 보지 마세요',
    ],

    aiTools: [
      { name: 'NotebookLM', desc: '학습 자료로 대화하며 공부', url: 'https://notebooklm.google.com', ageRange: '중학생' },
      { name: 'Padlet', desc: '친구들과 협업 보드 만들기', url: 'https://padlet.com', ageRange: '초등 고학년+' },
      { name: 'ChatGPT', desc: 'AI와 토론 연습하기', url: 'https://chat.openai.com', ageRange: '초등 고학년+' },
    ],
  },

  logical: {
    id: 'logical',
    emoji: '🧩',
    animal: '🦉 논리 부엉이',
    label: '논리형',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    shortDesc: '차근차근 원리를 파고드는 아이!',
    description: `우리 아이는 논리적으로 생각하기를 좋아하는 논리형입니다!

"왜 그런 거야?"를 끝까지 파고들고, 규칙과 패턴을 찾아내는 능력이 뛰어나요. 수학이나 과학 등 체계적인 과목에서 두각을 나타내는 경우가 많습니다.

원리를 이해하면 응용력이 폭발적으로 늘어나는 타입이에요. 논리형 아이의 분석력은 AI 시대의 핵심 역량인 "비판적 사고"의 기초가 됩니다!`,

    expertTip: '💡 현직 에듀테크 전문가 팁: 논리형 아이에게 블록 코딩(스크래치, 엔트리)을 시켜보세요. 코딩은 논리적 사고의 최고의 훈련이면서 동시에 놀이가 됩니다. 게임을 만드는 경험이 수학/과학 흥미로도 이어져요.',

    traits: [
      '수학, 과학, 퍼즐 등 논리적 활동을 즐김',
      '규칙과 패턴을 빠르게 발견함',
      '단계별로 차근차근 이해하는 것을 선호함',
      '"왜?"에 대한 명확한 답을 원함',
    ],

    learningEnvironment: {
      title: '논리형에게 딱 맞는 학습 환경',
      tips: [
        '원리를 먼저 설명한 후 문제를 풀게 하기',
        '보드게임, 퍼즐, 코딩 활동을 자주 제공하기',
        '단계별 학습 계획표를 함께 만들기',
        '질문에 "원리"로 답해주기 (결과만 알려주지 않기)',
      ],
    },

    studyMethods: [
      {
        title: '원리 먼저, 문제 나중에',
        desc: '공식을 외우게 하기보다 "왜 이 공식이 만들어졌는지"를 먼저 알려주세요. 원리를 이해하면 응용 문제를 스스로 풀어요.',
        icon: '🔬',
      },
      {
        title: '분류와 비교 학습',
        desc: '비슷한 개념을 비교표로 정리하는 습관을 만들어주세요. "포유류 vs 파충류" 같은 비교가 논리형에게 최적의 학습법이에요.',
        icon: '📊',
      },
      {
        title: '코딩 & 퍼즐 활동',
        desc: '스크래치, 엔트리 같은 블록 코딩으로 논리적 사고를 게임처럼 연습할 수 있어요. 코딩은 논리형의 최고의 놀이입니다.',
        icon: '💻',
      },
    ],

    doList: [
      '"왜?"라고 물을 때 원리까지 설명해주세요',
      '보드게임, 퍼즐, 코딩 등 논리 활동을 자주 함께 하세요',
      '학습 계획을 아이와 함께 세우세요 (자기주도 학습 습관)',
      '실험, 관찰 등 직접 확인할 수 있는 경험을 제공하세요',
    ],
    dontList: [
      '"그냥 외워"라고 하지 마세요 (원리를 알아야 외워짐)',
      '이해 없이 반복 문제만 풀게 하지 마세요',
      '질문이 너무 많다고 답답해하지 마세요',
      '빠르게 넘어가라고 재촉하지 마세요 (깊이 이해하는 시간 필요)',
    ],

    aiTools: [
      { name: 'Scratch', desc: '블록 코딩으로 논리적 사고 연습', url: 'https://scratch.mit.edu', ageRange: '초등 저학년+' },
      { name: 'Khan Academy', desc: '단계별 수학/과학 학습', url: 'https://ko.khanacademy.org', ageRange: '초등~중등' },
      { name: 'Brilliant', desc: '인터랙티브 논리/수학 문제', url: 'https://brilliant.org', ageRange: '초등 고학년+' },
    ],
  },

  steady: {
    id: 'steady',
    emoji: '🐢',
    animal: '🐢 끈기 거북이',
    label: '꾸준형',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    shortDesc: '천천히 하지만 확실하게 가는 아이!',
    description: `우리 아이는 꾸준하고 성실한 꾸준형입니다!

화려하지는 않지만, 묵묵히 자기 페이스대로 학습하는 타입이에요. 한번 습관이 잡히면 흔들리지 않고, 반복 학습에서 강한 모습을 보입니다.

급하게 재촉하기보다 충분한 시간을 주고 기다려주면, 결국 가장 단단한 실력을 쌓는 아이예요. 꾸준형의 성실함은 어떤 AI도 대신할 수 없는 가장 강력한 무기입니다!`,

    expertTip: '💡 현직 에듀테크 전문가 팁: 꾸준형 아이에게는 "매일 10분"이 "주말에 2시간"보다 10배 효과적입니다. 짧지만 매일 하는 루틴을 만들어주세요. 학습 습관 앱과 함께하면 성취감도 시각화됩니다.',

    traits: [
      '자기만의 페이스로 꾸준히 학습함',
      '반복 연습을 싫어하지 않음',
      '급격한 변화보다 안정적인 루틴을 선호함',
      '한번 이해한 것은 오래 기억함',
    ],

    learningEnvironment: {
      title: '꾸준형에게 딱 맞는 학습 환경',
      tips: [
        '매일 같은 시간, 같은 장소에서 공부하는 루틴 만들기',
        '작은 목표를 세우고 달성할 때마다 스티커/체크 표시',
        '충분한 시간을 주고 재촉하지 않기',
        '진도보다 이해도를 중시하는 분위기 만들기',
      ],
    },

    studyMethods: [
      {
        title: '루틴 학습법',
        desc: '매일 정해진 시간에 30분씩 공부하는 습관이 이 아이에겐 가장 효과적이에요. 꾸준형은 루틴이 곧 실력이 됩니다.',
        icon: '📅',
      },
      {
        title: '반복 + 누적 복습',
        desc: '어제 배운 것 5분 복습 → 오늘 새로운 것 학습 → 내일 어제+오늘 복습. 이 사이클이 꾸준형에게 최적이에요.',
        icon: '🔄',
      },
      {
        title: '성장 그래프 만들기',
        desc: '주간/월간 학습량을 그래프로 시각화해주세요. 자기가 얼마나 성장했는지 눈으로 확인하면 큰 동기부여가 됩니다.',
        icon: '📈',
      },
    ],

    doList: [
      '매일 규칙적인 학습 루틴을 함께 만들어주세요',
      '작은 성취를 자주 칭찬해주세요 ("오늘도 해냈네!")',
      '충분한 시간을 주고 기다려주세요',
      '장기적인 목표를 함께 세우고 중간 점검해주세요',
    ],
    dontList: [
      '"빨리빨리"라고 재촉하지 마세요',
      '다른 아이의 진도와 비교하지 마세요',
      '갑자기 학습 방법이나 스케줄을 바꾸지 마세요',
      '느리다고 답답해하는 표정을 짓지 마세요 (아이가 다 느낍니다)',
    ],

    aiTools: [
      { name: 'Todo Mate', desc: '매일 학습 습관 체크 앱', url: 'https://todomate.net', ageRange: '초등 고학년+' },
      { name: 'Khan Academy', desc: '자기 페이스대로 학습 진행', url: 'https://ko.khanacademy.org', ageRange: '초등~중등' },
      { name: 'Quizlet', desc: '반복 학습에 최적화된 플래시카드', url: 'https://quizlet.com', ageRange: '초등 고학년+' },
    ],
  },

  perfectionist: {
    id: 'perfectionist',
    emoji: '⭐',
    animal: '🦊 완벽 여우',
    label: '완벽주의형',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    shortDesc: '높은 기준을 가진 신중한 아이!',
    description: `우리 아이는 높은 기준을 가진 완벽주의형입니다!

뭐든 제대로 하고 싶어 하고, 실수하는 것을 매우 싫어해요. 꼼꼼하고 정확한 것이 장점이지만, 때로는 시작을 못 하거나 스트레스를 받기도 합니다.

"완벽하지 않아도 괜찮아"라는 메시지를 자주 전해주세요. 완벽주의형의 높은 기준은 올바르게 다듬어주면 최고의 퀄리티를 만들어내는 능력이 됩니다!`,

    expertTip: '💡 현직 에듀테크 전문가 팁: 완벽주의형 아이에게는 "초안 → 수정 → 완성"의 3단계 프로세스를 알려주세요. "처음부터 완벽하지 않아도 돼. 고치면 되니까!"라는 메시지가 이 아이들의 잠재력을 열어줍니다.',

    traits: [
      '과제나 작품을 완벽하게 마무리하고 싶어함',
      '실수하면 크게 좌절하거나 다시 하려고 함',
      '시작 전에 오래 고민하는 편임',
      '결과물의 퀄리티가 또래보다 높은 편임',
    ],

    learningEnvironment: {
      title: '완벽주의형에게 딱 맞는 학습 환경',
      tips: [
        '"80점이면 충분해"라는 기준을 함께 정하기',
        '과정을 칭찬하기 (결과보다 노력에 초점)',
        '실수해도 괜찮은 안전한 분위기 만들기',
        '초안 → 수정 → 완성의 단계별 접근 알려주기',
      ],
    },

    studyMethods: [
      {
        title: '초안 먼저, 완성은 나중에',
        desc: '처음부터 완벽할 필요 없다는 것을 알려주세요. "일단 대충 써보고, 나중에 고치자!" 이 한마디가 큰 도움이 됩니다.',
        icon: '✏️',
      },
      {
        title: '타이머 학습법',
        desc: '15분 안에 문제 풀기 등 시간 제한을 두면 완벽함에 집착하지 않고 실행력이 올라갑니다. 단, 타이머는 압박이 아닌 게임처럼!',
        icon: '⏰',
      },
      {
        title: '실수 일기',
        desc: '"오늘의 실수"를 긍정적으로 기록하는 습관을 만들어주세요. "이 실수 덕분에 ○○을 배웠다!"로 실수를 성장으로 연결해요.',
        icon: '📝',
      },
    ],

    doList: [
      '"잘했어! 노력한 과정이 대단해"라고 과정을 칭찬해주세요',
      '실수해도 괜찮다는 메시지를 자주 전해주세요',
      '"완벽하지 않아도 제출해보자"라고 용기를 주세요',
      '부모도 실수하는 모습을 자연스럽게 보여주세요',
    ],
    dontList: [
      '"100점 맞아야지"라고 높은 기대를 표현하지 마세요',
      '실수를 지적하거나 혼내지 마세요 (스스로 충분히 괴로워함)',
      '"빨리 시작해"라고 재촉하지 마세요 (준비 시간이 필요함)',
      '다른 아이의 빠른 결과물과 비교하지 마세요',
    ],

    aiTools: [
      { name: 'Grammarly', desc: '글쓰기 검수 도구 (영어)', url: 'https://grammarly.com', ageRange: '중학생' },
      { name: 'Notion', desc: '체계적으로 학습 계획 관리', url: 'https://notion.so', ageRange: '초등 고학년+' },
      { name: 'Canva', desc: '예쁜 결과물을 쉽게 만들기', url: 'https://canva.com', ageRange: '초등 고학년+' },
    ],
  },
};

export interface ChildQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    type: ChildType;
  }[];
}

export const childQuestions: ChildQuestion[] = [
  {
    id: 1,
    text: '아이가 새로운 장난감을 받았을 때, 가장 먼저 하는 행동은?',
    options: [
      { text: '이리저리 분해하고 구석구석 살펴본다', type: 'explorer' },
      { text: '자기만의 새로운 놀이 방법을 만들어낸다', type: 'creative' },
      { text: '친구를 불러서 같이 놀고 싶어한다', type: 'social' },
      { text: '설명서를 먼저 읽거나 작동 원리를 물어본다', type: 'logical' },
      { text: '조용히 천천히 익숙해지면서 탐색한다', type: 'steady' },
      { text: '완벽하게 조립하거나 세팅이 될 때까지 만진다', type: 'perfectionist' },
    ],
  },
  {
    id: 2,
    text: '숙제를 할 때 아이의 모습은?',
    options: [
      { text: '궁금한 것이 생기면 숙제를 멈추고 찾아본다', type: 'explorer' },
      { text: '숙제를 자기만의 방식으로 꾸미거나 변형한다', type: 'creative' },
      { text: '친구에게 전화해서 같이 하자고 한다', type: 'social' },
      { text: '계획을 세우고 순서대로 진행한다', type: 'logical' },
      { text: '정해진 시간에 묵묵히 끝낸다', type: 'steady' },
      { text: '완벽하게 할 때까지 여러 번 고친다', type: 'perfectionist' },
    ],
  },
  {
    id: 3,
    text: '아이가 가장 좋아하는 놀이 시간의 모습은?',
    options: [
      { text: '밖에 나가서 새로운 장소를 탐험한다', type: 'explorer' },
      { text: '그림을 그리거나 무언가를 만든다', type: 'creative' },
      { text: '친구들과 역할놀이나 팀 게임을 한다', type: 'social' },
      { text: '퍼즐, 레고, 보드게임에 집중한다', type: 'logical' },
      { text: '좋아하는 놀이를 반복적으로 꾸준히 한다', type: 'steady' },
      { text: '무엇이든 가장 잘하려고 노력한다', type: 'perfectionist' },
    ],
  },
  {
    id: 4,
    text: '새 학기 첫날, 아이의 반응은?',
    options: [
      { text: '새로운 환경이 신나서 이것저것 둘러본다', type: 'explorer' },
      { text: '자기 자리를 예쁘게 꾸미거나 이름표를 만든다', type: 'creative' },
      { text: '새 친구에게 먼저 말을 건다', type: 'social' },
      { text: '시간표와 규칙을 먼저 확인한다', type: 'logical' },
      { text: '조용히 관찰하다가 천천히 적응한다', type: 'steady' },
      { text: '준비물이 다 맞는지 꼼꼼히 확인한다', type: 'perfectionist' },
    ],
  },
  {
    id: 5,
    text: '아이에게 어려운 문제를 줬을 때 반응은?',
    options: [
      { text: '여러 가지 방법을 시도해보며 탐색한다', type: 'explorer' },
      { text: '엉뚱하지만 창의적인 풀이를 생각해낸다', type: 'creative' },
      { text: '주변 사람에게 도움을 요청한다', type: 'social' },
      { text: '차근차근 단계별로 분석하며 접근한다', type: 'logical' },
      { text: '포기하지 않고 끈기 있게 도전한다', type: 'steady' },
      { text: '못 풀 것 같으면 시작 자체를 망설인다', type: 'perfectionist' },
    ],
  },
  {
    id: 6,
    text: '아이가 칭찬받을 때 가장 좋아하는 말은?',
    options: [
      { text: '"대단해! 이런 것도 찾아봤구나!"', type: 'explorer' },
      { text: '"와, 이건 네가 직접 만든 거야? 멋지다!"', type: 'creative' },
      { text: '"친구들이 너랑 같이 하면 좋아하겠다!"', type: 'social' },
      { text: '"정확하게 풀었네! 논리적이구나!"', type: 'logical' },
      { text: '"매일 꾸준히 한 게 대단해!"', type: 'steady' },
      { text: '"정말 완벽하게 해냈구나!"', type: 'perfectionist' },
    ],
  },
  {
    id: 7,
    text: '가족 여행 중 아이가 가장 좋아하는 활동은?',
    options: [
      { text: '새로운 곳을 직접 돌아다니며 구경한다', type: 'explorer' },
      { text: '사진을 찍거나 여행 일기를 쓴다', type: 'creative' },
      { text: '현지 사람이나 다른 여행객과 대화한다', type: 'social' },
      { text: '지도를 보며 동선을 계획한다', type: 'logical' },
      { text: '정해진 일정대로 차분하게 움직인다', type: 'steady' },
      { text: '가장 유명한 명소를 빠짐없이 방문한다', type: 'perfectionist' },
    ],
  },
  {
    id: 8,
    text: '아이가 스트레스를 받을 때 보이는 모습은?',
    options: [
      { text: '다른 관심사로 빠르게 전환한다', type: 'explorer' },
      { text: '그림을 그리거나 음악을 들으며 해소한다', type: 'creative' },
      { text: '친구나 가족에게 이야기하며 풀어낸다', type: 'social' },
      { text: '원인을 분석하고 해결 방법을 찾으려 한다', type: 'logical' },
      { text: '조용히 혼자만의 시간을 가진다', type: 'steady' },
      { text: '자기 자신에게 화를 내거나 좌절한다', type: 'perfectionist' },
    ],
  },
  {
    id: 9,
    text: '학교에서 발표를 할 때 아이의 모습은?',
    options: [
      { text: '주제 외의 재미있는 사실도 함께 소개한다', type: 'explorer' },
      { text: '발표 자료를 독특하고 예쁘게 만든다', type: 'creative' },
      { text: '자신감 있게 또는 즐겁게 발표한다', type: 'social' },
      { text: '논리적으로 차분하게 설명한다', type: 'logical' },
      { text: '준비한 대로 꼼꼼하게 읽어나간다', type: 'steady' },
      { text: '실수할까봐 여러 번 연습한다', type: 'perfectionist' },
    ],
  },
  {
    id: 10,
    text: '아이에게 태블릿/스마트폰을 주면 가장 먼저 하는 것은?',
    options: [
      { text: '이것저것 앱을 열어보며 탐색한다', type: 'explorer' },
      { text: '그림 앱이나 영상 편집 앱을 연다', type: 'creative' },
      { text: '친구에게 메시지를 보내거나 영상 통화한다', type: 'social' },
      { text: '교육 앱이나 퀴즈 게임을 한다', type: 'logical' },
      { text: '평소 즐겨보는 콘텐츠를 정해진 시간만큼 본다', type: 'steady' },
      { text: '게임에서 최고 점수나 올클리어를 목표로 한다', type: 'perfectionist' },
    ],
  },
  {
    id: 11,
    text: '아이의 방/책상 상태는 어떤 편인가요?',
    options: [
      { text: '여러 가지 물건이 섞여 있지만 본인은 다 아는 상태', type: 'explorer' },
      { text: '자기만의 방식으로 꾸며져 있다', type: 'creative' },
      { text: '친구들의 선물이나 사진이 많다', type: 'social' },
      { text: '분류되어 정리되어 있다 (과목별, 종류별)', type: 'logical' },
      { text: '항상 비슷한 상태를 유지한다', type: 'steady' },
      { text: '매우 깔끔하거나, 정리를 못 해서 스트레스받는다', type: 'perfectionist' },
    ],
  },
  {
    id: 12,
    text: '아이가 "커서 뭐가 되고 싶어?"라고 물으면?',
    options: [
      { text: '매번 다른 대답을 한다 (이번 달은 우주인, 다음 달은 요리사)', type: 'explorer' },
      { text: '만화가, 작가, 디자이너 등 창작 관련 직업', type: 'creative' },
      { text: '선생님, 의사, 아이돌 등 사람과 관련된 직업', type: 'social' },
      { text: '과학자, 프로그래머, 발명가 등 분석/기술 직업', type: 'logical' },
      { text: '구체적이진 않지만 착실하게 준비하겠다고 함', type: 'steady' },
      { text: '"아직 모르겠어..." (결정이 어려움) 또는 매우 구체적인 목표', type: 'perfectionist' },
    ],
  },
];

export const combinations: Record<string, string> = {
  'explorer-creative': '호기심과 상상력이 만나, 독창적인 아이디어로 세상을 탐험합니다. 다양한 경험 속에서 자기만의 작품을 만들어내는 잠재력이 있어요.',
  'explorer-social': '새로운 것을 탐험하면서 주변 사람들과 나누기를 좋아합니다. 친구와 함께하는 체험 활동에서 가장 빛이 나요.',
  'explorer-logical': '호기심이 논리적 탐구로 이어집니다. 과학자나 연구자의 기질이 보여요. "왜?"를 끝까지 파고드는 타입!',
  'explorer-steady': '호기심은 많지만 꾸준히 파고드는 힘도 있어요. 관심 분야가 정해지면 놀라운 깊이를 보여주는 타입입니다.',
  'explorer-perfectionist': '새로운 것을 탐험하되 제대로 이해하고 싶어합니다. 탐구 보고서의 퀄리티가 또래보다 높은 편이에요.',

  'creative-explorer': '창작 활동에 다양한 주제를 접목시키는 아이에요. 오늘은 공룡 그림, 내일은 우주선 설계도! 소재가 무궁무진합니다.',
  'creative-social': '함께 창작하는 것을 좋아하는 예술적 리더! 연극, 뮤지컬, 팀 프로젝트에서 빛이 나요.',
  'creative-logical': '예술적 감성과 논리적 구조가 공존합니다. 코딩, 건축, 게임 디자인 같은 분야에서 두각을 나타낼 수 있어요.',
  'creative-steady': '창작 활동을 꾸준히 이어가는 아이에요. 매일 그림 일기를 쓰거나, 시리즈 작품을 만들어내는 타입입니다.',
  'creative-perfectionist': '작품의 완성도에 대한 기준이 높아요. 뛰어난 결과물을 만들어내지만, 시작이 늦을 수 있으니 격려해주세요.',

  'social-explorer': '사람들과 함께 새로운 경험을 하는 것을 좋아해요. 그룹 체험 활동의 분위기 메이커입니다.',
  'social-creative': '친구들과 함께 만들고 표현하는 활동에서 빛이 납니다. 학교 축제, 동아리 활동의 핵심 멤버예요.',
  'social-logical': '토론과 논리적 대화를 즐겨요. 디베이트 대회나 모의 재판 같은 활동이 딱 맞습니다.',
  'social-steady': '주변 사람들과 안정적인 관계를 유지하며 꾸준히 함께 성장합니다. 신뢰받는 친구이자 팀원이에요.',
  'social-perfectionist': '다른 사람들의 기대에 부응하고 싶어하는 책임감 있는 아이예요. 리더 역할을 맡으면 완벽하게 해내려 합니다.',

  'logical-explorer': '다양한 분야의 원리를 파악하는 것을 즐깁니다. 백과사전형 아이로, 지식의 폭과 깊이가 모두 넓어요.',
  'logical-creative': '논리적 구조 위에 창의적 해결책을 만들어요. 프로그래밍, 발명, 공학 분야에서 잠재력이 큽니다.',
  'logical-social': '논리적으로 설명하고 설득하는 능력이 뛰어나요. 팀에서 전략가 역할을 자연스럽게 맡습니다.',
  'logical-steady': '체계적이고 꾸준한 학습의 모범생 타입! 계획대로 차근차근 진행하며 안정적인 성과를 냅니다.',
  'logical-perfectionist': '정확함을 추구하는 분석가 타입이에요. 수학, 과학에서 뛰어난 성과를 보이지만, 실수를 두려워할 수 있어요.',

  'steady-explorer': '관심 분야가 정해지면 끈기 있게 깊이 파고듭니다. 느리지만 확실하게 전문가가 되는 타입이에요.',
  'steady-creative': '매일 꾸준히 창작 활동을 이어갑니다. 일기, 그림, 음악 등 오래 지속하는 취미를 갖게 되면 뛰어난 실력으로 발전해요.',
  'steady-social': '변함없이 친구를 챙기는 든든한 존재예요. 깊고 오래가는 우정을 만들어갑니다.',
  'steady-logical': '체계적이고 꾸준한 학습의 정석! 루틴을 지키며 착실하게 실력을 쌓아가는 모범적인 학습자예요.',
  'steady-perfectionist': '꼼꼼하고 성실한 모범생 타입이에요. 기본에 충실하며 실수가 적은 편이지만, 가끔 쉬어가는 것도 필요합니다.',

  'perfectionist-explorer': '관심사를 발견하면 완벽하게 파고드는 타입! 특정 분야의 "덕후"가 되면 또래 중 최고 수준에 도달해요.',
  'perfectionist-creative': '완성도 높은 작품을 만들어내는 아이에요. 시간은 걸리지만 결과물의 퀄리티가 뛰어납니다.',
  'perfectionist-social': '책임감이 강하고 리더십이 있어요. 팀 프로젝트에서 완벽한 결과물을 위해 노력합니다.',
  'perfectionist-logical': '정확성과 논리성을 모두 갖춘 분석가! 수학/과학에서 탁월하지만, "틀려도 괜찮아"를 자주 들려주세요.',
  'perfectionist-steady': '높은 기준을 꾸준히 유지하는 성실한 아이에요. 안정적이고 믿음직하지만, 자기 자신에게 너무 엄격할 수 있어요.',
};

export const AGE_RANGE_COLORS: Record<string, { bg: string; text: string }> = {
  '초등 저학년': { bg: '#FEF3C7', text: '#92400E' },
  '초등 저학년+': { bg: '#FEF3C7', text: '#92400E' },
  '초등 고학년+': { bg: '#DBEAFE', text: '#1E40AF' },
  '초등~중등': { bg: '#D1FAE5', text: '#065F46' },
  '중학생': { bg: '#EDE9FE', text: '#5B21B6' },
};
