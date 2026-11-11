# <Project name>, Project-Level Operating Rules

Loaded by Claude Code when the working directory is inside this folder. Inherits the global `~/.claude/CLAUDE.md` and any `CLAUDE.md` in a parent folder. Holds only what is specific to this project and not derivable from the code or those files.

## Snapshot

| Field | Value |
|---|---|
| Owner | <your name or team> |
| Org / client | <who this is for> |
| Phase | <discovery, build, maintenance, archived> |
| Stack | <languages, frameworks, hosting> |
| Live URLs | <app URL, admin URL> |

## External resources

| Resource | ID or link |
|---|---|
| Task board | <list or board ID> |
| Team channel | <channel name and ID> |
| Management channel | <channel name and ID> |
| Docs folder | <link> |
| Meeting recordings | <tag or folder> |

## People

| Person | Role | Side | How to reach |
|---|---|---|---|
| <name> | <role> | <client, management or build> | <email or handle> |

`Side` is `client`, `management` or `build`. The `process-meeting` skill uses it to route follow-ups.

## Source of truth

| Priority | Note or file | Use it for |
|---|---|---|
| 1 | <path> | <what question it answers> |

## Never do

- Never push to `main`, merge a PR or approve one. The owner merges.
- Never run a production command. Show the owner the exact command and why, then stop.
- Never read `.env` files. Never put a secret in the repo, a doc, a commit or the chat.
- <your rule>

The guard `.claude/hooks/prod-guard.mjs` blocks the common forms (rules and gaps: `.claude/hooks/README.md`). Do not wrap commands to get around it.

## Where things live

| Concern | Path |
|---|---|
| <pages, routes or entry points> | <path> |
| <content, copy or config> | <path> |
| <tests> | <path> |

## Routing and conventions

- <where new notes, logs, or receipts go>
- <naming rules for files in this folder>
- <which skill or script handles which recurring job>

## Cadence

- <sprint length, standing meetings, reporting rhythm>

## Gotchas

Things that cost you time once. Date each one.

- <YYYY-MM-DD: what went wrong and how to avoid it>
- <YYYY-MM-DD: what went wrong and how to avoid it>

## Skills

| Skill | Use for |
|---|---|
| `ship-pr` | Run the gates, open the PR, get the sub-agent review, stop for the owner's merge |
| `<skill name>` | <what it is for> |

Routing: "open the PR" and "ship it" mean `ship-pr`.

## Open questions

- <decisions not yet made that an agent must not guess>
