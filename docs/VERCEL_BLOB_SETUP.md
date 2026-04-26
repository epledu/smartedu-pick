# Vercel Blob 영수증 저장소 설정

`/api/ocr` 라우트가 영수증 이미지를 영구 저장소로 보내기 위해 Vercel Blob 을 사용합니다. 코드는 이미 들어와 있고, **운영자가 Blob store 한 번 만들고 토큰만 등록하면 자동 활성화**됩니다.

---

## 왜 Blob 이 필요한가

이전 OCR 라우트는 Vercel 의 read-only 파일시스템 위에서 작동할 때 이미지를 base64 data URL 로 변환해 거래 row 의 `receiptImageUrl` 컬럼에 그대로 저장했습니다. 이 방식의 문제:

- 행 크기가 매우 커짐 (영수증 한 장 1~3MB → DB row 자체가 1~3MB)
- 백업, 복제, 인덱스 비용 모두 폭증
- 페이지 로딩이 느려짐 (큰 JSON payload)

현재 구현은 **Blob 토큰이 없으면 503 을 반환**합니다 (조용한 base64 폴백 제거됨). 즉 Blob 설정 전까지는 영수증 업로드 기능이 비활성 상태입니다.

---

## 1. Blob store 생성

1. Vercel 대시보드 → 좌측 사이드바 → **Storage** 탭
2. **Create Database** → **Blob** 선택
3. Store 이름: `smartedu-pick-receipts` (자유)
4. Region: 가장 가까운 곳 (Korea 사용자 기준 `Asia Pacific` 권장)
5. **Create**

---

## 2. 프로젝트와 연결

1. 생성된 Blob store 페이지 → **Projects** 탭
2. **Connect Project** → `smartedu-pick` 선택
3. **All environments** 체크 (Production + Preview + Development)
4. **Connect**

연결되면 `BLOB_READ_WRITE_TOKEN` 이 자동으로 Vercel 환경변수에 추가됩니다 — **별도로 복사해서 등록할 필요 없음**.

---

## 3. 재배포 트리거

환경변수 변경은 새 빌드가 있어야 활성화됩니다:

```bash
git -C C:\Users\DH\Desktop\cladue_daehyuk\smartedu-pick\smartedu-pick commit --allow-empty -m "chore: enable Vercel Blob for receipts"
git push origin main
```

Vercel 대시보드 → Deployments → Redeploy 도 OK.

---

## 4. 검증

### 기능 테스트
1. https://smartedu-pick.com/wallet/receipts 접속
2. 영수증 이미지 업로드
3. 결과:
   - ✅ 정상 → 응답에 `imageUrl` 이 `https://[hash].public.blob.vercel-storage.com/receipts/...` 형태
   - ❌ 503 "이미지 저장소가 설정되지 않았습니다" → 환경변수 적용 안 됨, 재배포 필요

### Blob store 확인
- Vercel 대시보드 → Storage → 해당 Blob store → **Browser** 탭
- `receipts/receipt_xxxxx.jpg` 형태의 파일이 추가됐는지 확인

---

## 5. 비용

Vercel Blob 무료 한도:
- Storage: 1 GB
- Bandwidth: 10 GB/월
- Operations: 10,000 회/월

영수증 한 장 평균 500KB 가정 시 ~2,000 장까지 무료. 초과 시 자동 과금이므로 실제 사용 패턴 보고 알림 설정.

대시보드 → Storage → Usage 에서 모니터링.

---

## 6. 기존 base64 영수증 데이터 정리 (선택)

이전 base64 fallback 으로 저장된 거래가 있을 수 있습니다:

```sql
-- DB 에 base64 로 저장된 receiptImageUrl 카운트
SELECT COUNT(*)
FROM "Transaction"
WHERE "receiptImageUrl" LIKE 'data:image/%';

-- 길이 조회 (큰 행이 어느 정도 있는지)
SELECT id, LENGTH("receiptImageUrl")
FROM "Transaction"
WHERE "receiptImageUrl" LIKE 'data:image/%'
ORDER BY LENGTH("receiptImageUrl") DESC
LIMIT 10;
```

처리 옵션:
- **그대로 두기** — 추가 base64 가 더 안 쌓이므로 자연 소멸
- **NULL 로 정리** — 영수증 표시는 안 되지만 DB row 가 작아짐
  ```sql
  UPDATE "Transaction"
  SET "receiptImageUrl" = NULL
  WHERE "receiptImageUrl" LIKE 'data:image/%';
  ```
- **Blob 으로 마이그레이션** — base64 디코드 → Blob 업로드 → URL 갱신. 별도 마이그레이션 스크립트 필요. 영수증 수가 적으면 굳이 안 해도 됨.

---

## 체크리스트

```
[ ] Vercel Storage 탭에서 Blob store 생성
[ ] smartedu-pick 프로젝트와 연결 (All environments)
[ ] BLOB_READ_WRITE_TOKEN 자동 등록 확인
[ ] 재배포 트리거 (빈 커밋 push)
[ ] /wallet/receipts 에서 이미지 업로드 테스트
[ ] Blob Browser 에서 파일 생성 확인
[ ] (선택) 기존 base64 데이터 정리 SQL 실행
```
