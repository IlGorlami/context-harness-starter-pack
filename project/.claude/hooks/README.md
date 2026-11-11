# Hooks

Audience: agents, and the owner when a hook blocks something.

| Hook | Event | Job |
|---|---|---|
| `prod-guard.mjs` | `PreToolUse` on `Bash` | Blocks commands that would touch production or push to `main` |
| `format-on-edit.mjs` | `PostToolUse` on `Edit\|Write` | Runs Prettier on the file the agent just edited |

Both are registered in `.claude/settings.json`, the only place hooks are wired. You must restart the Claude Code session after editing it. Run `/hooks` to confirm both are listed.

## prod-guard

The guard reads each Bash command before it runs. It blocks the command (exit code 2, reason on stderr) when one shell segment matches a rule. Quoted text is ignored, so a commit message that mentions `--prod` passes.

| Rule | Example that is blocked |
|---|---|
| R1. A production flag: `--prod` or `--production` | `npx vercel --prod` |
| R2. A variable from the list (default `VERCEL_ENV`) set to `production`: inline, `export` or `env` | `VERCEL_ENV=production npm run build` |
| R3. `git push` with `main` or `master` as a whole ref, also `HEAD:main` | `git -C . push origin main` |
| Any rule above inside `bash -c`, `sh -c` or `zsh -c` | `bash -c "npx vercel --prod"` |

To add a rule, edit the lists at the top of `prod-guard.mjs` (`PROD_FLAGS`, `PROD_ENV_VARS`, `PROTECTED_BRANCHES`), or add a `[reason, test]` pair to `RULES`. Then add a case to `prod-guard.test.mjs`.

## Deny rules

`.claude/settings.json` also denies reading `.env` and `.env.*`, `git push * main`, `git push * master` and `gh pr merge *`. The docs say a deny rule "covers the invocation Claude usually produces and isn't a security boundary around the program". That is why the hook exists: it also sees `bash -c '...'` and `git -C . push`.

### Known gaps

- A bare `git push` while on `main` is not caught. Never work on `main`.
- Shell scripts, Makefiles and `eval` strings that call a CLI are not inspected.
- A production target stored in an env file is not detected.
- Shell aliases are not expanded.
- A quoted branch name (`git push origin "main"`) is not seen.
- `env` with an option that takes a value (`env -u X VERCEL_ENV=production ...`) is not seen.
- Every `--prod` is blocked, reads included. Narrow R1 if you need read-only production commands.

## format-on-edit

After an Edit or Write call, the hook runs Prettier on that one file. It skips the file when any of these is true:

- The file is outside the project folder (`CLAUDE_PROJECT_DIR`).
- `.gitignore` or `.prettierignore` ignores it.
- It is inside `node_modules`.
- Prettier has no parser for its type.

It does nothing when the project has no Prettier. It always exits 0 and has a 15 second timeout, so a format problem never fails the edit.

## Test

```bash
node --test .claude/hooks/prod-guard.test.mjs
```

Add a case whenever a rule changes.
