// The site's own rules: never invent numbers, no phone number, never claim a project was
// built for a specific company,
// every link https (plans/portfolio.md section 9).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, extname } from "node:path";
import { describe, expect, it } from "vitest";
import * as site from "./site";
import { ascendLoop, bitewiseLoop, demos, orbitLoop } from "../components/media";
import type { Stat } from "./site";

/** Every file that ships text to the browser. */
function shippedTextFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if ([".ts", ".tsx", ".css", ".md", ".txt", ".svg", ".json"].includes(extname(p)) && !p.endsWith(".test.ts"))
        out.push(p);
    }
  };
  // Folders whose text reaches the page (lib/ holds maths, e.g. colour matrices).
  for (const dir of ["app", "components", "content", "public"]) walk(join(process.cwd(), dir));
  return out;
}

function stats(): [string, Stat][] {
  const found: [string, Stat][] = [];
  const visit = (path: string, v: unknown) => {
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.floor === "number" && typeof o.exact === "number") found.push([path, o as unknown as Stat]);
      else for (const [k, child] of Object.entries(o)) visit(`${path}.${k}`, child);
    }
  };
  for (const [k, v] of Object.entries(site)) visit(k, v);
  return found;
}

describe("content rules", () => {
  const files = shippedTextFiles();

  it("finds the files it checks", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  // North American numbers with or without separators, not digits inside a longer number.
  const phone = /(?<![\d.])(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)/;

  it("recognises phone numbers in every common shape", () => {
    for (const s of ["416-555-1234", "(416) 555-1234", "(416)555-1234", "4165551234", "+1 416 555 1234", "416.555.1234"]) {
      expect(s).toMatch(phone);
    }
    for (const s of ["2026-11-25", "0.3963377774", "1170x2532", "v=0.1.27"]) {
      expect(s).not.toMatch(phone);
    }
  });

  it("has no phone number anywhere that ships", () => {
    for (const f of files) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(phone);
    }
  });

  // "Built for Acme", "made for the Acme team", "created for Acme" — but not "built for a
  // specific company", the wording of the rule itself.
  const companyClaim = /\b(?:[Bb]uilt|[Mm]ade|[Dd]esigned|[Cc]reated|[Dd]eveloped) for (?:the )?(?![a-z])/;

  it("recognises a claim of being built for a company", () => {
    for (const s of ["built for Acme", "Built for Acme", "Made for Acme.", "created for Acme", "built for the Acme team"]) {
      expect(s).toMatch(companyClaim);
    }
    expect("never claim a project was built for a specific company").not.toMatch(companyClaim);
  });

  it("never claims a project was built for a specific company (site and Markdown docs)", () => {
    const docs = readdirSync(process.cwd()).filter((n) => n.endsWith(".md")).map((n) => join(process.cwd(), n));
    const plans = readdirSync(join(process.cwd(), "plans")).map((n) => join(process.cwd(), "plans", n));
    for (const f of [...files, ...docs, ...plans]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(companyClaim);
    }
  });

  it("each video pair points at its own theme's file, and every file is in public/media", () => {
    const pairs = [bitewiseLoop.sources, ascendLoop.sources, orbitLoop.sources, ...Object.values(demos).map((d) => d.sources)];
    expect(pairs.length).toBe(6);
    for (const pair of pairs) {
      expect(pair.dark).toMatch(/-dark\.mp4$/);
      expect(pair.light).toMatch(/-light\.mp4$/);
      for (const src of Object.values(pair)) expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
    }
  });

  // Every shipping picture carries its origin in a PNG text chunk (SOURCES.md). The case study's
  // Today alt describes the details-open capture of Nov 27 (round 15), so the file must be it.
  it("every PNG in public/media carries its origin, and the Today screen is the details-open capture", () => {
    const origin = (file: string) => {
      const b = readFileSync(file);
      for (let o = 8; o < b.length; ) {
        const n = b.readUInt32BE(o);
        if (b.toString("latin1", o + 4, o + 8) === "tEXt") return b.toString("latin1", o + 8, o + 8 + n);
        o += 12 + n;
      }
      return "";
    };
    const dir = join(process.cwd(), "public", "media");
    const pngs = readdirSync(dir).filter((f) => extname(f) === ".png");
    expect(pngs.length).toBeGreaterThan(10);
    for (const f of pngs) expect(origin(join(dir, f)), f).toMatch(/^(impeccable:prompt|Source)\0\S/);
    for (const theme of ["light", "dark"]) {
      const text = origin(join(dir, `bitewise-today-${theme}.png`));
      expect(text).toContain("Show details opened");
      expect(text).toContain("2026-11-27");
    }
    expect(site.bitewise.screens.today.alt).toMatch(/details open.*1,274 of 2,200 kcal/);
  });

  it("links only over https (or mailto / same-site)", () => {
    for (const [name, value] of Object.entries(site.links)) {
      if (name === "email") continue;
      // A theme pair ({ dark, light }) is checked link by link.
      const hrefs = typeof value === "string" ? [value] : Object.values(value);
      for (const href of hrefs) expect(href, name).toMatch(/^https:\/\//);
    }
  });

  it("gives every number a source, a date and a floor no higher than the count", () => {
    const all = stats();
    expect(all.length).toBeGreaterThan(5);
    for (const [path, s] of all) {
      expect(s.floor, path).toBeLessThanOrEqual(s.exact);
      expect(s.source.length, `${path} source`).toBeGreaterThan(10);
      expect(s.asOf, `${path} date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("formats a floor as N+", () => {
    expect(site.fmt({ floor: 900, exact: 917, asOf: "2026-11-24", source: "x".repeat(11) })).toBe("900+");
  });

  it("shows nothing that doesn't exist yet: every flag that's on has its file", () => {
    // Exact case: Windows ignores it, Vercel's Linux filesystem doesn't.
    const pub = (p: string) => {
      const full = join(process.cwd(), "public", p);
      return existsSync(full) && readdirSync(dirname(full)).includes(basename(full));
    };
    if (site.flags.resumePdf) expect(pub(site.resumeHref)).toBe(true);
    if (site.flags.headshot) expect(pub(site.headshotSrc)).toBe(true);
    if (site.flags.caseStudy) expect(existsSync(join(process.cwd(), "app/work/bitewise/page.tsx"))).toBe(true);
  });

  // A quick guard for content/site.ts; scripts/check-built-html.mjs is the real check, on
  // the built pages (text and readable attributes).
  it("has no bracketed placeholder text in the content", () => {
    expect(readFileSync(join(process.cwd(), "content/site.ts"), "utf8")).not.toMatch(/"\[[A-Z]/);
  });
});
