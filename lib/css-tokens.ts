// Reads the light-dark() tokens from app/globals.css, so tests check the real values and
// can't drift from a copy.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Tokens = Record<string, { light: string; dark: string }>;

/** Split "a, b" at the top-level comma (commas inside parentheses don't count). */
function splitPair(args: string): [string, string] {
  let depth = 0;
  for (let i = 0; i < args.length; i++) {
    const ch = args[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) return [args.slice(0, i).trim(), args.slice(i + 1).trim()];
  }
  throw new Error(`light-dark() needs two values: ${args}`);
}

export function readTokens(css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8")): Tokens {
  const tokens: Tokens = {};
  for (const m of css.matchAll(/--([a-z0-9-]+):\s*light-dark\((.+)\);/g)) {
    const [light, dark] = splitPair(m[2]);
    tokens[m[1]] = { light, dark };
  }
  return tokens;
}
