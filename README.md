# context-harness-starter-pack

A global context harness for any AI agent to help you on a daily basis.

This repo holds the `CLAUDE.md` files I use with Claude Code, as they are today, plus two templates. A `CLAUDE.md` is a plain Markdown file that Claude Code loads at the start of every session. Claude reads the global one from `~/.claude/CLAUDE.md`, then the one in your project folder, then any in the folders between your project root and the folder you are working in. Together they are the standing instructions that make the output repeatable.

Video: VIDEO_URL (Context Harness #1: The one file that makes Claude do what you asked)

## Contents

| Path | What it is |
|---|---|
| `global/CLAUDE.md` | My global file, verbatim. Five rules for every output, a writing style, and a delegation rule for context retrieval |
| `templates/project-CLAUDE.md` | Skeleton for a project folder: what the project is, its tools and IDs, who is involved, where the source of truth lives |
| `templates/folder-CLAUDE.md` | Skeleton for a sub-folder with facts of its own, for example one product line, one vehicle, one client |

## Adopt it in three steps

1. Copy `global/CLAUDE.md` to `~/.claude/CLAUDE.md`. Read it once and delete any rule you do not want. Rules 1 and 2 (no guessing, state assumptions) do most of the work.
2. When a project has facts Claude cannot derive from the code or the global file (IDs, stakeholders, cadence, where the source of truth is), copy `templates/project-CLAUDE.md` into the project root as `CLAUDE.md` and fill it in.
3. Add a folder-level `CLAUDE.md` from `templates/folder-CLAUDE.md` only when a sub-folder needs rules or facts of its own. Keep it short; it inherits everything above it.

## Notes

- The last section of the global file, "delegation for context retrieving", mentions `~/.claude/scripts/cursor-delegate` and `cursor-quota`. Those are scripts on my machine and are not included here. Delete that paragraph or replace it with your own tooling.
- The global file is not polished. It has a duplicated rule number and a few typos. I kept it as it is because the video shows the real file, and because it works.
- This is a living repo. I update it as my own setup changes.

## License

MIT, see `LICENSE`.
