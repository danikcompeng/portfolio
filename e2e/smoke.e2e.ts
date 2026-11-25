// Smoke checks for the landing page: it loads clean, links and anchors work, axe passes in
// both themes, Reduce Motion is respected, the theme choice survives a reload.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1440, height: 900 } };

test("loads with one h1 and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("From idea to live app, end to end.");
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test("external links open in a new tab safely, and none point anywhere unplanned", async ({ page }) => {
  await page.goto("/");
  const links = await page.$$eval("a[target=_blank]", (as) =>
    as.map((a) => ({ href: a.getAttribute("href"), rel: a.getAttribute("rel"), label: a.getAttribute("aria-label") })),
  );
  expect(links.length).toBeGreaterThan(5);
  for (const l of links) {
    expect(l.href, JSON.stringify(l)).toMatch(/^https:\/\//);
    expect(l.rel).toBe("noopener noreferrer");
    expect(l.label ?? "").toMatch(/opens in a new tab/);
  }
});

test("nothing unsupplied shows: no resume link, no [placeholder] text", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
  const text = await page.locator("body").innerText();
  expect(text).not.toContain("[");
});

// The Bitewise case study (/work/bitewise).
const CASE = "/work/bitewise";

test("case study: the Bitewise tile opens it, and Back to the work returns to the tile", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.getByRole("link", { name: "Read the case study" }).click();
  await expect(page).toHaveURL(new RegExp(`${CASE}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bitewise: cheap meals that hit your macros");
  await page.getByRole("link", { name: "Back to the work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { level: 2, name: "Work", exact: true })).toBeInViewport();
  // The keyboard carries on from the Work section, not from the top of the page.
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("#work"))).toBe(true);
  await ctx.close();
});

test("home footer: Work moves the keyboard's starting point to the Work section", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Work", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Work", exact: true })).toBeInViewport();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("#work"))).toBe(true);
  await ctx.close();
});

test("case study: loads clean, with its own title, a link preview and no placeholders", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  const res = await page.goto(CASE);
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page).toHaveTitle("Bitewise case study · Dani Kainikkara");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Bitewise case study · Dani Kainikkara");
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /\/work\/bitewise\/opengraph-image/);
  const image = await page.request.get(new URL((await og.getAttribute("content"))!, page.url()).pathname);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/png");
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(6);
  expect(await page.locator("body").innerText()).not.toContain("[");
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test("case study: outside links open in a new tab safely, including the two commit links", async ({ page }) => {
  await page.goto(CASE);
  const links = await page.$$eval("a[target=_blank]", (as) =>
    as.map((a) => ({ href: a.getAttribute("href"), rel: a.getAttribute("rel"), label: a.getAttribute("aria-label") })),
  );
  for (const l of links) {
    expect(l.href, JSON.stringify(l)).toMatch(/^https:\/\//);
    expect(l.rel).toBe("noopener noreferrer");
    expect(l.label ?? "").toMatch(/opens in a new tab/);
  }
  // Exactly the planned destinations, nothing missing and nothing else.
  expect([...new Set(links.map((l) => l.href))].sort()).toEqual(
    [
      "https://trybitewise.vercel.app",
      "https://github.com/danikcompeng/meal-cost-tracker",
      "https://github.com/danikcompeng/meal-cost-tracker/blob/main/design/videos/bitewise-demo-light-real-scan.mp4",
      "https://github.com/danikcompeng/meal-cost-tracker/commit/599293a",
      "https://github.com/danikcompeng/meal-cost-tracker/commit/8ca92ae",
    ].sort(),
  );
});

test("case study: Back to top stays on the page", async ({ page }) => {
  await page.goto(CASE);
  await page.getByRole("contentinfo").getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(new RegExp(`${CASE}#top$`));
  await expect(page.locator("h1")).toBeInViewport();
});

for (const [name, opts] of [
  ["desktop", DESKTOP],
  ["phone", PHONE],
] as const) {
  test(`nav anchors land on their sections (${name})`, async ({ browser }) => {
    const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    for (const [label, id] of [
      ["Work", "work"],
      ["About", "about"],
    ]) {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label, exact: true }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    await ctx.close();
  });

  for (const [theme, path] of [
    ["dark", "/"],
    ["light", "/"],
    ["dark", "/work/bitewise"],
    ["light", "/work/bitewise"],
  ] as const) {
    test(`axe: no serious or critical issues (${path}, ${name}, ${theme})`, async ({ browser }) => {
      const ctx = await browser.newContext({ ...opts, colorScheme: theme, reducedMotion: "reduce" });
      await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const page = await ctx.newPage();
      await page.goto(path, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
      await ctx.close();
    });
  }
}

test("the hero phone is tilted at the top of the page when motion is allowed", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  const tilt = await page.evaluate(() => getComputedStyle(document.querySelector(".story-stage .tilt")!).transform);
  expect(tilt).not.toBe("none");
  await ctx.close();
});

test("Reduce Motion: the phone is flat and no video plays or downloads", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const state = await page.evaluate(() => ({
    playing: [...document.querySelectorAll("video")].filter((v) => !v.paused).length,
    sources: [...document.querySelectorAll("video")].filter((v) => v.getAttribute("src")).length,
    tilt: getComputedStyle(document.querySelector(".story-stage .tilt")!).transform,
  }));
  expect(state.playing).toBe(0);
  expect(state.sources).toBe(0);
  expect(state.tilt).toBe("none");
  // The visitor can still choose to play it.
  await page.getByRole("button", { name: "Pause the Bitewise video" }).first().click();
  await expect.poll(() => page.evaluate(() => document.querySelector(".story-stage video")?.getAttribute("src"))).toMatch(/bitewise-loop/);
  await ctx.close();
});

test("Hero video plays only in the layout on screen", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  const srcs = await page.evaluate(() => ({
    pinned: document.querySelector(".story-stage video")?.getAttribute("src") ?? null,
    inline: document.querySelector(".story-inline-phone video")?.getAttribute("src") ?? null,
  }));
  expect(srcs.pinned).toMatch(/bitewise-loop-(dark|light)\.mp4/);
  expect(srcs.inline).toBeNull();
  await ctx.close();
});

test("the theme toggle is remembered and applied before paint", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const toggle = page.getByRole("button", { name: "Dark theme" });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  // On reload the head script sets it before the page's own JS runs.
  await page.reload({ waitUntil: "commit" });
  await page.waitForFunction(() => document.body !== null);
  expect(await page.evaluate(() => document.documentElement.getAttribute("data-theme"))).toBe("light");
  await ctx.close();
});

for (const width of [1024, 1200, 1440]) {
  test(`How I build: agent names stay on one line at ${width} px`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const lines = await page.$$eval("#how h3.font-mono", (hs) =>
      hs.map((h) => ({ name: h.textContent, lines: h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight) })),
    );
    expect(lines.length).toBe(3);
    for (const l of lines) expect(l.lines, l.name ?? "").toBeLessThan(1.5);
    await ctx.close();
  });
}

test("unknown pages get the 404 in the same world", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("That page doesn't exist.");
  await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
});
