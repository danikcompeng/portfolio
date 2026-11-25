// The site's own rules: never invent numbers, no phone number, never claim a project was
// built for a specific company,
// every link https (plans/portfolio.md section 9).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { describe, expect, it } from "vitest";
import * as site from "./site";
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

  it("never claims a project was built for a specific company", () => {
    for (const f of files) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/\b(built|made|designed) for (?![a-z])/);
    }
  });

  it("links only over https (or mailto / same-site)", () => {
    for (const [name, href] of Object.entries(site.links)) {
      if (name === "email") continue;
      expect(href, name).toMatch(/^https:\/\//);
    }
  });

  it("gives every number a source, a date and a floor no higher than the count", () => {
    const all = stats();
    expect(all.length).toBeGreaterThan(10);
    for (const [path, s] of all) {
      expect(s.floor, path).toBeLessThanOrEqual(s.exact);
      expect(s.source.length, `${path} source`).toBeGreaterThan(10);
      expect(s.asOf, `${path} date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("formats a floor as N+", () => {
    expect(site.fmt({ floor: 900, exact: 917, asOf: "2026-11-24", source: "x".repeat(11) })).toBe("900+");
  });

  it("links nothing that doesn't exist yet", () => {
    if (site.flags.resumePdf) expect(existsSync(join(process.cwd(), "public", site.resumeHref))).toBe(true);
    if (site.flags.caseStudy) expect(existsSync(join(process.cwd(), "app/work/bitewise/page.tsx"))).toBe(true);
  });
});
