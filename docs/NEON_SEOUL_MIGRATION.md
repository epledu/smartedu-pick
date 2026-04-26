# Neon DB Singapore → Seoul 리전 마이그레이션 가이드

현재 Neon DB는 `ap-southeast-1` (Singapore) 리전에 있어 Vercel `icn1` (Seoul) 에서 매 쿼리당 ~80~150ms 의 지연이 추가됩니다. Seoul 리전 (`ap-northeast-2` 또는 Neon이 지원하는 가장 가까운 KR/JP 리전) 으로 옮기면 모든 API 응답이 즉시 빨라집니다.

> ⚠️ **현 시점 (2026-04-26) 기준 Neon은 한국 리전을 직접 지원하지 않습니다.** 가장 가까운 옵션은:
> - **AWS ap-northeast-1 (Tokyo)** — Neon 정식 지원, Korea 까지 ~30ms
> - **AWS ap-northeast-2 (Seoul)** — Neon 로드맵 상 추가 예정 (출시 시 우선)
> 
> 마이그레이션 전 https://neon.tech/docs/introduction/regions 에서 최신 지원 리전을 확인하세요. Seoul 미지원이면 Tokyo 가 차선.

---

## 사전 점검

### 다운타임 윈도우 결정
- 마이그레이션 자체는 ~10~30분 (DB 크기 의존)
- 사용자 영향: cutover 직전~직후 ~2분 정도 503 가능
- **사용자 활동 적은 시간대 (예: 새벽 3~5시) 권장**

### 백업 확보
- Neon은 자동 PITR (Point-in-Time Recovery) 가 7일 유지됨
- 마이그레이션 전 별도 백업도 받아두기 (아래 6번 참고)

### Neon 플랜 확인
- Free tier: 1개 프로젝트만 무료 → 이전용 임시 프로젝트 만들면 기존 한도 초과 가능
- 이전 후 기존 프로젝트 삭제 예정이면 OK

---

## 1. Tokyo 리전 새 Neon 프로젝트 생성

1. https://console.neon.tech → **New Project**
2. 옵션:
   - Name: `smartedu-pick-jp` (또는 `wallet-jp`)
   - Region: **AWS ap-northeast-1 (Tokyo)**
   - Postgres version: 기존 프로젝트와 동일 (확인 필요 — 보통 16+)
3. 새 프로젝트의 connection string 두 종 복사:
   - Pooled (PgBouncer)
   - Direct

---

## 2. 기존 DB 덤프

로컬에서 (Postgres CLI 도구 필요 — `pg_dump`):

```bash
# Singapore 기존 DB 의 Direct connection string
OLD_DIRECT="postgresql://neondb_owner:OLD_PASSWORD@ep-dawn-dream-ao4tjura.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 스키마 + 데이터 함께 덤프 (Postgres 16 기준 옵션)
pg_dump "$OLD_DIRECT" \
  --no-owner \
  --no-acl \
  --format=custom \
  --file=neondb-singapore-backup.dump

# 크기 확인
ls -lh neondb-singapore-backup.dump
```

> ℹ️ `pg_dump` 버전은 Neon Postgres 버전과 일치 또는 그 이상이어야 함. `pg_dump --version` 확인.

---

## 3. 새 Tokyo DB 로 복원

```bash
# Tokyo 새 DB 의 Direct connection string
NEW_DIRECT="postgresql://neondb_owner:NEW_PASSWORD@ep-tokyo-xxxxx.c-1.ap-northeast-1.aws.neon.tech/neondb?sslmode=require"

# 복원 — 새 빈 DB 에 부어넣기
pg_restore \
  --no-owner \
  --no-acl \
  --dbname="$NEW_DIRECT" \
  neondb-singapore-backup.dump

# 검증: 행 수 비교
psql "$NEW_DIRECT" -c "SELECT 'User' as t, COUNT(*) FROM \"User\" UNION ALL SELECT 'Transaction', COUNT(*) FROM \"Transaction\" UNION ALL SELECT 'Account', COUNT(*) FROM \"Account\";"
psql "$OLD_DIRECT" -c "SELECT 'User' as t, COUNT(*) FROM \"User\" UNION ALL SELECT 'Transaction', COUNT(*) FROM \"Transaction\" UNION ALL SELECT 'Account', COUNT(*) FROM \"Account\";"
# 두 결과가 일치해야 함
```

