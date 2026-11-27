// Every text colour on every surface it sits on, in both themes, read from app/globals.css.
import { describe, expect, it } from "vitest";
import { contrast } from "./contrast";
import { readTokens } from "./css-tokens";

const tokens = readTokens();
const themes = ["light", "dark"] as const;

const surfaces = ["bg", "bg-raised", "bg-sunk", "bw-field", "as-field", "or-field"];

// [text, surface, minimum]
const pairs: [string, string, number][] = [
  ...surfaces.flatMap((s): [string, string, number][] => [
    ["ink", s, 4.5],
    ["ink-muted", s, 4.5],
  ]),
  // Product links on their own tiles.
  ["bw-accent", "bw-field", 4.5],
  ["as-accent", "as-field", 4.5],
  ["or-accent", "or-field", 4.5],
  // Primary button: page colour on ink.
  ["bg", "ink", 4.5],
];

describe("palette contrast", () => {
  it("finds the tokens it checks", () => {
    for (const name of [...surfaces, "ink", "ink-muted", "bw-accent", "as-accent", "or-accent"]) {
      expect(tokens[name], name).toBeDefined();
    }
  });

  for (const theme of themes) {
    for (const [fg, bg, min] of pairs) {
      it(`${theme}: ${fg} on ${bg} ≥ ${min}:1`, () => {
        const ratio = contrast(tokens[fg][theme], tokens[bg][theme]);
        expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
      });
    }
  }
});

describe("contrast maths", () => {
  it("black on white is 21:1", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });
  it("matches a known pair (#767676 on white ≈ 4.54:1)", () => {
    expect(contrast("#767676", "#ffffff")).toBeCloseTo(4.54, 1);
  });
  it("reads oklch white and black", () => {
    expect(contrast("oklch(0 0 0)", "oklch(1 0 0)")).toBeCloseTo(21, 0);
  });
  it("composites alpha over the background", () => {
    expect(contrast("oklch(0 0 0 / 0)", "#ffffff")).toBeCloseTo(1, 5);
  });
});
