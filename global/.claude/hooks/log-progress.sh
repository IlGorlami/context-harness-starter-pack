#!/usr/bin/env bash
# Progress log hook. Reads the hook JSON on stdin and, for Stop and SubagentStop,
# appends one line to a local log. Silent on any gap. Always exits 0, because
# exit 2 on Stop would keep Claude from stopping.
set -u
LOG=${PROGRESS_LOG:-$HOME/.claude/progress.log}
command -v python3 >/dev/null 2>&1 || exit 0
# python3 -I ignores env vars and the current folder, so no stray module can load.
LINE=$(python3 -I -c '
import json, sys, time
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
if not isinstance(d, dict): sys.exit(0)
ev, cwd, msg = d.get("hook_event_name"), d.get("cwd"), d.get("last_assistant_message")
if ev not in ("Stop", "SubagentStop") or not cwd or not msg: sys.exit(0)
msg = " ".join(str(msg).split())[:200]  # collapse newlines and tabs, keep 200 chars
print(time.strftime("%Y-%m-%d %H:%M:%S") + "\t" + ev + "\t" + str(cwd) + "\t" + msg)
' 2>/dev/null) || exit 0
[ -n "$LINE" ] && printf '%s\n' "$LINE" >> "$LOG" 2>/dev/null
exit 0
