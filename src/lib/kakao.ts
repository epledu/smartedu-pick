const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';

export function initKakao(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.Kakao) return false;
  if (window.Kakao.isInitialized()) return true;
  if (!KAKAO_JS_KEY) return false;
  window.Kakao.init(KAKAO_JS_KEY);
  return true;
}

interface ShareKakaoParams {
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl: string;
  buttonTitle?: string;
}

export function shareKakao({
  title,
  description,
  imageUrl,
  linkUrl,
  buttonTitle = '나도 테스트 해보기',
}: ShareKakaoParams): void {
  if (typeof window === 'undefined') return;

  // SDK 로드 확인
  if (!window.Kakao) {
    fallbackCopyUrl(linkUrl);
    return;
  }

  // 초기화 안 됐으면 초기화
  if (!window.Kakao.isInitialized()) {
    if (!KAKAO_JS_KEY) {
      fallbackCopyUrl(linkUrl);
      return;
    }
    window.Kakao.init(KAKAO_JS_KEY);
  }

  // Share 모듈 확인
  if (!window.Kakao.Share) {
    fallbackCopyUrl(linkUrl);
    return;
  }

  // 카카오톡 공유 실행
  const link = { mobileWebUrl: linkUrl, webUrl: linkUrl };

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl: imageUrl || 'https://smartedu-pick.com/og/main-og.png',
      link,
    },
    buttons: [{ title: buttonTitle, link }],
  });
}

function fallbackCopyUrl(url: string): void {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('카카오톡 SDK를 불러올 수 없어 URL이 복사되었습니다.');
    })
    .catch(() => {
      // clipboard API 실패 시 수동 복사
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('카카오톡 SDK를 불러올 수 없어 URL이 복사되었습니다.');
    });
}
