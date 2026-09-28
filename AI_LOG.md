# AI 활용 기록

## 사용한 도구

Claude

## 주요 프롬프트 (추가 작성 가능)

1.
2.
3.

## AI 결과물을 직접 수정한 부분

| 위치 (파일/함수) | AI가 만든 내용 | 수정한 내용과 이유 |
| ---------------- | -------------- | ------------------ |
|                  |                |                    |

## AI 답이 틀렸거나 의심스러웠던 순간 (있다면)

- 유닛 테스트 스킬 생성을 요청했는데, Claude가 지시하지 않은 git worktree(`worktree-unit-test-skill`)를 만들어 그 브랜치에 커밋하고 원격에 push까지 했다. `main`에서 바로 커밋한다는 `git-commit` 스킬 규칙과도 어긋났다. worktree와 브랜치를 지우고 `main`에 다시 만들었으며, AGENTS.md에 "worktree를 만들지 않는다"는 규칙을 추가했다.

---

## 작업 로그 (시간순)

### chore(global): AI 로그 훅과 커밋 스킬 추가

- 커밋: `66c22b9` · 2026-09-28 13:22
- 변경 파일: `.claude/hooks/ai-log.sh`, `.claude/settings.json`, `.claude/skills/git-commit/SKILL.md`, `.gitignore`, `AGENTS.md`
- 프롬프트:
  - 13:17 `@PROBLEM.md 과제에 적힌대로 병리 데이터 뷰어를 위해 어떤 라이브러리를 사용하는게 좋을까? 현재 데이터 규모를 정확히 알지는 못하지만 대용량 데이터라고 생각되고 WebGL 기반으로 처리하려고 생각중이야. OpenSeaDragon을 사용해봤는데 그걸로 처리하기 쉬울까? `
- 결정: 데이터 규모를 측정해본 결과 이미지 크기가 1200px로 판단되어 일반 CSS 사용.
- 검증: 임시 git 저장소에서 스크립트 실행 — 커밋별 항목 생성, 중복 기록 방지, 한 번에 여러 커밋, `docs(ai-log)`·비커밋 명령 제외, 프롬프트 버퍼 비우기 확인. 실제 저장소에서도 이 커밋 직후 항목 생성 확인
- 직접 수정: 없음

### chore(global): package-lock engines 필드 동기화

- 커밋: `1020a1e` · 2026-09-28 13:22
- 변경 파일: `package-lock.json`
- 결정: 노드 버전에 맞게 수정.
- 검증: 없음 (npm install이 package.json의 engines를 lockfile에 반영한 변경)
- 직접 수정: 없음

### chore(global): 유닛 테스트 스킬 추가와 worktree 금지 규칙 명시

- 커밋: `ec918e8` · 2026-09-28 13:33
- 변경 파일: `.claude/settings.json`, `.claude/skills/unit-test/SKILL.md`, `AGENTS.md`
- 프롬프트:
  - 13:25 `현재 프로젝트의 테스트 코드 작성 규칙이 있어?`
  - 13:27 `@src/utils/example.test.ts 를 보면 유닛 테스트 코드를 작성해야 하는 것 같은데 맞아?`
  - 13:28 `유닛 테스트를 작성하는 스킬을 만들어줘.`
  - 13:30 `워크 트리에 만들지 말고 메인에 만들어 그리고 @AGENTS.md 에 명시해. @AI_LOG.md에 AI 답이 틀렸거나 의심스러웠던 순간에 추가해. 너가 지시하지 않은 워크트리를 생성한 것`
  - 13:32 `설정 추가했어 작업 재개해줘`
- 결정: 메인에서 바로 작업을 진행해야 하는데 워크트리가 생성되는 문제가 발생하여 @AGENTS.md, settings.json에 설정을 추가하여 메인에서 작업할 수 있도록 수정.
- 검증: `git diff`로 변경 범위 확인. 커밋 뒤 Claude Code 스킬 목록에 `unit-test`가 인식됨을 확인 (스킬로 테스트를 작성해 보지는 않음)
- 직접 수정: 없음

### chore(global): Tailwind CSS 설정과 디자인 토큰 추가