---

## 4. Prisma migrations 적용 검증

```bash
# 로컬에서 새 DB 에 향해 Prisma 검증 — 마이그레이션 이력이 정상인지
DATABASE_URL="$NEW_DIRECT" DIRECT_URL="$NEW_DIRECT" npx prisma migrate status
# 결과: "Database schema is up to date" 가 나와야 함

# 만약 "Following migration have not yet been applied" 가 뜨면:
DATABASE_URL="$NEW_DIRECT" DIRECT_URL="$NEW_DIRECT" npx prisma migrate deploy
```

---

## 5. Cutover (실제 전환)

### Vercel 환경변수 교체
1. Vercel 대시보드 → smartedu-pick → Settings → Environment Variables
2. `DATABASE_URL` 와 `DIRECT_URL` 을 **새 Tokyo connection string** 으로 교체 (Production + Preview)
3. Save

### 재배포 트리거
```bash
# 빈 커밋으로 새 배포 트리거
git -C C:\Users\DH\Desktop\cladue_daehyuk\smartedu-pick\smartedu-pick commit --allow-empty -m "chore: cutover to Neon Tokyo region"
git push origin main
```

### 즉시 검증 (배포 완료 직후)
```bash
# 1) /api/auth/providers-status 응답 확인 (DB 안 쓰지만 함수가 살아있는지)
curl -i https://smartedu-pick.com/api/auth/providers-status

# 2) 로그인 → /wallet 접속 → 기존 데이터 그대로 보여야 함
# 3) Network 탭에서 /api/insights, /api/notifications 응답 시간 측정
#    → Singapore 시절 대비 ~80~150ms 단축 확인
```

### 5분 정도 지켜보기
- Vercel Function Logs (대시보드 → Logs) 에서 DB connection 에러 없는지
- 사용자 거래 추가/수정/삭제 시도 → 정상 작동
- 알림 폴링 정상

---

## 6. 롤백 시나리오

cutover 직후 5분 안에 문제 발견 시:
1. Vercel 환경변수의 `DATABASE_URL`, `DIRECT_URL` 을 **기존 Singapore connection string** 으로 되돌림
2. 재배포 (빈 커밋 push 또는 대시보드 Redeploy)

> ⚠️ cutover 직후~롤백 전까지 새로 추가된 데이터는 Tokyo DB 에만 있고 Singapore DB 에는 없음. 롤백 시 그 윈도우의 사용자 입력은 손실됨. 사용자 적은 시간대를 고른 이유.

만약 롤백 후 데이터를 다시 가져와야 한다면, 그 윈도우만 Tokyo → Singapore 로 별도 동기화 필요 (수동 SQL 작업).

---

## 7. 마이그레이션 후 정리

- 일주일 정도 지나서 문제 없으면 **기존 Singapore Neon 프로젝트 삭제** (Free tier 한도 회수)
- `wallet-diary.vercel.app` 도 같은 DB 를 쓰고 있다면 그쪽 환경변수도 새 Tokyo 로 갱신 (또는 wallet-diary.vercel.app 자체 폐기)
- `WALLET_INTEGRATION.md` 의 DB 리전 기록 업데이트

---

## 체크리스트

```
[ ] Neon Tokyo 신규 프로젝트 생성 + connection string 확보
[ ] pg_dump 백업 (~수십 MB 정도 예상)
[ ] pg_restore 신규 Tokyo DB 로 복원
[ ] 행 수 검증 (Singapore vs Tokyo 일치)
[ ] prisma migrate status — schema 일치 확인
[ ] 사용자 적은 시간대 (예: 03:00~05:00 KST) 선택
[ ] Vercel 환경변수 (DATABASE_URL, DIRECT_URL) 교체
[ ] 빈 커밋으로 재배포 트리거
[ ] 5분간 관찰 — Function Logs, 사용자 동작
[ ] OK 면 일주일 후 기존 Singapore 프로젝트 삭제
```

---

## Future: Neon Seoul 정식 지원 시

Neon 이 ap-northeast-2 (Seoul) 을 추가하면 **Tokyo → Seoul** 한 번 더 마이그레이션 권장. 절차는 위와 동일 (소스 DB 가 Tokyo 가 됨). 기대 효과: Korea 사용자 기준 추가 ~20~30ms 단축.
