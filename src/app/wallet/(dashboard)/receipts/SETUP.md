# 실제 OCR 설정 방법 (Google Cloud Vision)

기본값으로 앱은 샘플 데이터(Mock OCR)를 사용합니다.  
아래 절차를 따르면 실제 영수증 이미지를 인식할 수 있습니다.

## 무료 티어

Google Cloud Vision API는 **월 1,000건 무료**입니다.  
소규모 개인 사용에는 비용이 발생하지 않습니다.

## 설정 절차

### 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 드롭다운 → **새 프로젝트**
3. 프로젝트 이름 입력 후 **만들기**

### 2. Vision API 활성화

1. 좌측 메뉴 → **API 및 서비스** → **라이브러리**
2. "Cloud Vision API" 검색
3. **사용 설정** 클릭

### 3. API 키 발급

1. 좌측 메뉴 → **API 및 서비스** → **사용자 인증 정보**
2. **사용자 인증 정보 만들기** → **API 키**
3. 생성된 키 복사 (나중에 참조 불가 — 지금 복사하세요)
4. (권장) **키 제한** 설정: Vision API만 허용

### 4. 환경 변수 설정

프로젝트 루트의 `.env.local` 파일에 추가:

```env
GOOGLE_VISION_API_KEY="발급받은_API_키_붙여넣기"
```

`.env.local` 파일이 없으면 새로 만드세요.

### 5. 서버 재시작

```bash
npm run dev
```

재시작 후 영수증 업로드 화면에서 **"실제 인식 (Google Vision)"** 배지가 표시되면 설정 완료입니다.

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| 여전히 Mock 배지 표시 | 환경 변수 미설정 | `.env.local` 확인 후 서버 재시작 |
| 인식 실패 후 Mock으로 fallback | API 오류 (할당량, 키 오류 등) | 서버 로그(`[OCR] Google Vision failed`) 확인 |
| `400 API key not valid` | 잘못된 키 또는 Vision API 미활성화 | 키 재발급 또는 API 활성화 확인 |

## 보안 주의사항

- `GOOGLE_VISION_API_KEY`는 서버 전용 환경 변수입니다 (`NEXT_PUBLIC_` 접두사 없음)
- 클라이언트 코드에 키를 노출하지 마세요
- `.env.local`은 반드시 `.gitignore`에 포함되어 있어야 합니다
