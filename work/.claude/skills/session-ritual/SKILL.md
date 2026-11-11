---
name: session-ritual
description: Session ritual for one project folder under this work folder. Use when the user names a project, asks to continue work on it, or runs /session-ritual <project>. Loads the project brain at the start and keeps its status and log current at the end.
---

# /session-ritual <project>

Project folder: `<project>/` (relative to this work folder).

## Start (every session that touches the project)

1. Read `<project>/CLAUDE.md` (or `<project>/.claude/CLAUDE.md`), the `## Status` block of `<project>/README.md`, and the last 3 entries of `<project>/LOG.md`.
2. If a file is missing, say so and ask. Do not create it silently.
3. State in one line: phase, next action. Then do the work.

## During

- Facts you look up. Never infer; if a fact is not in a file or stated by the user, ask.
- Raw data is read-only.

## End (before the final message)

1. Append one `LOG.md` entry per event that happened. Nothing happened = one entry with what was discussed.
2. Refresh the `## Status` block in `README.md`.
3. If a snapshot fact changed, update the project `CLAUDE.md`.
4. Final message: what changed, next action.

To make a ritual for one project, copy this folder to `skills/<project>/` and replace `<project>` with the real folder name.
