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
- 결정: 
- 검증: `git diff`로 변경 범위 확인. 커밋 뒤 Claude Code 스킬 목록에 `unit-test`가 인식됨을 확인 (스킬로 테스트를 작성해 보지는 않음)
- 직접 수정: 
