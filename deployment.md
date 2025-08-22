# 프로덕션 배포 가이드

## 환경 설정

### 1. 환경 변수 설정

프로덕션 환경에서 다음 환경 변수를 설정하세요:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/oneday-oneproblem-prod

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key-here

# GitHub OAuth (if using)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Performance Monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_FLUSH_INTERVAL=60000
PERFORMANCE_SLOW_OPERATION_THRESHOLD=1000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
ENABLE_WEB_WORKERS=true
ENABLE_RATE_LIMITING=true
ENABLE_STRUCTURED_LOGGING=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Cache Control
ENABLE_CACHING=true
CACHE_MAX_AGE=3600
```

### 2. 빌드 및 배포

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

## 모니터링 설정

### 1. 성능 모니터링 활성화

성능 모니터링이 자동으로 활성화됩니다. 다음 엔드포인트를 통해 모니터링할 수 있습니다:

- **성능 대시보드**: `/performance`
- **성능 API**: `/api/performance`
- **헬스 체크**: `HEAD /api/performance`
- **메트릭 내보내기**: `PATCH /api/performance?format=json|prometheus`

### 2. 외부 모니터링 시스템 연동

#### Prometheus 연동

```bash
# 메트릭 내보내기 (Prometheus 형식)
curl -X PATCH "https://your-domain.com/api/performance?format=prometheus"
```

#### DataDog 연동

```bash
# 환경 변수 설정
DATADOG_API_KEY=your-datadog-api-key

# 메트릭 전송 (JSON 형식)
curl -X PATCH "https://your-domain.com/api/performance?format=json"
```

### 3. 헬스 체크 설정

로드 밸런서나 모니터링 시스템에서 다음 엔드포인트를 사용하세요:

```bash
# 헬스 체크
curl -I "https://your-domain.com/api/performance"

# 응답 헤더 확인
X-Health-Status: healthy|unhealthy
X-Error-Rate: 0.0000
X-Avg-Response-Time: 150
X-Total-Operations: 1000
```

## 보안 고려사항

### 1. 환경 변수 보안

- 모든 민감한 정보는 환경 변수로 관리
- `.env.production` 파일은 버전 관리에서 제외
- 프로덕션 시크릿은 안전한 시크릿 관리 시스템 사용

### 2. 네트워크 보안

- HTTPS 강제 적용
- 적절한 CORS 설정
- Rate Limiting 활성화

### 3. 데이터베이스 보안

- MongoDB 인증 활성화
- 네트워크 접근 제한
- 정기적인 백업

## 성능 최적화

### 1. 캐싱 전략

- 정적 데이터에 적절한 캐시 헤더 적용
- CDN 사용 고려
- 브라우저 캐싱 최적화

### 2. 데이터베이스 최적화

- 인덱스 최적화
- 쿼리 성능 모니터링
- 연결 풀 설정

### 3. 애플리케이션 최적화

- Web Workers 활용
- 코드 분할 및 지연 로딩
- 이미지 최적화

## 로깅 및 디버깅

### 1. 구조화된 로깅

모든 로그는 JSON 형식으로 출력되며 다음 정보를 포함합니다:

- 요청 ID
- 사용자 ID
- 작업 유형
- 성능 메트릭
- 오류 정보

### 2. 로그 레벨

- `error`: 심각한 오류
- `warn`: 경고
- `info`: 일반 정보
- `debug`: 디버깅 정보 (개발 환경에서만)

## 백업 및 복구

### 1. 데이터베이스 백업

```bash
# MongoDB 백업
mongodump --uri="mongodb://localhost:27017/oneday-oneproblem-prod" --out=/backup/$(date +%Y%m%d)

# 복구
mongorestore --uri="mongodb://localhost:27017/oneday-oneproblem-prod" /backup/20231201/
```

### 2. 애플리케이션 백업

- 소스 코드 버전 관리
- 환경 설정 백업
- 로그 파일 보관

## 확장성 고려사항

### 1. 수평 확장

- 무상태 애플리케이션 설계
- 세션 저장소 분리
- 로드 밸런서 설정

### 2. 데이터베이스 확장

- 읽기 전용 복제본 설정
- 샤딩 고려
- 연결 풀 최적화

## 문제 해결

### 1. 일반적인 문제

- **빌드 실패**: TypeScript 오류 확인, 의존성 재설치
- **데이터베이스 연결 실패**: 연결 문자열, 네트워크 설정 확인
- **인증 오류**: OAuth 설정, 환경 변수 확인

### 2. 성능 문제

- 성능 대시보드에서 메트릭 확인
- 느린 쿼리 분석
- 메모리 사용량 모니터링

### 3. 로그 분석

```bash
# 오류 로그 필터링
grep '"level":"error"' /var/log/app.log

# 성능 문제 분석
grep '"duration":[0-9]{4,}' /var/log/app.log
```