- 커밋: `1c5f52f` · 2026-09-28 13:39
- 변경 파일: `README.md`, `package-lock.json`, `package.json`, `src/App.tsx`, `src/index.css`, `vite.config.ts`
- 프롬프트:
  - 13:38 `본격적인 UI 개발을 들어가려고 하는데 생산성을 위해 내게 익숙한 tailwind css 를 사용하자. 코드 아키텍쳐는 현재 구조인 컴포넌트 패턴을 따라서 개발을 진행하자. 디자인 토큰을 정의하고 모든 페이지에서 공통적으로 사용할 버튼 컴포넌트 개발을 진행해줘.`
- 결정: 대규모 아키텍쳐에 유리한 FSD 보다는 컴포넌트 패턴이 유리하다고 판단.
- 검증: `npm run typecheck`, `npm run build` 통과. 빌드 CSS에 `bg-primary{background-color:var(--color-primary)}` 생성 확인 (토큰→유틸리티 연결). 로컬 Node 25는 engine-strict로 설치 실패해 Node 22로 설치함. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### feat(global): 공통 버튼 컴포넌트 추가

- 커밋: `5463f40` · 2026-09-28 13:39
- 변경 파일: `src/components/Button.test.tsx`, `src/components/Button.tsx`
- 결정: 없음
- 검증: `npm test` 통과 (Button 테스트 2개: 기본 `type="button"`·클릭 전달, `disabled` 시 클릭 미호출). 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### feat(format): 환자명 마스킹, KST 일시, 분석 상태 표시 규칙 추가

- 커밋: `f8df8d2` · 2026-09-28 13:44
- 변경 파일: `src/utils/format.test.ts`, `src/utils/format.ts`
- 프롬프트:
  - 13:43 `슬라이드 목록 페이지 구현을 진행해저ㅜ`
- 결정: 없음
- 검증: `npx vitest run src/utils/format.test.ts` 8개 통과 (명세 예시 홍길동→홍*동, 김민→김*, `2026-09-01T16:30:00Z`→`2026-09-02 01:30`, 상태 3종). `TZ=America/New_York`에서도 통과. KST 오프셋을 0으로 깨뜨리면 formatKst 테스트 2개 실패 확인 후 원복
- 직접 수정: 없음

### feat(slide-list): 슬라이드 목록 조회와 페이지 이동 추가

- 커밋: `323edbb` · 2026-09-28 13:45
- 변경 파일: `src/App.tsx`, `src/api/slides.ts`, `src/components/SlideList.tsx`
- 결정: 없음
- 검증: `npm run typecheck`, `npm run build`, `npm test`(12개) 통과. 임시 렌더 테스트(커밋 안 함)로 MSW 응답 기준 1페이지 20행, 3페이지 17행, `1 / 3`→`3 / 3` 이동, 첫 페이지 `이전`·마지막 페이지 `다음` 비활성, 행 표시 `S-2026-0015 한*원 2026-07-06 20:38 완료` 확인. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### chore(global): TanStack Query 추가와 QueryClientProvider 연결

- 커밋: `ae351d4` · 2026-09-28 13:57
- 변경 파일: `README.md`, `package-lock.json`, `package.json`, `src/main.tsx`
- 프롬프트:
  - 13:50 `[Image #1] 슬라이드 목록 조회 API에서 의도적으로 500 에러를 발생시키는 경우가 있어?`
  - 13:51 `500 에러가 발생한 경우 페이지 전환이 막히는데 그 이유를 설명해봐`
  - 13:53 `전역 상태를 저장하는 라이브러리를 사용한다면 간단하게 처리할 수 있을까?`
  - 13:56 `같은 처리가 반복될거라 생각되고 현재 구현된 보일러플레이트의 상당수를 제거할 수 있다고 생각하면 타당한 결정인 것 같아. tanstack query를 추가해줘.`
- 결정: 목록·상세에서 반복될 로딩·에러·재시도, 늦게 도착한 응답 처리 같은 서버 상태 보일러플레이트를 줄이기 위해 도입.
- 검증: Node 25는 engine 제약(`notsup`)으로 설치 실패해 Node 22.23.3으로 `npm install @tanstack/react-query`(5.104.0). `npm run typecheck`, `npm run build` 통과
- 직접 수정: 없음

### fix(slide-list): 목록 조회를 useQuery로 전환해 500 이후 페이지 이동 멈춤 수정

