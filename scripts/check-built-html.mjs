// Runs after `next build` (npm "postbuild"): fails the build if a "[" placeholder reaches
// anything a visitor or a screen reader gets: the visible text of a prerendered page, or the
// alt, aria-label, title, placeholder and meta content attributes. Scripts and styles are
// ignored, since the framework's own payloads are full of brackets. The home page must be
// among the pages checked.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { pathToFileURL } from "node:url";

const decode = (s) => s.replace(/&#x5b;|&#91;|&lsqb;|&lbrack;/gi, "[");

/** The text a visitor can read: no scripts, styles, templates, comments or tags. */
export function visibleText(html) {
  return decode(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

/** Attribute values people or assistive tech read: alt, aria-label, title, placeholder, meta content. */
export function readableAttributes(html) {
  const out = [];
  const body = html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  for (const m of body.matchAll(/\s(alt|aria-label|title|placeholder)\s*=\s*"([^"]*)"/gi)) out.push(decode(m[2]));
  for (const m of body.matchAll(/<meta\b[^>]*\scontent\s*=\s*"([^"]*)"/gi)) out.push(decode(m[1]));
  return out;
}

/** Problems found in one page's HTML (empty when clean). */
export function placeholderProblems(html) {
  const problems = [];
  const text = visibleText(html);
  const at = text.indexOf("[");
  if (at !== -1) problems.push(`text: …${text.slice(Math.max(0, at - 40), at + 60).replace(/\s+/g, " ")}…`);
  for (const value of readableAttributes(html)) if (value.includes("[")) problems.push(`attribute: "${value}"`);
  return problems;
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return p.endsWith(".html") ? [p] : [];
  });
}

function main() {
  const root = join(process.cwd(), ".next/server/app");
  const files = htmlFiles(root);
  if (!files.some((f) => basename(f) === "index.html")) {
    console.error("check-built-html: the home page (.next/server/app/index.html) wasn't prerendered");
    process.exit(1);
  }
  let failed = false;
  for (const file of files) {
    for (const problem of placeholderProblems(readFileSync(file, "utf8"))) {
      failed = true;
      console.error(`check-built-html: "[" in ${file}: ${problem}`);
    }
  }
  if (failed) process.exit(1);
  console.log(`check-built-html: ${files.length} pages, no "[" placeholders`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
