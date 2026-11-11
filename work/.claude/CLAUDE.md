# CLAUDE.md, work folder operating rules

This file is the root for agents working in this folder and every project folder under it.
When it conflicts with a project-level file, this file wins for cross-cutting rules; project-level files win for project facts.

---

## 1. Who this serves

- Name: `<name>`
- Role: `<role>`
- Work done here:
  1. `<kind of work, for example: knowledge work (ingest, organize, query notes)>`
  2. `<kind of work, for example: operational work (meeting prep, drafts, tasks, commitments)>`

Most requests touch more than one kind. Identify which applies before acting.

---

## 2. Active projects

Use the canonical names below. Folders use the canonical form.

| Project          | Org     | Folder              |
| ---------------- | ------- | ------------------- |
| `<project name>` | `<org>` | `<project-folder>/` |

Each project folder carries its own `CLAUDE.md` with project facts (see Section 6).

If a note mentions a project not in this table, ask before creating a new folder.

---

## 3. Workspace structure

- Agent-managed: `<folders agents may create and edit in>`
- Read-only source material: `<raw source folder>`. Never edit it.
- Archive: `<archive folder>`. Treat it as non-canonical.
- Not agent-managed: `<folders agents must leave alone>`

---

## 4. Priority matrix

**High-stakes.** Before acting, you must check the current state in the external tools first, then show the sources you used.

- Create, update or close a task on the task board
- Draft any message
- Meeting prep or agenda
- Confirm commitments or deadlines
- Any output sent to or affecting another person

**Low-stakes.** Files in this folder are enough.

- Format an existing note
- Append to a personal log
- Summarize a document for private use

---

## 5. Skill routing

| Trigger                                                                    | Skill                              |
| -------------------------------------------------------------------------- | ---------------------------------- |
| Start or continue work on one project, or `/session-ritual <project>`      | `session-ritual` (this folder)     |
| Follow up on a meeting from its transcript                                 | `process-meeting` (global folder)  |
| Stress-test a plan or decision, no files written                           | `grilling` (global folder)         |
| Rewrite prose another person will read so it sounds like the writer        | `humanizer` (global folder)        |
| Open a pull request for a change                                           | `ship-pr` (project folder)         |
| `<your trigger>`                                                           | `<your skill>`                     |

---

## 6. Per-project CLAUDE.md convention

Claude Code loads `CLAUDE.md` from the working directory and every parent directory. So a project `CLAUDE.md` holds only what is specific to that project:

- Org and current phase
- Tech stack and live URLs
- Pointers to external resources (shared drive folder, task board list, chat channel, meeting recorder tag)
- People with their roles
- Source-of-truth notes inside the folder
- Project-specific routing or naming conventions
- Cadence (sprint length, standing meetings)

Do not repeat what this file already says.

Rules that must reach every project live in this file. `rules/` also reaches them in testing, but the docs do not promise it.
