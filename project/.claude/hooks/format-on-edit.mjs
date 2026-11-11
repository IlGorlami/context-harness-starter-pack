#!/usr/bin/env node
/*
 * format-on-edit: Claude Code PostToolUse hook for Edit and Write.
 *
 * Reads the hook payload (JSON) from stdin and runs Prettier on
 * tool_input.file_path only. It skips the file when it is outside the project
 * (CLAUDE_PROJECT_DIR, else the payload cwd), ignored by .gitignore or
 * .prettierignore (the same files `npx prettier --write` reads), inside
 * node_modules, or of a type Prettier has no parser for.
 * It never touches another file and always exits 0, so a format problem
 * never fails the edit.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

try {
  const payload = JSON.parse(readFileSync(0, "utf8"));
  const root = path.resolve(process.env.CLAUDE_PROJECT_DIR || payload.cwd || ".");
  const file = path.resolve(root, payload.tool_input?.file_path ?? "");
  const rel = path.relative(root, file);
  if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
    const prettier = await import("prettier");
    const info = await prettier.getFileInfo(file, {
      ignorePath: [".gitignore", ".prettierignore"].map((f) => path.join(root, f)),
    });
    if (!info.ignored && info.inferredParser) {
      const source = readFileSync(file, "utf8");
      const options = (await prettier.resolveConfig(file)) ?? {};
      const output = await prettier.format(source, { ...options, filepath: file });
      if (output !== source) writeFileSync(file, output);
    }
  }
} catch {
  // Fail open: a missing file, a syntax error or a bad payload leaves the file as it is.
}
process.exit(0);
