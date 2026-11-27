// Screenshots for the design-critic: 390 x 844 @3 and 1440 x 900 @2, light and dark.
// Per size and theme: the first viewport, each section, the open Demo video and a full page
// at 1x for the overview. Output:
// docs/screenshots/<SHOTS_ROUND or "latest">/<width>-<theme>-<name>.png
//
// Bundled Chromium can't decode H.264, so videos show their poster frame: deterministic.

import { test, type Page } from "@playwright/test";

const ROUND = process.env.SHOTS_ROUND ?? "latest";
const OUT = `docs/screenshots/${ROUND}`;

const sizes = [
  { name: "390", width: 390, height: 844, scale: 3 },
  { name: "1440", width: 1440, height: 900, scale: 2 },
] as const;
const themes = ["dark", "light"] as const;

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Scroll the whole page once so below-the-fold reveals have played, then return.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(800);
}

for (const size of sizes) {
  for (const theme of themes) {
    test(`screens ${size.name} ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        deviceScaleFactor: size.scale,
        colorScheme: theme,
      });
      await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const page = await context.newPage();
      await page.goto("/", { waitUntil: "networkidle" });
      await settle(page);
      const file = (name: string) => `${OUT}/${size.name}-${theme}-${name}.png`;

      await page.screenshot({ path: file("01-first-viewport") });

      // Sections without the sticky nav laid over their top edge.
      await page.addStyleTag({ content: ".nav{visibility:hidden}" });
      for (const [i, id] of ["work", "about"].entries()) {
        await page.locator(`#${id}`).screenshot({ path: file(`0${i + 2}-${id}`) });
      }

      // The Demo video dialog, open on Orbit's tour (its first frame, or the poster-less phone).
      await page.getByRole("button", { name: "Demo video of Orbit" }).click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: file("04-demo-video") });
      await page.keyboard.press("Escape");

      // Full page at 1x: the overview.
      const full = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await full.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const fp = await full.newPage();
      await fp.goto("/", { waitUntil: "networkidle" });
      await settle(fp); // loads the lazy images too
      await fp.screenshot({ path: file("00-full-page"), fullPage: true });
      await full.close();
      await context.close();
    });
  }
}

// The case study: the first viewport and the whole page, per size and theme.
for (const size of sizes) {
  for (const theme of themes) {
    test(`screens case study ${size.name} ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        deviceScaleFactor: size.scale,
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const page = await context.newPage();
      await page.goto("/work/bitewise", { waitUntil: "networkidle" });
      await settle(page);
      const file = (name: string) => `${OUT}/${size.name}-${theme}-case-${name}.png`;
      await page.screenshot({ path: file("01-first-viewport") });
      await page.screenshot({ path: file("00-full-page"), fullPage: true });
      await context.close();
    });
  }
}