- 커밋: `ea8ad71` · 2026-09-28 13:57
- 변경 파일: `src/App.tsx`, `src/components/SlideList.tsx`
- 결정: 없음
- 검증: 수정 전 임시 테스트로 버그 재현(2페이지 500 뒤 `다음` 2회 클릭 시 요청 기록 `page=1,2`뿐, 화면 `1 / 3` 고정). 수정 후 임시 테스트(`retry: false`, 커밋 안 함)로 요청 `1 → 2(500) → 2(다시 시도) → 3`, 에러 문구 `슬라이드 목록 요청 실패 (500)` 표시, 3페이지 17행·`다음` 비활성 확인. `npm test`(12개), `npm run typecheck`, `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### fix(api): 쿼리 자동 재시도 비활성화로 에러 화면 노출

- 커밋: `5344fb9` · 2026-09-28 14:02
- 변경 파일: `src/main.tsx`
- 프롬프트:
  - 13:59 `tanstack query 에서 넘기는 error 객체가 렌더링에 영향을 주지 못하는 것 같아. 에러가 발생해도 다시 시도 버튼이 뜨지 않아.`
  - 14:00 `tanstack query 에서 넘기는 error 객체가 렌더링에 영향을 주지 못하는 것 같아. 에러가 발생해도 다시 시도 버튼이 뜨지 않아. 대신 react-error-boundary 사용을 고려해보는 건 어떨까?`
  - 14:02 `재시도를 꺼줘`
- 결정: 탄스택 쿼리 기본 재시도 로직으로 인해 에러가 조용히 삼켜지는 문제를 명시적으로 들어나게 수정함.
- 검증: 수정 전 임시 테스트(기본 QueryClient)로 500 1회 시 요청 9ms·1021ms, 에러 화면 없음 / 계속 500 시 요청 1s·3s·7s 뒤 약 7.1초에 에러 화면 확인. 수정 후 같은 옵션(`retry: false`) 임시 테스트로 500 1회 시 61ms에 에러 표시, `다시 시도` 클릭 후 `1 / 3` 복구 확인(커밋 안 함). `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### feat(slide-list): 로딩 스켈레톤과 목록 내부 에러 재시도 추가

- 커밋: `3ac641e` · 2026-09-28 14:07
- 변경 파일: `src/App.tsx`, `src/components/SlideList.tsx`
- 프롬프트:
  - 14:06 `에러 표기 시 버튼 하나만 두기 보다는 목록 컴포넌트는 스켈레톤으로 두고 토스트나 목록 컴포넌트 내부에서 재시도를 누를 수 있도록 하는게 좋을 것 같아.`
- 결정: 에러 시 버튼 하나만 두지 않고, 목록은 스켈레톤으로 유지한 채 목록 내부에서 재시도할 수 있게 함 (토스트 방식도 대안으로 고려).
- 검증: 사전 확인으로 `keepPreviousData`여도 에러 시 `data`가 `undefined`임을 임시 테스트로 확인(→ 에러 시 `N / -`, `다음` 비활성). 임시 테스트 3개(커밋 안 함) 통과: 첫 로딩 스켈레톤 20행·`aria-busy=true`·`1 / -` → 로드 후 데이터 20행 / 2페이지 500 시 스켈레톤 20행 + 목록 안 알림·`2 / -`·`다음` 비활성, `이전`으로 1페이지 복귀, `다시 시도`로 `2 / 3` 복구 / 첫 요청 500 시 이전·다음 모두 비활성, `다시 시도`로 복구. `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### fix(slide-list): 에러 표시 중 이전·다음 버튼 비활성화

- 커밋: `7beaf71` · 2026-09-28 14:11
- 변경 파일: `src/components/SlideList.tsx`
- 프롬프트:
  - 14:10 `다시 시도 버튼이 있을 때는 이전, 다음 버튼을 바로 누를 수 없게 처리해야 해.`
- 결정: 다시 시도 버튼이 떠 있는 동안에는 이전·다음 버튼을 바로 누를 수 없게 함.
- 검증: 임시 테스트(커밋 안 함) 통과: 2페이지 500 시 알림 표시와 함께 `이전`·`다음` 모두 비활성, `다시 시도` 성공 후 `2 / 3`에서 둘 다 활성. `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### chore(global): react-error-boundary 추가

