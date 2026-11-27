// Smoke checks for the landing page: it loads clean, links and anchors work, axe passes in
// both themes, Reduce Motion is respected, the theme choice survives a reload.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import * as site from "../content/site";

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
  // Exactly the planned destinations: the three apps, GitHub and LinkedIn.
  expect([...new Set(links.map((l) => l.href))].sort()).toEqual(
    [site.links.bitewise, site.links.ascend, site.links.orbit, site.links.github, site.links.linkedin].sort(),
  );
  for (const l of links) {
    expect(l.href, JSON.stringify(l)).toMatch(/^https:\/\//);
    expect(l.rel).toBe("noopener noreferrer");
    expect(l.label ?? "").toMatch(/opens in a new tab/);
  }
});

const APPS = [
  { name: "Bitewise", title: "#bw-title", slug: "bitewise", app: site.bitewise },
  { name: "Ascend", title: "#as-title", slug: "ascend", app: site.ascend },
  { name: "Orbit", title: "#or-title", slug: "orbit", app: site.orbit },
] as const;

test("the home page is the intro, the three apps and About: nothing points at a removed section", async ({ page }) => {
  await page.goto("/");
  expect(await page.$$eval("main > section", (ss) => ss.map((s) => s.id))).toEqual(["top", "work", "about"]);
  await expect(page.locator('a[href*="#how"], #how, [data-story-step], .story-stage')).toHaveCount(0);
  // Every same-page anchor lands on something.
  const hashes = await page.$$eval('a[href^="#"], a[href^="/#"]', (as) => as.map((a) => a.getAttribute("href")!.split("#")[1]));
  for (const id of hashes) await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Try Bitewise/ })).toHaveCount(0);
});

test("each hero phone is one image with its description, named by its caption; each tile has its still", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#top");
  for (const { name, title, app } of APPS) {
    await expect(hero.getByRole("img", { name: app.video.alt })).toHaveCount(1);
    await expect(hero.getByRole("figure", { name: `${name} · ${app.video.caption}` })).toHaveCount(1);
    await expect(hero.getByRole("button", { name: `Pause the ${name} video` })).toHaveCount(1);
    // The still: one picture per theme, the visible one only.
    await expect(page.locator(`article:has(${title})`).getByRole("img", { name: app.still.alt })).toHaveCount(1);
    await expect(page.locator(`article:has(${title}) video`)).toHaveCount(0);
  }
  await expect(page.locator("article:has(#bw-title)").getByRole("link", { name: "Read the case study" })).toHaveAttribute(
    "href",
    "/work/bitewise",
  );
});

test("every tile has one decision and the same links (Bitewise adds its case study)", async ({ page }) => {
  await page.goto("/");
  for (const { name, title } of APPS) {
    const article = page.locator(`article:has(${title})`);
    await expect(article.locator("h4")).toHaveCount(1);
    const names = await article.locator(".text-link").evaluateAll((ls) => ls.map((l) => l.textContent?.trim()));
    expect(names).toEqual([`Open ${name}`, "Demo video", ...(name === "Bitewise" ? ["Read the case study"] : [])]);
  }
  await expect(page.getByRole("link", { name: /Code on GitHub/ })).toHaveCount(0);
});

test("the three tiles are the same size, side by side at 1440, with their link rows level", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const firstLinks = await page.$$eval("#work article", (as) =>
    as.map((a) => a.querySelector(".text-link")!.getBoundingClientRect().toJSON() as DOMRect),
  );
  for (const l of firstLinks) {
    expect(Math.abs(l.top - firstLinks[0].top)).toBeLessThan(1);
    expect(l.height).toBeLessThan(60);
  }
  const boxes = await page.$$eval("#work article", (as) => as.map((a) => a.getBoundingClientRect().toJSON() as DOMRect));
  expect(boxes).toHaveLength(3);
  for (const b of boxes) {
    expect(Math.abs(b.width - boxes[0].width)).toBeLessThan(1);
    expect(Math.abs(b.height - boxes[0].height)).toBeLessThan(1);
    expect(Math.abs(b.top - boxes[0].top)).toBeLessThan(1);
  }
  await ctx.close();
});

for (const [label, opts] of [
  ["390", PHONE],
  ["1440", DESKTOP],
] as const) {
  test(`each tile's still is a full-size phone, and the tile's links stay inside it (${label})`, async ({ browser }) => {
    const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    for (const { title } of APPS) {
      const article = page.locator(`article:has(${title})`);
      const phone = await article.locator(".screen-crop .phone").boundingBox();
      expect(phone!.width, title).toBeGreaterThan(200);
      const tile = (await article.boundingBox())!;
      for (const box of await article.locator(".text-link").evaluateAll((ls) => ls.map((l) => l.getBoundingClientRect().toJSON() as DOMRect))) {
        expect(box.bottom, title).toBeLessThan(phone!.y);
        expect(box.bottom, title).toBeLessThan(tile.y + tile.height);
      }
    }
    await ctx.close();
  });
}

