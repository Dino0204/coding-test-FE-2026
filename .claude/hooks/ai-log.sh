#!/usr/bin/env bash
# Claude Code 훅: 프롬프트를 버퍼에 모아 두었다가 커밋이 생기면 AI_LOG.md 작업 로그에 기록한다.
#   ai-log.sh prompt  ← UserPromptSubmit
#   ai-log.sh commit  ← PostToolUse(Bash)
set -euo pipefail
export LC_ALL="${LC_ALL:-en_US.UTF-8}"
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

LOG=AI_LOG.md
STATE=.claude/.ai-log
PROMPTS="$STATE/prompts"
LAST="$STATE/last-commit"
SECTION='## 작업 로그 (시간순)'
mkdir -p "$STATE"
input=$(cat)

case "${1:-}" in
  prompt)
    p=$(jq -r '.prompt // empty' <<<"$input" | tr '\n' ' ' | tr -s ' ' | sed 's/^ *//; s/ *$//')
    [[ -z "${p// }" || "$p" == /* ]] && exit 0  # 빈 입력, 슬래시 커맨드 제외
    (( ${#p} > 300 )) && p="${p:0:300}…"
    printf '  - %s `%s`\n' "$(date +%H:%M)" "$p" >> "$PROMPTS"
    ;;

  commit)
    [[ "$(jq -r '.tool_input.command // empty' <<<"$input")" == *"git commit"* ]] || exit 0
    head=$(git rev-parse HEAD)
    last=$(cat "$LAST" 2>/dev/null || true)
    [[ "$last" == "$head" ]] && exit 0  # 커밋 실패 또는 이미 기록됨
    if [[ -n "$last" ]] && git merge-base --is-ancestor "$last" "$head"; then
      commits=$(git rev-list --reverse "$last..$head")
    else
      commits=$head
    fi

    grep -qxF "$SECTION" "$LOG" || printf '\n---\n\n%s\n' "$SECTION" >> "$LOG"
    for c in $commits; do
      subject=$(git show -s --format=%s "$c")
      [[ "$subject" == "docs(ai-log)"* ]] && continue  # 로그 자체 커밋은 기록하지 않음
      files=$(git show --name-only --format= "$c" | grep -vxF "$LOG" | sed 's/.*/`&`/' | paste -sd ',' - | sed 's/,/, /g')
      {
        printf '\n### %s\n\n' "$subject"
        printf -- '- 커밋: `%s` · %s\n' "$(git rev-parse --short "$c")" "$(git show -s --format=%cd --date=format:'%Y-%m-%d %H:%M' "$c")"
        printf -- '- 변경 파일: %s\n' "${files:-없음}"
        if [[ -s "$PROMPTS" ]]; then
          printf -- '- 프롬프트:\n'; cat "$PROMPTS"; : > "$PROMPTS"
        fi
        printf -- '- 결정: \n- 검증: \n- 직접 수정: \n'
      } >> "$LOG"
    done
    echo "$head" > "$LAST"
    ;;
esac
