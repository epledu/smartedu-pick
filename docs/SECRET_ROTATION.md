# 시크릿 회전 가이드

`HANDOFF-wallet-merge.md` 가 평문 시크릿을 포함한 채로 일정 기간 작업 디렉터리에 존재했습니다 (현재는 placeholder 로 redact 됨). 외부 노출 가능성은 낮지만, 다음 시크릿들은 회전을 권장합니다.

각 단계는 독립적으로 수행 가능합니다 — 한 번에 다 안 해도 됩니다.

---

## 0. 회전 순서 권장

영향 큰 순서:
1. **NextAuth secret** (모든 사용자 강제 재로그인)
2. **Google OAuth client secret** (Google 로그인 잠시 끊김 가능)
3. **Google Vision API key** (영수증 OCR 잠시 끊김)
4. **CODEF demo/sandbox client secrets** (은행 동기화 잠시 끊김 — 현재 sandbox 라 영향 미미)
5. **Neon DB 비밀번호** (잠깐 다운타임 발생 — 환경변수 갱신 + 재배포 필요)

---

## 1. NextAuth secret

### 새 secret 생성 (로컬)
```bash
openssl rand -base64 32
# 예시 출력: KZbT8...long-base64-string...=
```

### Vercel 환경변수 갱신
1. Vercel 대시보드 → smartedu-pick 프로젝트 → Settings → Environment Variables
2. `NEXTAUTH_SECRET` 항목 → Edit → 위에서 생성한 새 값으로 교체
3. Production + Preview 모두 적용
4. Save

### 재배포
시크릿 변경은 새 빌드가 있어야 적용됨:
```bash
# 가장 최신 main 커밋을 redeploy 트리거
git -C C:\Users\DH\Desktop\cladue_daehyuk\smartedu-pick\smartedu-pick commit --allow-empty -m "chore: trigger redeploy after secret rotation"
git push origin main
```

또는 Vercel 대시보드 → Deployments → 최신 → ⋯ → Redeploy

### 확인
- 모든 기존 사용자는 자동 로그아웃 됨 (이전 NEXTAUTH_SECRET 으로 서명된 JWT 가 무효화)
- `https://smartedu-pick.com/wallet/login` 에서 다시 Google 로그인 → 정상이면 OK

---

## 2. Google OAuth client secret

### Google Cloud Console
1. https://console.cloud.google.com/apis/credentials?project=claudeapi-490103
2. **OAuth 2.0 클라이언트 ID** 섹션 → 사용 중인 클라이언트(`298488034664-...`) 클릭
3. **클라이언트 보안 비밀 재설정** 버튼
4. 새 secret 값을 복사

### Vercel 환경변수 갱신
1. `GOOGLE_CLIENT_SECRET` 갱신 (Production + Preview)
2. Save

### 재배포 (위 1번과 동일)

### 확인
- Google 로그인 다시 시도 → 정상 작동 확인

> ⚠️ Google Cloud Console에서 secret 재설정 시 **이전 secret 은 즉시 무효화** 됩니다. Vercel 환경변수 갱신 + 재배포가 끝날 때까지 짧은 다운타임이 발생할 수 있습니다 (보통 1~2분).

---

## 3. Google Vision API key

### Google Cloud Console
1. https://console.cloud.google.com/apis/credentials?project=claudeapi-490103
2. **API 키** 섹션에서 사용 중인 키 클릭
3. **키 재생성** (또는 새 키 생성 후 기존 키 삭제)
4. 새 키 값 복사

### 키 제한 확인 (중요)
재생성 후 자동으로 제한이 풀리는 경우가 있으니 다시 설정:
- **API 제한**: Cloud Vision API 만 허용
- **애플리케이션 제한**: HTTP 리퍼러 → `https://smartedu-pick.com/*`, `https://*.vercel.app/*` (Preview 도 사용한다면)

### Vercel 환경변수 갱신
- `GOOGLE_VISION_API_KEY`

---

## 4. CODEF client secrets

### CODEF 콘솔
1. https://developer.codef.io 로그인 (한대혁 / edu7epl@gmail.com 계정)
2. **마이페이지 → 클라이언트 정보**
3. Demo / Sandbox 각각 **Client Secret 재발급**
4. 새 값 복사

### Vercel 환경변수 갱신
- `CODEF_DEMO_CLIENT_SECRET`
- `CODEF_SANDBOX_CLIENT_SECRET`

> ℹ️ Public Key (`CODEF_PUBLIC_KEY`) 는 RSA 공개키이므로 회전 대상 아님. CODEF 측에서 키 페어 변경 시에만 갱신.

---

## 5. Neon DB 비밀번호

### Neon 대시보드
1. https://console.neon.tech 로그인
2. 프로젝트 선택 → **Roles** 탭
3. `neondb_owner` 옆 ⋯ → **Reset password**
4. 새 connection string 두 개 복사:
   - **Pooled** (PgBouncer 경유) — `DATABASE_URL` 용
   - **Direct** — `DIRECT_URL` 용 (Prisma 마이그레이션용)

### Vercel 환경변수 갱신
- `DATABASE_URL` ← 새 pooled connection string
- `DIRECT_URL` ← 새 direct connection string

### 재배포 + 검증
- 재배포 직후 `/api/auth/providers-status` 응답 정상 → DB 연결 OK
- `/wallet` 진입 시 거래내역 표시 정상 → 모든 쿼리 정상

---

## 회전 체크리스트

```
[ ] NextAuth secret 생성 + Vercel 갱신 + 재배포 + 로그인 검증
[ ] Google OAuth client secret 재설정 + Vercel 갱신 + 재배포 + 로그인 검증
[ ] Google Vision API key 재생성 + 제한 재설정 + Vercel 갱신 + OCR 검증
[ ] CODEF demo/sandbox secret 재발급 + Vercel 갱신 + 은행 페이지 검증
[ ] Neon DB password 재설정 + Vercel 갱신 + 거래내역 페이지 검증
```

---

## 회전 후 정리

- 로컬 `.env`, `.env.local` 도 동일하게 갱신 (개발용으로 같은 키를 쓴다면)
- 다른 협업자가 있다면 새 시크릿 안전하게 공유 (1Password, Vault 같은 secret manager 사용 권장 — 절대 평문 메신저로 보내지 않기)
- 이번 회전 사유와 일자를 운영 노트에 기록해두면 다음 감사 때 도움됨