test("Reduce Motion: pressing play on a hero phone loads and plays its video", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  const video = page.locator("#top li").nth(2).locator("video");
  expect(await video.getAttribute("src")).toBeNull();
  await page.getByRole("button", { name: "Pause the Orbit video" }).click();
  await expect.poll(() => video.getAttribute("src")).toMatch(/orbit-loop-(dark|light)\.mp4$/);
  await ctx.close();
});

test("at 390 the page is exactly as wide as the phone (no sideways overflow)", async ({ browser }) => {
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => ({ inner: innerWidth, scroll: document.documentElement.scrollWidth }))).toEqual({ inner: 390, scroll: 390 });
  await page.getByRole("button", { name: "Demo video of Orbit" }).click();
  expect(await page.evaluate(() => innerWidth)).toBe(390);
  await ctx.close();
});

test("at 390, only the hero phone on screen loads its loop; swiping loads the next", async ({ browser }) => {
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const requested: string[] = [];
  page.on("request", (r) => {
    if (r.url().endsWith(".mp4")) requested.push(r.url().split("/").pop()!);
  });
  await page.goto("/", { waitUntil: "networkidle" });
  const srcs = () => page.$$eval("#top li video", (vs) => vs.map((v) => v.getAttribute("src")));
  await expect.poll(srcs).toEqual([expect.stringMatching(/bitewise-loop-(dark|light)\.mp4$/), null, null]);
  await page.locator("#top ul").evaluate((ul) => ul.scrollTo({ left: (ul.children[1] as HTMLElement).offsetLeft, behavior: "instant" }));
  await expect.poll(async () => (await srcs())[1]).toMatch(/ascend-loop-(dark|light)\.mp4$/);
  expect(requested.filter((f) => f.includes("demo"))).toEqual([]);
  await ctx.close();
});

test("at 1440, all three hero loops load and nothing else does", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  const requested = new Set<string>();
  page.on("request", (r) => {
    if (r.url().endsWith(".mp4")) requested.add(r.url().split("/").pop()!.replace(/-(dark|light)\.mp4$/, ""));
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect.poll(() => [...requested].sort()).toEqual(["ascend-loop", "bitewise-loop", "orbit-loop"]);
  await ctx.close();
});

test("Demo video: one button per tile; the dialog opens on top, Esc and the backdrop close it, focus comes back", async ({ browser }) => {
  for (const theme of ["dark", "light"] as const) {
    const ctx = await browser.newContext({ ...DESKTOP, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto("/");
    for (const { name, title, slug } of APPS) {
      const button = page.locator(`article:has(${title})`).getByRole("button", { name: `Demo video of ${name}` });
      await expect(button).toHaveCount(1);
      await expect(button).toHaveText("Demo video");
      const dialog = page.getByRole("dialog", { name: `${name} demo video` });
      await expect(dialog).toBeHidden();
      expect(await page.locator(`video[src*="${slug}-demo"]`).count()).toBe(0);

      await button.click();
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("video")).toHaveAttribute("src", new RegExp(`^/media/${slug}-demo-${theme}\\.mp4#t=[\\d.]+$`));
      await expect(dialog.getByRole("button", { name: "Close the video" })).toBeFocused();
      await expect(page.locator("html")).toHaveAttribute("data-dialog", "");
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
      await expect(dialog.locator("video")).toHaveCount(0);
      await expect(page.locator("html")).not.toHaveAttribute("data-dialog");

      // A click on the dimmed area outside the phone closes it too.
      await button.click();
      await expect(dialog).toBeVisible();
      // Past the 400 ms that guards against a double-click closing it.
      await page.waitForTimeout(450);
      await page.mouse.click(30, 450);
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
    }
    await ctx.close();
  }
});

test("Demo video: Tab stays inside the open dialog", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Demo video of Ascend" }).click();
  // A modal dialog lets Tab pass to the browser's own controls (activeElement is then body)
  // and back; nothing on the page behind it may take focus.
  const where: string[] = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    where.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return "browser";
        return a.closest("dialog[open]") ? "dialog" : `page: ${a.outerHTML.slice(0, 80)}`;
      }),
    );
  }
  expect(where.filter((w) => w.startsWith("page"))).toEqual([]);
  expect(where.filter((w) => w === "dialog").length).toBeGreaterThan(2);
});

