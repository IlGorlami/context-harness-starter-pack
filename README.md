# context-harness-starter-pack

A global context harness for any AI agent to help you on a daily basis.

This repo holds three `.claude` folders you can copy, paste and edit. Each one sets up Claude Code at a different level: everything you do, one work folder, or one project. They follow the setup I use every day, with my own projects and names taken out.

Video: VIDEO_URL (Context Harness #1: The one file that makes Claude do what you asked)

## The three folders

| Folder in this repo | Copy it to | What it covers |
|---|---|---|
| `global/.claude/` | `~/.claude/` | Every session, in every folder |
| `work/.claude/` | `~/work/.claude/` | The folder you start Claude Code in for work, with one sub-folder per project |
| `project/.claude/` | `~/work/<project>/.claude/` | One project |

`~/work` is an example. Use the folder that holds your projects.

Each folder has the same six parts:

| Part | What it is |
|---|---|
| `CLAUDE.md` | Instructions Claude reads at the start of every session |
| `rules/` | More instructions, one topic per file. A rule can be limited to certain files with `paths:` |
| `settings.json` | Permissions, and the list of hooks to run |
| `hooks/` | Scripts Claude Code runs on an event: a session starts, a command is about to run, a file was edited, a reply ends |
| `scripts/` | Helper scripts that hooks and skills call |
| `skills/` | Procedures Claude follows when you ask for them by name |

The work folder also has `agents/`, with one read-only search agent.

## Install

You need Claude Code. The project hooks need Node.js, the global hook needs `python3`, and the `ship-pr` skill needs the GitHub CLI (`gh`).

Do not drag a `.claude` folder onto one you already have. Finder replaces the whole folder, and `~/.claude` holds your sign-in, your history and your sessions. Use `cp -Rn`, which adds the new files and never overwrites one that is already there.

```sh
git clone https://github.com/IlGorlami/context-harness-starter-pack.git
cd context-harness-starter-pack

# 1. Global
mkdir -p ~/.claude
cp -Rn global/.claude/. ~/.claude/

# 2. Work folder
mkdir -p ~/work/.claude
cp -Rn work/.claude/. ~/work/.claude/

# 3. One project
mkdir -p ~/work/<project>/.claude
cp -Rn project/.claude/. ~/work/<project>/.claude/
```

Replace `~/work` and `<project>` with your own paths before you run steps 2 and 3.

`cp -Rn` skips every file you already have and prints nothing about it. On macOS it exits with status 1 when it skips one, which is expected. If you already had a `settings.json` or a `CLAUDE.md` in the target, yours is untouched, so open both versions and merge them by hand.

Then restart Claude Code. The first time you start it in a folder that has a `.claude/settings.json`, it asks whether you trust the folder. Until you accept, it ignores the `allow` rules in that file. Run `/hooks` to see which hooks are active.

## What loads when

Claude Code reads only part of a parent `.claude` folder when you start it in a folder below, so where you put a file decides where it applies.

| Part | Start in `~/work` | Start in `~/work/<project>`, not its own git repo | Start in `~/work/<project>`, its own git repo |
|---|---|---|---|
| Global, all six parts | yes | yes | yes |
| Work `CLAUDE.md` | yes | yes | yes |
| Work `rules/` | yes | yes | yes |
| Work `skills/` and `agents/` | yes | yes | no |
| Work `settings.json` and hooks | yes | no | no |
| Project `CLAUDE.md`, `rules/`, `skills/` | not at the start | yes | yes |
| Project `settings.json` and hooks | no | yes | yes |

I tested the work and project rows with the files in this repo on Claude Code 2.1.322. The docs promise that a parent `CLAUDE.md` loads but say nothing about a parent `rules/` folder, so that row could change. When you start in `~/work`, the docs say a project's `CLAUDE.md`, rules and skills load once Claude works with a file in that project.

What this means for where you put things:

- Hooks and permission rules in the work folder apply only when you start Claude Code there. A project that needs a guard carries its own, and a guard you want everywhere goes in the global folder.
- The work `CLAUDE.md` reaches every project under it, so a rule that must reach every project goes there.
- A project that is its own git repo does not see the work folder's skills and agents. Copy the ones it needs into the project.

## Make it yours

### Global

- `CLAUDE.md`, `rules/writing-style.md` and `rules/delegation.md` are my own rules, split by topic and otherwise left as they are, with a duplicated rule number and a few typos. Read them once and delete what you do not want. Rules 1 and 2 (no guessing, state your assumptions) do most of the work.
- `rules/delegation.md` mentions `~/.claude/scripts/cursor-delegate`, `cursor-quota` and a `cursor-delegate` skill. Those live on my machine and are not included. Delete that paragraph or put your own scripts in `scripts/`.
- `settings.json` allows read-only git commands without a prompt, denies reading `.env` files, and runs `hooks/log-progress.sh`. The deny rule also matches files such as `.env.example`.
- `hooks/log-progress.sh` appends one line to `~/.claude/progress.log` each time Claude or a sub-agent finishes a reply. `hooks/README.md` shows how to test it and how to switch it off.
- `skills/humanizer` rewrites prose that sounds machine-written.
- `skills/grilling`, with its alias `grill-me`, interviews you about a plan before anything gets built.
- `skills/process-meeting` turns one meeting transcript into confirmed decisions, action items and an unsent follow-up draft. It needs connectors for a meeting recorder (Fireflies or Wispr Flow), Slack, Gmail and your task board. Paste two of your own follow-ups into `references/exemplars.md` so it has a structure to copy.

### Work

- Fill the placeholders in `CLAUDE.md`: who you are, your active projects, your folder map and your skill routing table.
- `rules/communication.md` and `rules/safety.md` are my rules. Edit them.
- `settings.json` allows read-only `git` and `gh` commands, web search, and fetching from GitHub and the Claude docs. It runs `hooks/session-start.sh`, which tells Claude which sub-folders are projects.
- `skills/session-ritual/` is a start-and-end routine for one project. It reads the project's `CLAUDE.md`, its `README.md` status and its `LOG.md` at the start, and updates them at the end. Copy the folder once per project and replace `<project>`.
- `agents/context-retriever.md` is a read-only search agent that runs on Sonnet.
- `scripts/alpha-folders.sh` is optional. It makes VS Code list folders by name when the explorer sorts by modified date.

### Project

- Fill the placeholders in `CLAUDE.md`. `process-meeting` reads the `Side` column of the People table to decide who gets which follow-up.
- `rules/code.md` and `rules/content.md` load only when Claude works with a matching file. Change `paths:` to your folders and replace the example rules.
- `hooks/prod-guard.mjs` blocks `--prod` flags, `VERCEL_ENV=production`, and pushes to `main` or `master`. Edit the three lists at the top of the file, then run `node --test .claude/hooks/prod-guard.test.mjs`. `hooks/README.md` lists what the guard does not catch.
- `hooks/format-on-edit.mjs` runs Prettier on each file Claude edits. It does nothing if the project has no Prettier.
- `scripts/gates.sh` runs lint, typecheck and tests. Replace the three commands with yours. The `ship-pr` skill calls it.
- `skills/ship-pr/` runs the gates, opens a pull request, has a second agent review it, and stops. You merge.

A sub-folder that needs facts of its own gets its own `CLAUDE.md`. Copy `project/.claude/CLAUDE.md` and keep only what that folder alone needs.

## Limits

- Deny rules and the guard hook catch the usual form of a command. They are not a security boundary, and the Claude Code docs say the same about deny rules.
- I run this on macOS. I have not tested it on Linux or Windows.
- This is a living repo. I update it as my own setup changes.

## Credits

- `skills/grill-me` and `skills/grilling` come from [Matt Pocock's skills](https://github.com/mattpocock/skills), MIT. `grill-me` is unchanged. `grilling` is his skill merged with rules of my own, and its Provenance section says which part is which.
- `skills/humanizer` is [blader/humanizer](https://github.com/blader/humanizer) by Siqi Chen, version 3.1.0, MIT, unchanged. A newer version exists upstream.

Each of these three folders carries its own `LICENSE` file. Keep it with the folder when you copy the skill.

## License

MIT, see `LICENSE`. The three skill folders listed under Credits stay under their own authors' copyright and licence.
