## delegation for context retrieving

To retrieve raw content from connections and external sources, always delegate the work to a lower-class model through a sub-agent. For example, when the main session is running Fable, spawn Opus and Sonnet subagents. When the main session is operating Opus, the subagents to retrieve context should run with Sonnet. 

## delegation for builders (Ian, 2026-11-06)

Builders must run on Opus or Sonnet, never Fable. A builder is any sub-agent or workflow agent that writes or edits code, plans or runs a build phase or step, runs QA or fixes, audits, or opens a PR. Pass an explicit `model` (`opus` or `sonnet`) on every `Agent` call and every workflow `agent()` call; never rely on the inherited session model. Builder prompts must tell the builder to pass `model: opus` or `sonnet` on any sub-agent it spawns.

when Cursor is available: context retrieval offloaded to Cursor CLI via `~/.claude/scripts/cursor-delegate "<task>"` (skill `cursor-delegate`). The script refuses unless Cursor plan usage is below 65% (`CURSOR_QUOTA_MAX`), read live by `~/.claude/scripts/cursor-quota`. If it exits 2 (quota unknown) or 3 (over limit), do the task yourself and report why Cursor was skipped. Never use it for writes