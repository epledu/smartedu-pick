const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';

export function initKakao(): void {
  if (typeof window === 'undefined') return;
  if (!window.Kakao) return;
  if (window.Kakao.isInitialized()) return;
  if (!KAKAO_JS_KEY) return;
  window.Kakao.init(KAKAO_JS_KEY);
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
  buttonTitle = '테스트 해보기',
}: ShareKakaoParams): void {
  if (typeof window === 'undefined') return;

  initKakao();

  if (!window.Kakao?.Share) {
    window.open(linkUrl, '_blank');
    return;
  }

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
