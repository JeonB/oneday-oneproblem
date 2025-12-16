# 1일 1문제 - 알고리즘 연습 플랫폼

하루에 한 문제씩 알고리즘 문제를 풀어보는 현대적인 웹 애플리케이션입니다.

## 주요 기능

- **실시간 코드 실행**: 안전한 샌드박스 환경에서 알고리즘 코드 실행
- **AI 문제 생성**: OpenAI를 활용한 알고리즘 문제 자동 생성
- **AI 피드백**: 코드 분석 및 개선 제안을 위한 AI 기반 피드백 제공
- **문제 관리**: 테스트 케이스가 포함된 알고리즘 문제 생성 및 관리
- **사용자 진행 추적**: 사용자 진행 상황 및 해결한 문제 모니터링
- **프로필 관리**: 사용자 정보 및 풀이 기록 관리

## 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 15, React 19
- **언어**: TypeScript
- **UI 라이브러리**: shadcn/ui, Tailwind CSS
- **상태 관리**: Zustand
- **폼 관리**: React Hook Form, Zod
- **코드 에디터**: CodeMirror

### 백엔드

- **프레임워크**: Next.js API Routes
- **데이터베이스**: MongoDB with Mongoose ODM
- **인증**: NextAuth.js
- **AI 통합**: OpenAI API

### 개발 도구

- **테스팅**: Vitest, React Testing Library
- **코드 품질**: ESLint, Prettier
- **스토리북**: Storybook
