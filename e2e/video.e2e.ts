// Video behaviour in branded Chrome, which decodes H.264 (bundled Chromium may not, so a
// "nothing plays" check there could pass for the wrong reason: code-reviewer, review 1).
// Needs Google Chrome installed (it is on this machine; CI would need `npx playwright install chrome`).
import { expect, test, type Page } from "@playwright/test";

test.use({ channel: "chrome", viewport: { width: 1440, height: 900 } });

async function playing(page: Page, sel: string) {
  return page.evaluate((s) => {
    const v = document.querySelector<HTMLVideoElement>(s);
    return Boolean(v && !v.paused && v.readyState >= 2);
  }, sel);
}

const time = (page: Page, sel: string) => page.evaluate((s) => document.querySelector<HTMLVideoElement>(s)!.currentTime, sel);

// The hero's three loops (round 10): from the poster frame, pausable, looping past any login.
const HERO = [
  { name: "Bitewise", n: 1, start: 4.6, loopFrom: 4.6 },
  { name: "Ascend", n: 2, start: 1, loopFrom: 0 },
  { name: "Orbit", n: 3, start: 10, loopFrom: 0 },
];

for (const { name, n, start, loopFrom } of HERO) {
  const sel = `#top li:nth-child(${n}) video`;

  test(`${name}: the hero loop plays from its poster frame, pauses, and loops back to its start`, async ({ page }) => {
    // Record where the first playback starts, whenever it happens: a slow machine could
    // otherwise see Orbit (4 s from 10 s) already wrapped to 0 (code-reviewer, round 9).
    await page.addInitScript((s) => {
      document.addEventListener(
        "playing",
        (e) => {
          const w = window as unknown as { __t0?: number };
          if ((e.target as Element).matches(s)) w.__t0 ??= (e.target as HTMLVideoElement).currentTime;
        },
        true,
      );
    }, sel);
    await page.goto("/");
    await expect.poll(() => playing(page, sel), { timeout: 15_000 }).toBe(true);
    const t0 = await page.evaluate(() => (window as unknown as { __t0?: number }).__t0 ?? -1);
    expect(t0).toBeGreaterThanOrEqual(start - 0.1);

    const button = page.getByRole("button", { name: `Pause the ${name} video` });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => playing(page, sel)).toBe(false);
    // A manual pause survives scrolling away and back.
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(600);
    expect(await playing(page, sel)).toBe(false);
    await button.click();
    await expect.poll(() => playing(page, sel)).toBe(true);

    // No native loop: it wraps to its loop point (never the demo's login at 0 for Bitewise).
    await page.evaluate((s) => {
      const v = document.querySelector<HTMLVideoElement>(s)!;
      v.currentTime = v.duration - 0.3;
    }, sel);
    await expect.poll(async () => { const t = await time(page, sel); return t >= loopFrom - 0.1 && t < loopFrom + 3; }, { timeout: 10_000 }).toBe(true);
    // Right after the wrap it may still be seeking (readyState < 2) on a busy machine.
    await expect.poll(() => playing(page, sel)).toBe(true);
  });
}

test("the hero loops stop when scrolled out of view", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, "#top li:nth-child(3) video"), { timeout: 15_000 }).toBe(true);
  await page.locator("#about").scrollIntoViewIfNeeded();
  for (const n of [1, 2, 3]) await expect.poll(() => playing(page, `#top li:nth-child(${n}) video`)).toBe(false);
});

test("a theme switch swaps the file and keeps the position", async ({ page }) => {
  const sel = "#top li:nth-child(1) video";
  await page.goto("/");
  await expect.poll(() => playing(page, sel), { timeout: 15_000 }).toBe(true);
  await page.waitForTimeout(2500);
  const before = await page.evaluate((s) => {
    const v = document.querySelector<HTMLVideoElement>(s)!;
    return { src: v.getAttribute("src"), t: v.currentTime };
  }, sel);
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect.poll(() => page.evaluate((s) => document.querySelector(s)!.getAttribute("src"), sel)).not.toBe(before.src);
  await expect.poll(() => playing(page, sel), { timeout: 15_000 }).toBe(true);
  expect(Math.abs((await time(page, sel)) - before.t)).toBeLessThan(2.5);
});

test("turning on Reduce Motion mid-visit stops and releases the hero loops", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, "#top li:nth-child(1) video"), { timeout: 15_000 }).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const n of [1, 2, 3]) {
    const sel = `#top li:nth-child(${n}) video`;
    await expect.poll(() => playing(page, sel)).toBe(false);
    await expect.poll(() => page.evaluate((s) => document.querySelector(s)!.getAttribute("src"), sel)).toBeNull();
  }
});

test("the hero loops pause behind an open Demo video and play again after it closes", async ({ page }) => {
  await page.goto("/");
  const loops = () => Promise.all([1, 2, 3].map((n) => playing(page, `#top li:nth-child(${n}) video`)));
  await expect.poll(loops, { timeout: 15_000 }).toEqual([true, true, true]);
  // Opened without scrolling, so the loops stay on screen: only the dialog can pause them.
  await page.getByRole("button", { name: "Demo video of Ascend" }).evaluate((b: HTMLElement) => b.click());
  await expect(page.getByRole("dialog", { name: "Ascend demo video" })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect.poll(loops).toEqual([false, false, false]);
  await page.keyboard.press("Escape");
  await expect.poll(loops).toEqual([true, true, true]);
});

// Demo video (round 10): each tile's tour opens in a dialog, plays there, and closes.
for (const { name, slug, title } of [
  { name: "Bitewise", slug: "bitewise", title: "#bw-title" },
  { name: "Ascend", slug: "ascend", title: "#as-title" },
  { name: "Orbit", slug: "orbit", title: "#or-title" },
]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${name}: Demo video opens, plays its ${theme} tour muted with controls, and closes`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
      const page = await ctx.newPage();
      const requested: string[] = [];
      page.on("request", (r) => {
        if (r.url().includes("-demo-")) requested.push(r.url().split("/").pop()!);
      });
      await page.goto("/", { waitUntil: "networkidle" });
      expect(requested).toEqual([]);

      const button = page.locator(`article:has(${title})`).getByRole("button", { name: `Demo video of ${name}` });
      await button.click();
      const dialog = page.getByRole("dialog", { name: `${name} demo video` });
      await expect(dialog).toBeVisible();
      const sel = "dialog[open] video";
      await expect.poll(() => playing(page, sel), { timeout: 15_000 }).toBe(true);
      const v = await page.evaluate((s) => {
        const el = document.querySelector<HTMLVideoElement>(s)!;
        return { src: el.getAttribute("src"), muted: el.muted, controls: el.controls };
      }, sel);
      expect(v).toEqual({ src: `/media/${slug}-demo-${theme}.mp4`, muted: true, controls: true });
      expect([...new Set(requested)]).toEqual([`${slug}-demo-${theme}.mp4`]);

      await dialog.getByRole("button", { name: "Close the video" }).click();
      await expect(dialog).toBeHidden();
      await expect(page.locator("dialog video")).toHaveCount(0);
      await expect(button).toBeFocused();
      await ctx.close();
    });
  }
}
