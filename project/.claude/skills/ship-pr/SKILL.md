---
name: ship-pr
description: Ship one small change on its own branch as a pull request for the owner. Formats only the changed files, runs the gates, commits, pushes the branch, opens the PR, waits for CI, gets a sub-agent review, and stops. Never merges. Use for "open the PR", "ship it", "send it for review".
---

# ship-pr

## Before you start

- You are on your own branch, never `main`: `git branch --show-current`.
- The change is made. `git diff origin/main...HEAD --stat` or `git status --short` shows it. If both are empty, stop.

## Steps

1. **Format only changed files.** List them with `git status --short` and `git diff --name-only origin/main...HEAD`. Format those files only. Never run a repo-wide format.
2. **Run the gates.** `sh .claude/scripts/gates.sh`. Each gate must exit 0. Record each result for the PR body.
3. **Commit** with a plain sentence subject.
4. **Push the branch.** `git push -u origin <branch>`. Always name the branch. Never push `main`, never force-push.
5. **Open the PR.** Write a body that says what changed, why, and the gate results, to a scratch file.
   ```
   gh pr create --base main --head <branch> --title "<plain sentence>" --body-file <file>
   ```
6. **Wait for CI.** `gh pr checks <n> --watch`.
7. **Review.** Spawn one reviewer sub-agent with an explicit `model: opus` or `model: sonnet`. Tell it to pass the same model rule to any agent it spawns. Give it the owner's request, `git diff origin/main...HEAD` and the PR body. It checks:
   - the diff matches the request, and nothing else changed;
   - the rules in the project `CLAUDE.md` hold;
   - the gates ran.
   Fix what it finds, re-run the gates, push.
8. **Hand over and STOP.** Reply to the owner with the PR link. The owner merges. Never run `gh pr merge`, never approve, never enable auto-merge.

## When CI fails

- Read the failed log with `gh run view <run-id> --log-failed` (run id from `gh pr checks <n>`). Fix on the branch, re-run the gates, commit, push again. No force-push.
- **Cause outside the repo:** stop. Tell the owner what failed and the exact log line.

## Report

- The PR link and number.
- The reviewer's model, its findings, and what you fixed.
- The gate results.
- CI status.