- 커밋: `a03972a` · 2026-09-28 14:14
- 변경 파일: `README.md`, `package-lock.json`, `package.json`
- 프롬프트:
  - 14:12 `검색 컴포넌트를 제작하고 디바운스를 적용해.`
  - 14:13 `검색 컴포넌트를 제작하고 디바운스를 적용해. 로딩은 서스펜스로 스켈레톤 UI + 이전 데이터로 처리해줘. 빈 상태 데이터 처리도 같이 진행해`
- 결정: TanStack Query의 error로 다시 시도 버튼이 뜨지 않는 문제를 보고, 에러 처리를 react-error-boundary로 하자고 제안함.
- 검증: Node 22.23.3으로 `npm install react-error-boundary`(6.1.6). 타입 정의에서 `resetKeys`, `onReset`, fallback `error: unknown` 확인
- 직접 수정: 없음

### refactor(slide-list): 목록 조회를 Suspense와 ErrorBoundary로 전환

- 커밋: `0a04c79` · 2026-09-28 14:15
- 변경 파일: `src/App.tsx`, `src/components/SlideList.tsx`
- 결정: 로딩은 Suspense로 스켈레톤 UI + 이전 데이터 유지, 목록 다시 시도 에러 처리도 react-error-boundary로 처리.
- 검증: 임시 테스트 3개(커밋 안 함) 통과: 첫 로딩 스켈레톤 20행 → 데이터 / 2페이지 응답을 300ms 지연시키는 동안 스켈레톤 없이 1페이지 데이터 유지·`opacity-50`·`aria-busy=true` → `2 / 3` / 2페이지 500 시 스켈레톤+알림·`2 / -`·이전·다음 비활성 → `다시 시도`로 복구 / 첫 요청 500 → 복구. 처음엔 지연 핸들러에 `passthrough()`를 써서 실제 네트워크로 나가 테스트가 실패했고, 테스트 코드를 고쳐 재실행. `npm run typecheck`, `npm run build` 통과
- 직접 수정: 없음

### feat(search): 슬라이드 ID·환자명 검색과 300ms 디바운스 추가

- 커밋: `8e67691` · 2026-09-28 14:16
- 변경 파일: `src/App.tsx`, `src/api/slides.ts`, `src/components/SearchInput.tsx`
- 결정: 없음
- 검증: 임시 테스트(커밋 안 함) 통과: 3페이지에서 `S-2026-001` 10글자를 24ms에 입력 → 입력 후 200ms 시점 검색 요청 0건, 이후 요청 기록 `@1 | @2 | @3 | S-2026-001@1`(검색 요청 1회, 1페이지로 리셋), 결과 10건 모두 `S-2026-001` 포함. `npm run typecheck` 통과
- 직접 수정: 없음

### feat(slide-list): 목록 빈 상태 표시 추가

- 커밋: `8d6fbd9` · 2026-09-28 14:16
- 변경 파일: `src/components/SlideList.tsx`
- 결정: 없음
- 검증: 임시 테스트(커밋 안 함) 통과: 결과 없는 검색어 → `표시할 슬라이드가 없습니다.`·`1 / 1`·이전·다음 비활성, 검색어 지우면 `1 / 3` 복귀. 앞 단계 임시 테스트 포함 5개 재실행 통과. `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### feat(search): 검색 요청 중 상태 표시 추가

- 커밋: `4b5ddc2` · 2026-09-28 14:21
- 변경 파일: `src/App.tsx`
- 프롬프트:
  - 14:18 `그럼 SlideList 다시시도 에러 처리도 react-error-boundary로 ㄱㄱ`
  - 14:20 `검색중일 때는 검색 중이라고 표시해줘.`
- 결정: 검색 중일 때는 `검색 중`이라고 표시.
- 검증: 임시 테스트(커밋 안 함) 통과: 페이지 이동 응답 300ms 지연 시 `aria-busy=true`지만 `검색 중…` 미표시 / 검색 응답 400ms 지연 시 `검색 중…` 표시·`aria-busy=true` → 결과(`1 / 1`) 도착 후 표시 사라짐. `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### fix(search): 검색 중 표시를 목록 위로 이동

- 커밋: `28254c8` · 2026-09-28 14:22
- 변경 파일: `src/App.tsx`, `src/components/SlideList.tsx`
- 프롬프트:
  - 14:21 `검색 중을 목록에 보여줘야지`
