// Video behaviour in branded Chrome, which decodes H.264 (bundled Chromium may not, so a
// "nothing plays" check there could pass for the wrong reason: code-reviewer, review 1).
// Needs Google Chrome installed (it is on this machine; CI would need `npx playwright install chrome`).
import { expect, test, type Page } from "@playwright/test";

test.use({ channel: "chrome", viewport: { width: 1440, height: 900 } });

const stage = ".story-stage video";

async function playing(page: Page, sel: string) {
  return page.evaluate((s) => {
    const v = document.querySelector<HTMLVideoElement>(s);
    return Boolean(v && !v.paused && v.readyState >= 2);
  }, sel);
}

async function scrollToStep(page: Page, i: number) {
  await page.evaluate((i) => {
    const step = document.querySelectorAll<HTMLElement>("[data-story-step]")[i];
    const top = step.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - window.innerHeight / 2 + 40, behavior: "instant" });
  }, i);
}

test("the hero plays from the poster frame, stops under a still and resumes above step 1", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  expect(await page.evaluate((s) => document.querySelector<HTMLVideoElement>(s)!.currentTime, stage)).toBeGreaterThan(4);

  await scrollToStep(page, 0);
  // The video's layer gives way to step 1's still.
  await expect(page.locator(".story-stage .layer:has(video)")).toHaveAttribute("data-active", "false");
  await expect(page.locator(".story-stage .layer[data-active=true] img:visible")).toHaveCount(1);
  await expect.poll(() => playing(page, stage)).toBe(false);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => playing(page, stage)).toBe(true);
});

test("the pause button pauses, and a manual pause survives scrolling away and back", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  const button = page.locator(".story-stage").getByRole("button", { name: "Pause the Bitewise video" });
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => playing(page, stage)).toBe(false);

  await scrollToStep(page, 1);
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(600);
  expect(await playing(page, stage)).toBe(false);

  await button.click();
  await expect.poll(() => playing(page, stage)).toBe(true);
});

test("a theme switch swaps the file and keeps the position", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  await page.waitForTimeout(2500);
  const before = await page.evaluate((s) => {
    const v = document.querySelector<HTMLVideoElement>(s)!;
    return { src: v.getAttribute("src"), t: v.currentTime };
  }, stage);
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect.poll(() => page.evaluate((s) => document.querySelector(s)!.getAttribute("src"), stage)).not.toBe(before.src);
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  const after = await page.evaluate((s) => document.querySelector<HTMLVideoElement>(s)!.currentTime, stage);
  expect(Math.abs(after - before.t)).toBeLessThan(2.5);
});

test("turning on Reduce Motion mid-visit stops and releases the video", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => playing(page, stage)).toBe(false);
  await expect.poll(() => page.evaluate((s) => document.querySelector(s)!.getAttribute("src"), stage)).toBeNull();
});

test("crossing into the stacked layout stops the pinned copy and starts the inline one", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  await page.setViewportSize({ width: 800, height: 900 });
  await expect.poll(() => playing(page, stage)).toBe(false);
  await expect.poll(() => playing(page, ".story-inline-phone video"), { timeout: 15_000 }).toBe(true);
});

test("at the end, the hero loops back past the login screen, not to 0", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => playing(page, stage), { timeout: 15_000 }).toBe(true);
  await page.evaluate((s) => {
    const v = document.querySelector<HTMLVideoElement>(s)!;
    v.currentTime = v.duration - 0.3;
  }, stage);
  await page.waitForTimeout(1200);
  const t = await page.evaluate((s) => document.querySelector<HTMLVideoElement>(s)!.currentTime, stage);
  expect(t).toBeGreaterThan(4.5);
  expect(t).toBeLessThan(8);
  expect(await playing(page, stage)).toBe(true);
});
