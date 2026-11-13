// Checks that the web (lib/slugify.ts) and the CLI (cli/rsn) clean names identically.
// Run: npm test
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { slugify } from "../lib/slugify.ts";

const cases = readFileSync(new URL("./cases.tsv", import.meta.url), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((l) => l.split("\t"));

let failed = 0;
for (const [input, expected] of cases) {
  const web = slugify(input);
  const cli = execFileSync("zsh", ["cli/rsn", "-s", "--", input], { encoding: "utf8" }).trim();
  const ok = web === expected && cli === expected;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${JSON.stringify(input)}`);
  if (!ok) console.log(`    expected ${expected}\n    web      ${web}\n    cli      ${cli}`);
}
console.log(failed ? `\n${failed} failed` : `\nall ${cases.length} passed`);
process.exit(failed ? 1 : 0);
