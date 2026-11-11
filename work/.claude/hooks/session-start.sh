#!/bin/sh
# SessionStart hook: list the project folders in this work folder.
# Plain stdout from a SessionStart hook is added to Claude's context.
# A project folder is a direct, non-hidden sub-folder with CLAUDE.md or .claude/CLAUDE.md.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
header=0
for d in */; do
  d=${d%/}
  # The glob stays literal when nothing matches; the test below skips it.
  if [ -f "$d/CLAUDE.md" ] || [ -f "$d/.claude/CLAUDE.md" ]; then
    [ "$header" = 0 ] && echo "Project folders here (each has a CLAUDE.md):" && header=1
    echo "$d"
  fi
done
exit 0
