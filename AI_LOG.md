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

-

---

## 작업 로그 (시간순)

### chore(global): AI 로그 훅과 커밋 스킬 추가

- 커밋: `66c22b9` · 2026-09-28 13:22
- 변경 파일: `.claude/hooks/ai-log.sh`, `.claude/settings.json`, `.claude/skills/git-commit/SKILL.md`, `.gitignore`, `AGENTS.md`
- 프롬프트:
  - 13:17 `@PROBLEM.md 과제에 적힌대로 병리 데이터 뷰어를 위해 어떤 라이브러리를 사용하는게 좋을까? 현재 데이터 규모를 정확히 알지는 못하지만 대용량 데이터라고 생각되고 WebGL 기반으로 처리하려고 생각중이야. OpenSeaDragon을 사용해봤는데 그걸로 처리하기 쉬울까? `
- 결정: 
- 검증: 임시 git 저장소에서 스크립트 실행 — 커밋별 항목 생성, 중복 기록 방지, 한 번에 여러 커밋, `docs(ai-log)`·비커밋 명령 제외, 프롬프트 버퍼 비우기 확인. 실제 저장소에서도 이 커밋 직후 항목 생성 확인
- 직접 수정: 

### chore(global): package-lock engines 필드 동기화

- 커밋: `1020a1e` · 2026-09-28 13:22
- 변경 파일: `package-lock.json`
- 결정: 
- 검증: 없음 (npm install이 package.json의 engines를 lockfile에 반영한 변경)
- 직접 수정: 
