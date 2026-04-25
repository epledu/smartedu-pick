# 지갑일기 통합 가이드 (smartedu-pick.com/wallet)

스마트에듀픽 본진에 지갑일기(wallet-diary)를 풀 통합한 후 운영자가 마쳐야 할 단계입니다.

---

## 1. 로컬 개발 환경

### 의존성 설치
```bash
npm install --legacy-peer-deps
```
React 19 + NextAuth v4 peer 충돌이 있어 `--legacy-peer-deps` 플래그가 필요합니다.

### 데이터베이스 (로컬)
`.env.local`에는 로컬 PostgreSQL 접속 정보가 들어 있습니다.
```bash
# 마이그레이션 (개발 DB)
npm run db:migrate

# 시드 (기본 카테고리 + 데모 사용자)
npm run db:seed
```

### 개발 서버 실행
```bash
npm run dev
```
- `http://localhost:3000/` — 스마트에듀픽
- `http://localhost:3000/wallet` — 지갑일기 (로그인 후 진입)
- `http://localhost:3000/wallet/login` — 로그인 페이지

---

## 2. Vercel 환경변수 추가 (운영자가 직접)

스마트에듀픽 Vercel 프로젝트의 **Settings → Environment Variables** 에 다음을 추가합니다. 모두 `Production` + `Preview` 환경 모두에 적용하세요.

```bash
# Database (Neon)
DATABASE_URL=<NEON_POOLED_CONNECTION_STRING>
DIRECT_URL=<NEON_DIRECT_CONNECTION_STRING>

# NextAuth
NEXTAUTH_URL=https://smartedu-pick.com
NEXTAUTH_SECRET=<32-byte base64 secret — generate with: openssl rand -base64 32>

# Google OAuth (claudeapi-490103 project)
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

# Google Vision API
GOOGLE_VISION_API_KEY=<from Google Cloud Console>
DEBUG_OCR=false

# CODEF API
CODEF_ENV=sandbox
CODEF_DEMO_CLIENT_ID=<CODEF demo client id>
CODEF_DEMO_CLIENT_SECRET=<CODEF demo client secret>
CODEF_SANDBOX_CLIENT_ID=<CODEF sandbox client id>
CODEF_SANDBOX_CLIENT_SECRET=<CODEF sandbox client secret>
CODEF_PUBLIC_KEY=<RSA public key from CODEF dashboard>
```

> 실제 값은 운영자의 password manager 또는 기존 `wallet-diary` Vercel 프로젝트의 환경변수 페이지에서 그대로 복사하세요. 절대 이 문서에 직접 입력하지 마세요 (GitHub secret scanning이 push를 차단합니다).
>
> Windows Git Bash에서 `vercel env add` 파이프 stdin 버그가 있으므로 **반드시 Vercel 대시보드 UI**로 추가하세요.

---

## 3. Google OAuth 리디렉션 URI 추가 (운영자가 직접)

[Google Cloud Console](https://console.cloud.google.com/) 의 **claudeapi-490103** 프로젝트 → **APIs & Services → Credentials → OAuth 2.0 Client ID** 편집:

**Authorized redirect URIs**에 다음을 추가합니다:
```
https://smartedu-pick.com/api/auth/callback/google
```

기존 `https://wallet-diary.vercel.app/api/auth/callback/google` 도 백업 도메인용으로 남겨두세요.

---

## 4. wallet-diary.vercel.app 처리 옵션

기존 도메인은 백업으로 두기로 결정되었으나, 사용자 혼선 방지를 위해 안내 배너 또는 리다이렉트가 가능합니다.

### 옵션 A: 그대로 두기 (현 결정)
- `wallet-diary.vercel.app` 계속 운영
- 같은 Neon DB 공유 → 양쪽에서 데이터 동기

### 옵션 B: 영구 리다이렉트 (선택 시 추후 적용)
`wallet-diary` 프로젝트의 `next.config.mjs` 에 추가:
```js
async redirects() {
  return [
    { source: '/:path*', destination: 'https://smartedu-pick.com/wallet/:path*', permanent: true },
  ];
}
```

---

## 5. 통합 후 검증 체크리스트

배포 후 다음 항목을 확인하세요:

- [ ] `https://smartedu-pick.com/` 메인 페이지 정상 (Header에 "💰 지갑일기" 메뉴 노출)
- [ ] `https://smartedu-pick.com/wallet` 미인증 시 `/wallet/login` 으로 리다이렉트
- [ ] `https://smartedu-pick.com/wallet/login` Google 로그인 작동
- [ ] 로그인 후 `/wallet` 대시보드 진입 — 사이드바, 헤더, 모바일 네비
- [ ] 다크모드 토글 작동 (설정 페이지)
- [ ] 거래 추가/수정/삭제 작동
- [ ] 영수증 OCR (Google Vision) 작동
- [ ] PWA 설치 배너 노출 (모바일 Chrome)

---

## 6. 통합 작업 요약

### 변경된 항목
- `package.json` — Prisma, NextAuth, Recharts, SWR, lucide-react, xlsx 등 추가
- `prisma/` — 지갑일기 스키마와 마이그레이션 복사
- `src/lib/wallet/` — 지갑일기 lib (auth, prisma, codef, ocr, classifier 등)
- `src/components/wallet/` — 지갑일기 모든 UI 컴포넌트
- `src/types/wallet/` — 지갑일기 타입
- `src/hooks/wallet/` — 지갑일기 SWR 훅
- `src/app/wallet/` — `/wallet/*` 라우트 전체
- `src/app/api/` — 19개 API 라우트
- `src/middleware.ts` — `/wallet/*` 만 보호
- `src/app/globals.css` — 다크모드 토큰 + 키프레임 통합
- `src/app/layout.tsx` — 다크모드 FOUC 방지 인라인 스크립트
- `src/components/layout/Header.tsx` — `/wallet/*` 영역에서 hide + "💰 지갑일기" 메뉴
- `src/components/layout/Footer.tsx` — `/wallet/*` 영역에서 hide
- `next.config.ts` — OAuth 프로필 이미지 도메인 추가
- `.env.local` — 로컬 개발용 환경변수

### Next.js 16 변경에 맞춘 처리
- API route dynamic params: `{ params: { id: string } }` → `{ params: Promise<{ id: string }> }` + `await params`
- middleware는 v16에서 `proxy`로 deprecation 됨 (작동은 정상, 향후 마이그레이션 필요)

### 백업 브랜치
- `backup-pre-wallet` — 통합 전 main 브랜치 스냅샷
- `feat/wallet-integration` — 본 통합 작업 브랜치 (현재)

---

## 7. 알려진 이슈

1. **lucide-react 1.8.0** — `package.json`에 명시됨, 실제 설치 버전과 일치
2. **next-pwa 미적용** — Next.js 16 + Tailwind 4 호환성 미검증으로 일단 비활성화. 추후 재도입 가능
3. **CODEF Sandbox** — 간편인증 자동 통과 안 됨 (CODEF 정책). 코드는 정상, Production 등급 신청 시 즉시 사용
4. **Geist 폰트 미사용** — 폰트는 Pretendard로 통일됨. wallet 영역도 Pretendard 적용

---

작성: 2026-04-25  
작업 시간: 약 2시간  
빌드 검증: ✅ 통과 (Next.js 16.1.6 / Tailwind 4 / React 19 / Prisma 5.22)
