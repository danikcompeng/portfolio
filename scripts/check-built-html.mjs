// Runs after `next build` (npm "postbuild"): fails the build if a "[" placeholder reaches
// anything a visitor or a screen reader gets: the visible text of a prerendered page, or the
// alt, aria-label, title, placeholder and meta content attributes. Scripts and styles are
// ignored, since the framework's own payloads are full of brackets. The home page must be
// among the pages checked.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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

// Where prerendered pages can be: .next/server/app locally; on Vercel the build hook moves
// them (e.g. into .next/server/route-cache), so search all of .next/server, plus the Build
// Output API folder when it exists.
const ROOTS = [".next/server", ".vercel/output"];

function main() {
  const files = ROOTS.map((r) => join(process.cwd(), r))
    .filter((r) => existsSync(r))
    .flatMap(htmlFiles);
  if (!files.some((f) => basename(f) === "index.html")) {
    console.error(`check-built-html: no prerendered home page (index.html) under ${ROOTS.join(" or ")}`);
    // Say what is there, so a changed build layout is easy to diagnose.
    const all = [".next", ".vercel"].map((r) => join(process.cwd(), r)).filter((r) => existsSync(r)).flatMap(htmlFiles);
    console.error(`check-built-html: HTML files found: ${all.length ? all.join(", ") : "none"}`);
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