- 결정: `검색 중` 표시는 목록 영역에 보여줘야 한다고 판단해 목록 위로 이동.
- 검증: 임시 테스트(커밋 안 함) 통과: 페이지 이동 300ms 지연 시 `aria-busy=true`, `status` 없음 / 검색 400ms 지연 시 목록 `section` 안에 `검색 중…`(status 1개뿐, 입력창 옆 표시 제거 확인)·`opacity-50` → `1 / 1` 도착 후 사라짐. `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### fix(search): 검색 중 이전 결과 대신 스켈레톤 표시

- 커밋: `0ce7f56` · 2026-09-28 14:24
- 변경 파일: `src/App.tsx`, `src/components/SlideList.tsx`
- 프롬프트:
  - 14:23 `검색 중에서는 이전 데이터가 보이지 않는 게 좋을 것 같아.`
- 결정: 검색 중에는 이전 검색어의 결과가 보이지 않는 게 낫다고 판단.
- 검증: 임시 테스트(커밋 안 함) 통과: 페이지 이동 300ms 지연 시 데이터 20행 유지·`opacity-50` / 검색 400ms 지연 시 데이터 행 0개·스켈레톤 20행·`검색 중…`·흐림 없음·`aria-busy=true`·`2 / -`·이전·다음 비활성 → 결과 도착 후 `1 / 1`·10행. `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### style(slide-list): 스켈레톤 행 수를 5행으로 축소

- 커밋: `8e9b593` · 2026-09-28 14:25
- 변경 파일: `src/components/SlideList.tsx`
- 프롬프트:
  - 14:24 `스켈레톤을 5행 정도로 줄여줘 너무 커`
- 결정: 스켈레톤이 너무 커서 5행 정도로 축소.
- 검증: 임시 테스트(커밋 안 함) 통과: 첫 로딩·검색 중·500 에러 모두 스켈레톤 5행. 처음엔 에러 단계에서 검색어를 지워 캐시된 `['slides', '', 1]`을 재사용해 요청이 안 나가 테스트가 실패했고, 새 검색어로 바꿔 재실행. `npm run typecheck`, `npm test`(12개), `npm run build` 통과. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음

### feat(format): Ki67 양성률과 세포 수 표시 규칙 추가

- 커밋: `fe2784b` · 2026-09-28 14:28
- 변경 파일: `src/utils/format.test.ts`, `src/utils/format.ts`
- 프롬프트:
  - 14:27 `슬라이드 상세 페이지를 구현해줘.`
- 결정: 없음
- 검증: `npx vitest run src/utils/format.test.ts` 12개 통과 (명세 예시 `41.16`→`41.2%`, `null`→`분석 결과 없음`, `12480`→`12,480`, `30321`→`30,321`). 구현을 `toFixed(2)`·`toString()`으로 깨뜨리면 3개 실패 확인 후 원복
- 직접 수정: 없음

### feat(slide-detail): 목록 선택 시 슬라이드 상세 패널 표시

- 커밋: `83056cd` · 2026-09-28 14:31
- 변경 파일: `src/App.tsx`, `src/api/slides.ts`, `src/components/SlideDetailPanel.tsx`, `src/components/SlideList.tsx`
- 결정: 없음
- 검증: `npm run typecheck`, `npm test`(16개), `npm run build` 통과. 임시 렌더 테스트(커밋 안 함, MSW node)로 확인: 행 클릭 시 `S-2026-0009 최*민 | 2026-09-23 17:37 | 완료 | 4.9% | 635 / 12,931 | 2026-09-24 01:37`와 이미지 표시, 선택 행 1개. 검색 `이안` 후 ID 버튼 Enter로 선택 시 `분석 중 | 분석 결과 없음 | - / - | -`. 500 응답 시 `슬라이드 상세 요청 실패 (500)`와 다시 시도로 복구, 404 시 `존재하지 않는 슬라이드입니다.` 표시. 처음엔 테스트가 교체되기 전 스켈레톤 section을 붙잡고 기다려 실패했고(앱 문제 아님), 화면 전체에서 찾도록 고쳐 재실행. 브라우저 화면 확인은 하지 않음
- 직접 수정: 없음
