---
name: git-commit
description: 변경 사항을 논리 단위로 나눠 `type(scope): 설명` 형식으로 커밋한다. 커밋 후 AI_LOG.md 작업 로그는 훅이 자동 기록한다. "커밋", "commit", "/git-commit" 요청 시 사용.
allowed-tools: Bash
---

## 커밋 메시지 규칙

형식: `type(scope): 설명`

- **type** (영어)

  | type | 용도 |
  |---|---|
  | `feat` | 기능 추가 |
  | `fix` | 버그 수정 |
  | `refactor` | 동작 변화 없는 구조 개선 |
  | `style` | 스타일(CSS), 포맷팅 |
  | `test` | 테스트 추가·수정 |
  | `docs` | 문서 (README, AI_LOG 등) |
  | `chore` | 설정, 의존성, 빌드 |

- **scope**: 도메인 이름을 쓴다. 모듈·폴더 이름(`components`, `utils`, `src`)은 쓰지 않는다.
  - 변경 파일 경로와 `git log --oneline`의 기존 scope를 보고 고른다. 이미 쓰인 scope가 있으면 재사용한다.
  - 이 과제의 기본 scope:

    | scope | 대상 |
    |---|---|
    | `slide-list` | 목록, 페이지네이션, 목록 키보드 이동 |
    | `slide-detail` | 상세 패널 |
    | `search` | 검색, 디바운스 |
    | `heatmap` | heatmap 오버레이, 토글, 투명도 |
    | `url-state` | URL 쿼리 동기화 |
    | `format` | 마스킹, KST, 숫자 등 화면 표시 규칙 |
    | `api` | API 호출, 에러·재시도 |
    | `global` | 여러 도메인에 걸친 변경 (레이아웃, 공통 설정) |
    | `ai-log` | AI_LOG.md (`docs(ai-log)` 전용) |

- **설명**: 한국어, 마침표 없음. `~한다/~된다`, `~하기`, `~합니다/~됩니다`, `~했습니다` 어미를 쓰지 않는다.
  - 좋은 예: `슬라이드 목록 조회 추가`, `환자명 마스킹 규칙 수정`, `검색 디바운스 적용`
- 제목 한 줄만 쓴다 (본문 없음). 끝에 `Co-Authored-By` 트레일러는 붙여도 된다.

```
feat(slide-list): 슬라이드 목록 조회 추가
fix(format): 두 글자 환자명 마스킹 오류 수정
test(format): KST 변환 테스트 추가
refactor(global): 공통 에러 처리 구조 개선
```

## 커밋 흐름

1. `git status`, `git diff`로 변경 사항을 확인한다.
2. 논리 단위(기능 / 버그 수정 / 리팩터링 / 테스트 …)로 나누고 파일을 묶는다.
3. **AI_LOG.md는 코드 커밋에 섞지 않는다.** 따로 `docs(ai-log): 작업 로그 작성`으로 커밋한다. 이 type·scope 조합은 훅이 로그에 남기지 않는다.
4. 묶음마다 관련 파일만 `git add` 하고, **커밋 하나당 Bash 호출 하나**로 `git commit -m "..."`을 실행한다.
5. `git log --oneline -n <개수>`로 결과를 확인한다.
6. 사용자에게 AI_LOG.md에 새 항목이 생겼다고 알리고, 비어 있는 `결정 / 검증 / 직접 수정` 칸 작성 규칙은 AGENTS.md를 따른다.

## 주의

- `main`에서 바로 커밋한다 (브랜치 전략 없음).
- `src/mocks/`의 변경이 보이면 커밋하지 말고 사용자에게 알린다 (수정 금지 폴더).
- `--amend`, `--no-verify`, `push`는 사용자가 요청할 때만 한다.
