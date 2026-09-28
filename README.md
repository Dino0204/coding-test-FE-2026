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
- 추가 라이브러리: react-error-boundary — Suspense(`useSuspenseQuery`)가 던지는 요청 에러를 받아 재시도 화면을 보여 주고, 검색어·페이지가 바뀌면(`resetKeys`) 에러 화면을 자동으로 해제하기 위해

## 폴더 구조

```
src/
├── api/types.ts        # API 타입 정의
├── mocks/              # Mock 서버 (수정 금지)
├── test/setup.ts       # 테스트 환경 설정 (MSW 연결됨)
├── App.tsx             # 여기서부터 구현
└── main.tsx
```

## AI 작업 환경 (Claude Code)

AI 결과물을 검증하고 기록하는 과정을 규칙과 자동화로 고정해 두었습니다.

| 파일 | 역할 |
| --- | --- |
| `AGENTS.md` | Claude가 따를 프로젝트 규칙: 요구사항 하나씩 작게 구현, `src/mocks/` 수정 금지, 라이브러리는 합의 후 추가, 모호한 요구사항은 추측하지 않고 질문으로 정리, worktree 금지 |
| `.claude/hooks/ai-log.sh` | 프롬프트를 모아 두었다가 `git commit` 때마다 `AI_LOG.md` 작업 로그에 커밋·변경 파일·프롬프트를 자동 기록 |
| `.claude/settings.json` | 위 훅 등록(`UserPromptSubmit`, `PostToolUse(Bash)`), worktree 격리 끄기 |
| `.claude/skills/git-commit` | `type(scope): 설명` 형식으로 요구사항 하나마다 커밋 |
| `.claude/skills/unit-test` | 테스트 기대값을 구현이 아닌 `PROBLEM.md` 4절 예시에서 가져오도록 강제 |

- 작업 로그의 `검증` 칸에는 실제로 실행한 명령과 결과만 적고, `결정`·`직접 수정`은 제가 직접 작성했습니다.

---

## 지원자 작성란

### 구현한 항목

- 필수
  - 슬라이드 목록 조회와 페이지 이동 (페이지당 20건)
  - 로딩 스켈레톤, 빈 상태, 에러 처리 (Suspense + ErrorBoundary, 에러 중 이전·다음 비활성)
  - 슬라이드 ID·환자명 검색과 300ms 디바운스, 검색 중에는 이전 결과 대신 스켈레톤 표시
  - 목록 선택 시 상세 패널 표시 (넓은 화면에서는 sticky로 고정)
  - 화면 표시 규칙: 환자명 마스킹, KST 일시, 분석 상태 한글, Ki67 양성률, 세포 수 천 단위 구분
- 권장
  - heatmap 오버레이와 on/off 토글, 투명도 슬라이더 (heatmap이 없으면 비활성)
  - 검색어, 페이지, 선택한 슬라이드를 URL 쿼리와 동기화 (1페이지도 `?page=1`로 표시)
- 도전
  - 목록·상세 요청 실패 시 다시 시도 버튼
  - 유닛 테스트: 표시 규칙(`format`), URL 상태(`urlState`), 공통 버튼
  - 키보드 접근성: 행 단위 포커스, ↑/↓로 이동, Enter로 선택

### 구현하지 못한 항목 / 이유

- 요구사항 1~9는 모두 구현함

### 시간이 더 있었다면