test("the Demo video animates in only when motion is allowed", async ({ browser }) => {
  for (const [reducedMotion, expected] of [
    ["no-preference", true],
    ["reduce", false],
  ] as const) {
    const ctx = await browser.newContext({ ...DESKTOP, reducedMotion });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Demo video of Orbit" }).click();
    const animations = await page.evaluate(() => document.querySelector("dialog[open]")!.getAnimations({ subtree: true }).length);
    expect(animations > 0, reducedMotion).toBe(expected);
    await ctx.close();
  }
});

test("Demo video: a double-click leaves it open; a drag from the video ending outside doesn't close it", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Bitewise demo video" });
  await page.getByRole("button", { name: "Demo video of Bitewise" }).dblclick();
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(500);
  const video = (await dialog.locator("video").boundingBox())!;
  await page.mouse.move(video.x + video.width / 2, video.y + video.height - 20);
  await page.mouse.down();
  await page.mouse.move(20, 450, { steps: 5 });
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("Demo video: the page behind doesn't scroll or shift, and the lock lifts on every way out", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({ y: window.scrollY, w: document.documentElement.clientWidth }));
  const button = page.getByRole("button", { name: "Demo video of Orbit" });
  await button.click();
  const opened = await page.evaluate(() => ({ y: window.scrollY, w: document.documentElement.clientWidth }));
  await page.mouse.wheel(0, 800);
  await page.keyboard.press("PageDown");
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => ({ y: window.scrollY, w: document.documentElement.clientWidth }))).toEqual(opened);
  expect(opened.w).toBe(before.w);
  // Closed from the backdrop: the lock goes too.
  await page.waitForTimeout(450);
  await page.mouse.click(30, 450);
  await expect(page.getByRole("dialog", { name: "Orbit demo video" })).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-dialog");
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(opened.y);
  await ctx.close();
});

