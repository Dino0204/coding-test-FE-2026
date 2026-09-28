# 프론트엔드 신입 코딩테스트

**과제 설명은 [`PROBLEM.md`](./PROBLEM.md)를 먼저 읽어 주세요.**

## 실행

```bash
npm install
npm run dev     # http://localhost:5173
npm test
```

- **Node.js 22.22 이상** (LTS 24 권장, `node -v` 로 확인). 버전이 낮으면 `npm install` 이 실패합니다.
- 스택: React 19 + TypeScript + Vite, Mock API: MSW, 테스트: Vitest + Testing Library
- 추가 라이브러리: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) — 익숙한 도구로 UI 개발 속도를 높이고, 디자인 토큰을 `src/index.css`의 `@theme`에 모아 관리하기 위해
- 추가 라이브러리: TanStack Query (`@tanstack/react-query`) — 목록·상세에서 반복될 로딩·에러·재시도, 늦게 도착한 응답 처리 같은 서버 상태 보일러플레이트를 줄이기 위해

## 폴더 구조

```
src/
├── api/types.ts        # API 타입 정의
├── mocks/              # Mock 서버 (수정 금지)
├── test/setup.ts       # 테스트 환경 설정 (MSW 연결됨)
├── utils/example.*     # 테스트 작성 예시
├── App.tsx             # 여기서부터 구현
└── main.tsx
```

---

## 지원자 작성란

### 구현한 항목

-

### 구현하지 못한 항목 / 이유

-

### 시간이 더 있었다면

-
