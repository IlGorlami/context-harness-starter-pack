// Run: node --test .claude/hooks/prod-guard.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const hook = fileURLToPath(new URL("./prod-guard.mjs", import.meta.url));

function runHook(input) {
  return spawnSync(process.execPath, [hook], { input, encoding: "utf8" });
}

const payload = (command) => JSON.stringify({ tool_name: "Bash", tool_input: { command } });

const cases = [
  // R1: production flag.
  ["npx vercel --prod", 2],
  ["vercel deploy --prod", 2],
  ["mycli run seed --production", 2],
  // R2: production env variable.
  ["VERCEL_ENV=production npm run build", 2],
  ["export VERCEL_ENV=production", 2],
  ['env VERCEL_ENV="production" npm run build', 2],
  // R3: push to main or master.
  ["git push origin main", 2],
  ["git -C . push origin main", 2],
  ["git push -u origin master", 2],
  ["git push origin HEAD:main", 2],
  // Wrapped and chained forms.
  ['bash -c "npx vercel --prod"', 2],
  ["npm test && vercel --prod", 2],
  // Allowed.
  ["npm run build", 0],
  ["git push -u origin my-branch", 0],
  ["git push origin feature/main-menu", 0],
  ['git commit -m "document the --prod flag"', 0],
  ['echo "git push origin main"', 0],
  ["git log main", 0],
  ["git checkout main", 0],
  ["git pull origin main", 0],
  ["vercel env ls", 0],
  ["NODE_ENV=production npm run build", 0],
  ["", 0],
];

for (const [command, expected] of cases) {
  test(`${expected === 2 ? "blocks" : "allows"}: ${command || "(empty command)"}`, () => {
    const res = runHook(payload(command));
    assert.equal(res.status, expected, res.stderr);
    if (expected === 2) assert.match(res.stderr, /^Blocked by prod-guard: /);
  });
}

test("allows: stdin that is not JSON", () => {
  assert.equal(runHook("not json").status, 0);
});