test("Reduce Motion at 390: pressing play on a phone not yet swiped to loads it", async ({ browser }) => {
  const ctx = await browser.newContext({ ...PHONE, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  const video = page.locator("#top li").nth(1).locator("video");
  expect(await video.getAttribute("src")).toBeNull();
  await page.getByRole("button", { name: "Pause the Ascend video" }).click();
  await expect.poll(() => video.getAttribute("src")).toMatch(/ascend-loop-(dark|light)\.mp4$/);
  await ctx.close();
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

test("the hero phones are tilted when motion is allowed", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  const tilts = await page.$$eval("#top .tilt", (ts) => ts.map((t) => getComputedStyle(t).transform));
  expect(tilts).toHaveLength(3);
  for (const t of tilts) expect(t).not.toBe("none");
  await ctx.close();
});

test("Reduce Motion: the phones are flat and no video plays or downloads", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const state = await page.evaluate(() => ({
    playing: [...document.querySelectorAll("video")].filter((v) => !v.paused).length,
    sources: [...document.querySelectorAll("video")].filter((v) => v.getAttribute("src")).length,
    tilts: [...document.querySelectorAll("#top .tilt")].map((t) => getComputedStyle(t).transform),
  }));
  expect(state.playing).toBe(0);
  expect(state.sources).toBe(0);
  expect(state.tilts).toEqual(["none", "none", "none"]);
  // The visitor can still choose to play it.
  await page.getByRole("button", { name: "Pause the Bitewise video" }).click();
  await expect.poll(() => page.evaluate(() => document.querySelector("#top li video")?.getAttribute("src"))).toMatch(/bitewise-loop/);
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

test("unknown pages get the 404 in the same world", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("That page doesn't exist.");
  await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
});

// Round 12: motion polish.
test("Demo video grows out of the tile's phone and shrinks back into it", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  await page.goto("/");
  const article = page.locator("article:has(#as-title)");
  await article.locator(".screen-crop").scrollIntoViewIfNeeded();
  // Let the tile's own scroll reveal (scale .97 → 1, 560 ms) finish first.
  await expect.poll(() => article.evaluate((a) => a.getAnimations({ subtree: true }).length + (a.getAttribute("data-reveal") === "hidden" ? 1 : 0))).toBe(0);
  await page.waitForTimeout(700);
  const tile = (await article.locator(".screen-crop .phone").boundingBox())!;
  // Lazy: wait until the tile's picture has loaded (without it the dialog simply has no still).
  const tileImg = article.locator(".screen-crop img:visible");
  await expect.poll(() => tileImg.evaluate((i: HTMLImageElement) => i.complete && i.currentSrc)).toBeTruthy();
  const tileSrc = await tileImg.evaluate((i: HTMLImageElement) => i.currentSrc);
  await article.getByRole("button", { name: "Demo video of Ascend" }).click();
  // Freeze the expand at its first frame: the dialog's phone sits exactly on the tile's.
  const start = await page.evaluate(() => {
    const phone = document.querySelector<HTMLElement>("dialog[open] .phone")!;
    for (const a of phone.getAnimations()) {
      a.pause();
      a.currentTime = 0;
    }
    const r = phone.getBoundingClientRect();
    // The tile's phone right now (hidden, but laid out; possibly lifted by the hover).
    const t = document.querySelector("article:has(#as-title) .screen-crop .phone")!.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, tile: { x: t.x, y: t.y, width: t.width }, still: document.querySelector<HTMLImageElement>("dialog[open] .demo-still")?.src ?? null };
  });
  expect(Math.abs(start.tile.width - tile.width)).toBeLessThan(1);
  expect(Math.abs(start.x - start.tile.x)).toBeLessThan(2);
  expect(Math.abs(start.y - start.tile.y)).toBeLessThan(3);
  expect(Math.abs(start.width - start.tile.width)).toBeLessThan(2);
  // It shows the tile's own (already loaded) picture while it moves.
  expect(start.still).toBe(tileSrc);
  // The tile's phone is "in" the dialog meanwhile.
  await expect(article.locator(".screen-crop .phone")).toBeHidden();
  await page.evaluate(() => document.querySelector<HTMLElement>("dialog[open] .phone")!.getAnimations().forEach((a) => a.finish()));

  // Close: it plays the shrink with the dialog still open, then closes and puts everything back.
  await page.waitForTimeout(450);
  await page.getByRole("button", { name: "Close the video" }).click();
  await expect(page.locator("dialog[data-closing]")).toHaveCount(1);
  await expect(page.getByRole("dialog", { name: "Ascend demo video" })).toBeHidden();
  await expect(article.locator(".screen-crop .phone")).toBeVisible();
  await expect(article.getByRole("button", { name: "Demo video of Ascend" })).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-dialog");
  await ctx.close();
});

for (const [label, keys] of [
  ["Esc twice, fast", ["Escape", "Escape"]],
  ["the close button, then Esc", ["Close", "Escape"]],
] as const) {
  test(`Demo video: ${label} closes cleanly`, async ({ browser }) => {
    const ctx = await browser.newContext(DESKTOP);
    const page = await ctx.newPage();
    await page.goto("/");
    const button = page.getByRole("button", { name: "Demo video of Orbit" });
    await button.click();
    await page.waitForTimeout(300);
    const [first, second] = keys;
    if (first === "Close") await page.getByRole("button", { name: "Close the video" }).click();
    else await page.keyboard.press(first);
    // Hold the shrink where it is, so only the second key can close it.
    await expect(page.locator("dialog[data-closing]")).toHaveCount(1);
    await page.evaluate(() => document.querySelector("dialog[open] .phone")!.getAnimations().forEach((a) => a.pause()));
    await page.keyboard.press(second);
    await expect(page.getByRole("dialog", { name: "Orbit demo video" })).toBeHidden();
    await expect(page.locator("[data-away]")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveAttribute("data-dialog");
    await expect(button).toBeFocused();
    // The page scrolls again.
    const y = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y);
    // And it opens again.
    await button.click();
    await expect(page.getByRole("dialog", { name: "Orbit demo video" })).toBeVisible();
    await ctx.close();
  });
}

test("Esc during the expand closes cleanly and never downloads the tour", async ({ browser }) => {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  const requested: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("-demo-")) requested.push(r.url());
  });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Demo video of Bitewise" });
  await button.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Bitewise demo video" })).toBeHidden();
  await page.waitForTimeout(500);
  expect(requested).toEqual([]);
  await expect(page.locator("[data-away]")).toHaveCount(0);
  // No inline styles left on its phone (the close kept the mid-expand position in them).
  expect(await page.locator("dialog:has(#demo-bitewise-title) .phone").evaluate((p: HTMLElement) => p.style.cssText)).toBe("");
  await ctx.close();
});

