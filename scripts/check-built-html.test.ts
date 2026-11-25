import { describe, expect, it } from "vitest";
import { placeholderProblems, visibleText } from "./check-built-html.mjs";

describe("check-built-html", () => {
  it("ignores the brackets in framework scripts and styles", () => {
    expect(placeholderProblems('<script>self.__next_f.push([1,"a"])</script><style>a[x]{}</style><p>Hi</p>')).toEqual([]);
  });
  it("catches a bracket in visible text, including inside noscript", () => {
    expect(placeholderProblems("<p>[PHOTO: headshot]</p>")).toHaveLength(1);
    expect(placeholderProblems("<noscript><p>[X]</p></noscript>")).toHaveLength(1);
  });
  it("catches an entity-encoded bracket", () => {
    expect(visibleText("<p>&#91;X]</p>")).toContain("[");
    expect(placeholderProblems("<p>&#x5B;X]</p>")).toHaveLength(1);
  });
  it("catches a bracket in alt, aria-label, title or meta content", () => {
    expect(placeholderProblems('<img alt="[PHOTO: headshot]">')).toHaveLength(1);
    expect(placeholderProblems('<a aria-label="[Resume]" href="#">x</a>')).toHaveLength(1);
    expect(placeholderProblems('<span title="[soon]">x</span>')).toHaveLength(1);
    expect(placeholderProblems('<meta property="og:description" content="[ONE-LINER]">')).toHaveLength(1);
  });
  it("passes clean HTML", () => {
    expect(placeholderProblems('<meta name="description" content="Hi"><img alt="Dani"><p>Work</p>')).toEqual([]);
  });
});
