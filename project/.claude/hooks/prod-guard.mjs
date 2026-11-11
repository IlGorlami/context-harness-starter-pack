#!/usr/bin/env node
/*
 * prod-guard: Claude Code PreToolUse hook for the Bash tool.
 *
 * Reads the hook payload (JSON) from stdin and inspects tool_input.command.
 * Exit 2 + stderr = block the call and show the reason. Exit 0 = allow.
 *
 * The command is split into shell segments (on ; && || | and newlines).
 * Text inside quotes is ignored, so a commit message or an echo that only
 * mentions a rule passes. The string after `bash -c` / `sh -c` / `zsh -c` is
 * checked the same way.
 *
 * Blocked when a segment:
 *   R1. carries a flag from PROD_FLAGS (default `--prod`, `--production`).
 *   R2. sets a variable from PROD_ENV_VARS (default `VERCEL_ENV`) to
 *       `production`: inline, with `export` or with `env`, quoted or not.
 *   R3. is `git push` with a branch from PROTECTED_BRANCHES (default `main`,
 *       `master`) as a whole ref, also `HEAD:main`. `git -C . push` counts.
 *
 * To add a rule: edit the lists below, or add a [reason, test] pair to RULES.
 * The test gets one segment with its quoted text removed. Then add a case to
 * prod-guard.test.mjs.
 *
 * Known gaps: a bare `git push` while on main; shell scripts, Makefiles and
 * `eval` that call a CLI; a production target stored in an env file; shell
 * aliases; a quoted branch name (`git push origin "main"`); `env` with an
 * option that takes a value (`env -u X VERCEL_ENV=production`).
 * Unparseable stdin fails open so a malformed payload never bricks Bash.
 */
import { readFileSync } from "node:fs";

// Edit these lists to match your project.
const PROD_FLAGS = ["--prod", "--production"];
const PROD_ENV_VARS = ["VERCEL_ENV"];
const PROTECTED_BRANCHES = ["main", "master"];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const anyOf = (list) => list.map(esc).join("|");

// R1: the flag as a whole word, alone or as `--prod=...`.
const PROD_FLAG = new RegExp(`(?:^|\\s)(?:${anyOf(PROD_FLAGS)})(?:=|\\s|$)`);
// R2: optional export/env, other VAR=value prefixes, then the production assignment.
const PROD_ASSIGN = new RegExp(
  `^\\s*\\(?\\s*(?:export\\s+|env\\s+(?:-\\S+\\s+)*)?(?:[A-Za-z_]\\w*=\\S*\\s+)*` +
    `(?:${anyOf(PROD_ENV_VARS)})=production(?:\\s|\\)|$)`,
);
// R3: a ref that ends on a protected branch: main, +main, HEAD:main, refs/heads/main.
const PROTECTED_REF = new RegExp(`^\\+?(?:[^:]*:)?(?:refs/heads/)?(?:${anyOf(PROTECTED_BRANCHES)})$`);
// git global options that take the next word as their value.
const GIT_OPT_WITH_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace"]);

function pushesProtected(seg) {
  const words = seg.replace(/^\s*\(/, "").trim().split(/\s+/);
  let i = 0;
  while (i < words.length && /^[A-Za-z_]\w*=/.test(words[i])) i++; // VAR=value prefixes
  if (!/^(?:\S*\/)?git$/.test(words[i] ?? "")) return false;
  i++;
  while (i < words.length && words[i].startsWith("-")) {
    i += GIT_OPT_WITH_VALUE.has(words[i]) ? 2 : 1;
  }
  if (words[i] !== "push") return false;
  return words.slice(i + 1).some((w) => !w.startsWith("-") && PROTECTED_REF.test(w));
}

const RULES = [
  [`the command carries a production flag (${PROD_FLAGS.join(", ")})`, (seg) => PROD_FLAG.test(seg)],
  [`the command sets ${PROD_ENV_VARS.join(" or ")} to production`, (seg) => PROD_ASSIGN.test(seg)],
  [`the command pushes to ${PROTECTED_BRANCHES.join(" or ")}`, pushesProtected],
];

const SHELL_C = /\b(?:ba|z|da|k)?sh\s+(?:-[A-Za-z]+\s+)*-[A-Za-z]*c\s+(["'])([\s\S]*?)\1/g;

function reasonToBlock(command) {
  for (const [, , inner] of command.matchAll(SHELL_C)) {
    const reason = reasonToBlock(inner);
    if (reason) return reason;
  }
  const plain = command
    .replace(/=(["'])([^"'\s;&|]*)\1/g, "=$2") // VAR="production" becomes VAR=production
    .replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""'); // drop all other quoted text
  for (const seg of plain.split(/&&|\|\||[;|\n]/)) {
    for (const [reason, hit] of RULES) if (hit(seg)) return reason;
  }
  return null;
}

let command = "";
try {
  command = JSON.parse(readFileSync(0, "utf8"))?.tool_input?.command ?? "";
} catch {
  process.exit(0);
}
const reason = typeof command === "string" ? reasonToBlock(command) : null;
if (reason) {
  process.stderr.write(
    `Blocked by prod-guard: ${reason}.\n` +
      `Command: ${command}\n` +
      "Production commands are run by the owner in their own terminal. " +
      "Show the owner the exact command and why it is needed, then stop.\n",
  );
  process.exit(2);
}
process.exit(0);