test("at 390 in dark, the expand starts on the tile's phone with the dark picture; the poster takes over", async ({ browser }) => {
  const ctx = await browser.newContext({ ...PHONE, colorScheme: "dark" });
  await ctx.addInitScript(() => localStorage.setItem("theme", "dark"));
  const page = await ctx.newPage();
  await page.goto("/");
  const article = page.locator("article:has(#or-title)");
  await article.locator(".screen-crop").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const tileImg = article.locator(".screen-crop img:visible");
  await expect.poll(() => tileImg.evaluate((i: HTMLImageElement) => i.complete && i.currentSrc)).toBeTruthy();
  await article.getByRole("button", { name: "Demo video of Orbit" }).click();
  const start = await page.evaluate(() => {
    const phone = document.querySelector<HTMLElement>("dialog[open] .phone")!;
    for (const a of phone.getAnimations()) {
      a.pause();
      a.currentTime = 0;
    }
    const r = phone.getBoundingClientRect();
    const t = document.querySelector("article:has(#or-title) .screen-crop .phone")!.getBoundingClientRect();
    return { dx: r.x - t.x, dy: r.y - t.y, dw: r.width - t.width, still: document.querySelector<HTMLImageElement>("dialog[open] .demo-still")!.src };
  });
  expect(Math.abs(start.dx)).toBeLessThan(2);
  expect(Math.abs(start.dy)).toBeLessThan(3);
  expect(Math.abs(start.dw)).toBeLessThan(2);
  expect(decodeURIComponent(start.still)).toContain("orbit-person-dark");
  // Once it lands, the video is mounted with the same picture as its poster, and the still steps aside.
  await page.evaluate(() => document.querySelector<HTMLElement>("dialog[open] .phone")!.getAnimations().forEach((a) => a.finish()));
  const video = page.locator("dialog[open] video");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.poster)).toBe(start.still);
  await expect(page.locator("dialog[open] .demo-still")).toHaveAttribute("data-shown", "false");
  await ctx.close();
});

test("Reduce Motion: the Demo video opens in place, the tile's phone stays put", async ({ browser }) => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Demo video of Bitewise" }).click();
  await expect(page.locator("[data-away]")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Bitewise demo video" })).toBeHidden();
  await ctx.close();
});

test("the page behind an open Demo video dims and blurs", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Demo video of Ascend" }).click();
  const backdrop = await page.evaluate(() => getComputedStyle(document.querySelector("dialog[open]")!, "::backdrop").backdropFilter);
  expect(backdrop).toContain("blur(6px)");
});

test("the headline wipes in once on load, with no mask left afterwards; not under Reduce Motion", async ({ browser }) => {
  for (const [reducedMotion, name] of [
    ["no-preference", "headline-wipe"],
    ["reduce", "none"],
  ] as const) {
    const ctx = await browser.newContext({ ...DESKTOP, reducedMotion });
    const page = await ctx.newPage();
    // Freeze the wipe at its start to read the mask it applies.
    await page.addInitScript(() =>
      document.addEventListener("animationstart", (e) => {
        if (e.animationName !== "headline-wipe") return;
        const a = (e.target as Element).getAnimations()[0];
        a.pause();
        a.currentTime = 0;
        (window as unknown as { __mask?: string }).__mask = getComputedStyle(e.target as Element).maskImage;
        a.play();
      }),
    );
    await page.goto("/");
    const h1 = page.locator("h1");
    expect(await h1.evaluate((e) => getComputedStyle(e).animationName)).toBe(name);
    if (name === "headline-wipe") {
      await expect.poll(() => page.evaluate(() => (window as unknown as { __mask?: string }).__mask)).toContain("linear-gradient");
    }
    await page.waitForTimeout(600);
    expect(await h1.evaluate((e) => getComputedStyle(e).maskImage)).toBe("none");
    await ctx.close();
  }
});

test("icon swaps blur-crossfade (theme toggle, pause/play); instant under Reduce Motion", async ({ browser }) => {
  for (const [reducedMotion, duration] of [
    ["no-preference", "0.16s"],
    ["reduce", "0s"],
  ] as const) {
    const ctx = await browser.newContext({ ...DESKTOP, colorScheme: "dark", reducedMotion });
    const page = await ctx.newPage();
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Dark theme" });
    const moon = toggle.locator(".icon-when-dark");
    expect(await moon.evaluate((e) => getComputedStyle(e).transitionDuration.split(",")[0].trim())).toBe(duration);
    await toggle.click();
    await expect.poll(() => moon.evaluate((e) => getComputedStyle(e).opacity)).toBe("0");
    expect(await moon.evaluate((e) => getComputedStyle(e).filter)).toBe("blur(4px)");
    // Both pause-button icons share one cell; only one shows.
    const shown = await page.getByRole("button", { name: "Pause the Bitewise video" }).locator("svg").evaluateAll((s) =>
      s.map((e) => e.getAttribute("data-shown")),
    );
    expect(shown.sort()).toEqual(["false", "true"]);
    await ctx.close();
  }
});
