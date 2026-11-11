# hooks

`log-progress.sh` writes one line to a local log each time Claude or a sub-agent finishes a reply. It runs on the `Stop` and `SubagentStop` events.

## Line format

```
YYYY-MM-DD HH:MM:SS<TAB><event><TAB><cwd><TAB><first 200 characters of the last reply>
```

Newlines and tabs in the reply become single spaces, so each entry stays on one line.

## Where the log is

The default is `~/.claude/progress.log`. To move it, set `PROGRESS_LOG` to another path in the environment that starts Claude Code.

The hook never prints, never uses the network, and never reads the transcript. It always exits 0, so it never blocks Claude from stopping. If stdin is not valid JSON, a field is missing, or `python3` is not installed, it writes nothing.

## Test it (dry run)

```bash
printf '%s' '{"hook_event_name":"Stop","cwd":"/tmp","last_assistant_message":"hello\nworld"}' | PROGRESS_LOG=/tmp/progress-test.log bash ~/.claude/hooks/log-progress.sh; cat /tmp/progress-test.log
```

You should see one line that ends in `hello world`.

## Wiring

- `settings.json` is the only place hooks are wired. This folder only holds the script.
- To switch the hook off, remove the `Stop` and `SubagentStop` entries from `~/.claude/settings.json`.
- You must restart the Claude Code session after you edit `settings.json`.
- Run `/hooks` in Claude Code to list the active hooks.
