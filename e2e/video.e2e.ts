// Video behaviour in branded Chrome, which decodes H.264 (bundled Chromium may not, so a
// "nothing plays" check there could pass for the wrong reason: code-reviewer, review 1).
// Needs Google Chrome installed (it is on this machine; CI would need `npx playwright install chrome`).
import AxeBuilder from "@axe-core/playwright";
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
  { name: "Bitewise", n: 1, start: 3.2, loopFrom: 3.2 },
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
    // The wrap's own seek is recorded, so a wrap that lands later (say, in Bitewise's swap
    // shot, 1.8 s after its loop point) fails (code-reviewer, round 14).
    await page.evaluate((s) => {
      const v = document.querySelector<HTMLVideoElement>(s)!;
      const w = window as unknown as { __seeks: number[] };
      w.__seeks = [];
      v.currentTime = v.duration - 0.3;
      v.addEventListener("seeked", () => w.__seeks.push(v.currentTime));
    }, sel);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __seeks: number[] }).__seeks), { timeout: 10_000 })
      .toContainEqual(expect.closeTo(loopFrom, 1));
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

test("at 1440 the side loops load only after Bitewise's has started, with no layout shift", async ({ page }) => {
  const events: string[] = [];
  await page.exposeFunction("__log", (e: string) => events.push(e));
  await page.addInitScript(() => {
    const log = (window as unknown as { __log: (e: string) => void }).__log;
    document.addEventListener("playing", (e) => {
      const src = (e.target as HTMLVideoElement).getAttribute("src") ?? "";
      if (src.includes("bitewise-loop")) log("bitewise playing");
    }, true);
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number })[]) if (e.value > 0) log(`shift ${e.value}`);
    }).observe({ type: "layout-shift", buffered: true });
  });
  page.on("request", (r) => {
    const m = r.url().match(/\/(ascend|orbit|bitewise)-loop-/);
    if (m) events.push(`request ${m[1]}`);
  });
  await page.goto("/");
  await expect.poll(() => Promise.all([1, 2, 3].map((n) => playing(page, `#top li:nth-child(${n}) video`))), { timeout: 20_000 }).toEqual([true, true, true]);
  const first = (e: string) => events.indexOf(e);
  expect(first("request bitewise")).toBeGreaterThanOrEqual(0);
  expect(first("request ascend")).toBeGreaterThan(first("bitewise playing"));
  expect(first("request orbit")).toBeGreaterThan(first("bitewise playing"));
  expect(events.filter((e) => e.startsWith("shift"))).toEqual([]);
});

// Each loop's poster is the very frame playback starts on, so nothing jumps when the video
// takes over (round 13: re-made whenever a recording changes).
test("every hero poster matches its loop's start frame", async ({ page }) => {
  await page.goto("/");
  // `control`: a frame the bar must reject. Bitewise's Today holds still from 3.0 to 5.0 s, so
  // any frame there would pass (and wouldn't jump either); one early in the rings' fill must
  // not (measured 1.7 to 2.2; code-reviewer, round 14).
  for (const [file, poster, t, control] of [
    ["bitewise-loop", "bitewise-loop-poster", 3.2, 1.8],
    ["ascend-loop", "ascend-loop-poster", 1, null],
    ["orbit-loop", "orbit-loop-poster", 10, null],
  ] as const) {
    for (const theme of ["light", "dark"]) {
      const diffAt = (t: number) => page.evaluate(
        async ([src, img, t]) => {
          const once = (el: EventTarget, ev: string) => new Promise((r) => el.addEventListener(ev, r, { once: true }));
          const v = document.createElement("video");
          v.muted = true;
          v.src = src;
          await once(v, "loadedmetadata");
          v.currentTime = t;
          await once(v, "seeked");
          const im = new Image();
          im.src = img;
          await im.decode();
          const px = (s: CanvasImageSource) => {
            const c = document.createElement("canvas");
            c.width = 393;
            c.height = 852;
            const x = c.getContext("2d")!;
            x.drawImage(s, 0, 0, 393, 852);
            return x.getImageData(0, 0, 393, 852).data;
          };
          const a = px(v);
          const b = px(im);
          let sum = 0;
          for (let i = 0; i < a.length; i += 4) sum += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
          return sum / (a.length / 4) / 3;
        },
        [`/media/${file}-${theme}.mp4`, `/media/${poster}-${theme}.png`, t] as const,
      );
      // Measured: 0.1 to 0.7 for the right frame; an Orbit frame 1 s away is ~2.4.
      expect(await diffAt(t), `${file}-${theme}`).toBeLessThan(1);
      if (control !== null) expect(await diffAt(control), `${file}-${theme} control`).toBeGreaterThan(1);
    }
  }
});

// Each tour's start (components/media.ts, mirrored in START below) lands past the login, on a
// settled app screen: far from the login frame, and nearly the same 0.25 s later.
test("each Demo video tour starts past its login, on a settled screen", async ({ page }) => {
  await page.goto("/");
  const frameDiff = (src: string, t1: number, t2: number) =>
    page.evaluate(
      async ([src, t1, t2]) => {
        const once = (el: EventTarget, ev: string) => new Promise((r) => el.addEventListener(ev, r, { once: true }));
        const grab = async (t: number) => {
          const v = document.createElement("video");
          v.muted = true;
          v.src = src;
          await once(v, "loadedmetadata");
          v.currentTime = t;
          await once(v, "seeked");
          const c = document.createElement("canvas");
          c.width = 393;
          c.height = 852;
          const x = c.getContext("2d")!;
          x.drawImage(v, 0, 0, 393, 852);
          return x.getImageData(0, 0, 393, 852).data;
        };
        const a = await grab(t1);
        const b = await grab(t2);
        let sum = 0;
        for (let i = 0; i < a.length; i += 4) sum += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
        return sum / (a.length / 4) / 3;
      },
      [src, t1, t2] as const,
    );
  for (const app of ["bitewise", "ascend", "orbit"]) {
    for (const theme of ["light", "dark"] as const) {
      const src = `/media/${app}-demo-${theme}.mp4`;
      const start = START[app][theme];
      // Measured: 18 to 47 from the login at 1 s; under 0.8 from 0.25 s later (Bitewise's
      // rings are still filling at 2.5 s: 0.6 to 0.8, round 14).
      expect(await frameDiff(src, start, 1), `${app}-${theme} vs login`).toBeGreaterThan(10);
      expect(await frameDiff(src, start, start + 0.25), `${app}-${theme} settled`).toBeLessThan(2);
    }
  }
});

// The side loops never wait forever for Bitewise's (logic-checker, round 11).
const sideSrc = (page: Page) => page.evaluate(() => document.querySelector("#top li:nth-child(2) video")!.getAttribute("src"));
const leadSrc = (page: Page) => page.evaluate(() => document.querySelector("#top li:nth-child(1) video")!.getAttribute("src"));

test("pressing Bitewise's button before its loop has started lets the side loops load at once", async ({ page }) => {
  await page.route(/bitewise-loop-/, () => {}); // held back: it can't start
  await page.goto("/");
  await expect.poll(() => leadSrc(page)).toMatch(/bitewise-loop/);
  await page.waitForTimeout(500); // hydrated, timer still far off
  expect(await sideSrc(page)).toBeNull();
  await page.getByRole("button", { name: "Pause the Bitewise video" }).click();
  await expect.poll(() => sideSrc(page), { timeout: 3_000 }).toMatch(/ascend-loop/);
});

test("a Bitewise loop that fails to load lets the side loops load at once", async ({ page }) => {
  await page.route(/bitewise-loop-/, (r) => r.abort());
  await page.goto("/");
  await expect.poll(() => sideSrc(page), { timeout: 3_000 }).toMatch(/ascend-loop/);
});

test("a Bitewise loop that stalls lets the side loops load after about 5 s", async ({ page }) => {
  await page.route(/bitewise-loop-/, () => {});
  await page.goto("/");
  await expect.poll(() => leadSrc(page)).toMatch(/bitewise-loop/);
  await page.waitForTimeout(3_500);
  expect(await sideSrc(page)).toBeNull();
  await expect.poll(() => sideSrc(page), { timeout: 4_000 }).toMatch(/ascend-loop/);
});

test("the hero loops pause behind an open Demo video and play again after it closes", async ({ page }) => {
  await page.goto("/");
  const loops = () => Promise.all([1, 2, 3].map((n) => playing(page, `#top li:nth-child(${n}) video`)));
  await expect.poll(loops, { timeout: 15_000 }).toEqual([true, true, true]);
  // Opened without scrolling, so the loops stay on screen: only the dialog can pause them.
  await page.getByRole("button", { name: "Demo video of Ascend" }).evaluate((b: HTMLElement) => b.click());
  await expect(page.getByRole("dialog", { name: "Ascend demo video" })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect.poll(loops, { timeout: 15_000 }).toEqual([false, false, false]);
  await page.keyboard.press("Escape");
  // The phone shrinks back first (240 ms), then the dialog closes and the loops resume.
  await expect(page.getByRole("dialog", { name: "Ascend demo video" })).toBeHidden();
  await expect.poll(loops, { timeout: 15_000 }).toEqual([true, true, true]);
});

// Demo video (round 10): each tile's tour opens in a dialog, plays there, and closes.
// Round 11: each starts at its first app screen (components/media.ts, read frame by frame).
const START: Record<string, Record<"light" | "dark", number>> = {
  bitewise: { light: 2.5, dark: 2.5 },
  ascend: { light: 3.1, dark: 3.1 },
  orbit: { light: 3.5, dark: 3.3 },
};
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
      // Note where the tour first plays from.
      await page.addInitScript(() => {
        document.addEventListener(
          "playing",
          (e) => {
            const w = window as unknown as { __t0?: number };
            if ((e.target as Element).closest("dialog")) w.__t0 ??= (e.target as HTMLVideoElement).currentTime;
          },
          true,
        );
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
      expect(v).toEqual({ src: `/media/${slug}-demo-${theme}.mp4#t=${START[slug][theme]}`, muted: true, controls: true });
      // It starts past the login, at the first app screen.
      expect(await page.evaluate(() => (window as unknown as { __t0?: number }).__t0)).toBeGreaterThanOrEqual(START[slug][theme] - 0.1);
      expect([...new Set(requested)]).toEqual([`${slug}-demo-${theme}.mp4`]);

      // The tile's picture gave way to the tour once its first frame was in.
      await expect(dialog.locator(".demo-still")).toHaveAttribute("data-shown", "false");
      await dialog.getByRole("button", { name: "Close the video" }).click();
      await expect(dialog).toBeHidden();
      await expect(page.locator("dialog video")).toHaveCount(0);
      await expect(button).toBeFocused();
      await ctx.close();
    });
  }
}

// Round 15: autoplay refused (iOS Low Power Mode). A paused video shows its start frame, never
// its poster, and Bitewise's start frame has its rings mid-fill: it gets a settled still (Today
// at 4.0 s, rings full) and a Play button, which plays from the usual start. The first play()
// in the dialog is refused here, as Low Power Mode does; the Play button's own call goes
// through. `__refused` proves the refusal happened; `__t0` is where the tour first plays from.
const REFUSE_FIRST_PLAY = () => {
  const w = window as unknown as { __refused?: boolean; __t0?: number };
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
    if (!w.__refused && this.closest("dialog")) {
      w.__refused = true;
      return Promise.reject(new DOMException("Refused", "NotAllowedError"));
    }
    return play.call(this);
  };
  document.addEventListener(
    "playing",
    (e) => {
      if ((e.target as Element).closest("dialog")) w.__t0 ??= (e.target as HTMLVideoElement).currentTime;
    },
    true,
  );
};
const flag = (page: Page, key: "__refused" | "__t0") => page.evaluate((k) => (window as unknown as Record<string, unknown>)[k], key);
const tourState = (page: Page) =>
  page.evaluate(() => {
    const v = document.querySelector<HTMLVideoElement>("dialog[open] video");
    return v ? { paused: v.paused, controls: v.controls, time: v.currentTime, ready: v.readyState } : null;
  });

for (const theme of ["light", "dark"] as const) {
  // Light presses Play with the mouse, dark with the keyboard.
  const how = theme === "light" ? "click" : "keyboard";
  test(`Bitewise: a refused ${theme} tour shows its settled still and a Play button (${how}), then plays from its start`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
    const page = await ctx.newPage();
    await page.addInitScript(REFUSE_FIRST_PLAY);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("article:has(#bw-title)").getByRole("button", { name: "Demo video of Bitewise" }).click();
    const dialog = page.getByRole("dialog", { name: "Bitewise demo video" });
    const poster = dialog.locator(".demo-poster");
    const play = dialog.getByRole("button", { name: "Play the Bitewise demo video" });
    await expect(poster).toBeVisible();
    await expect(poster).toHaveAttribute("src", new RegExp(`bitewise-demo-poster-${theme}`));
    await expect(play).toBeVisible();
    expect(await flag(page, "__refused")).toBe(true);
    // Paused, and its native controls are off while the still covers them: Play is the one control.
    await expect.poll(() => tourState(page)).toMatchObject({ paused: true, controls: false });

    // The still is the tour's own settled frame (4.0 s), clearly not its mid-fill start frame.
    const diffAt = (t: number) =>
      page.evaluate(
        async ([src, t]) => {
          const once = (el: EventTarget, ev: string) => new Promise((r) => el.addEventListener(ev, r, { once: true }));
          const px = (s: CanvasImageSource) => {
            const c = document.createElement("canvas");
            c.width = 393;
            c.height = 852;
            const x = c.getContext("2d")!;
            x.drawImage(s, 0, 0, 393, 852);
            return x.getImageData(0, 0, 393, 852).data;
          };
          const v = document.createElement("video");
          v.muted = true;
          v.src = src;
          await once(v, "loadedmetadata");
          v.currentTime = t;
          await once(v, "seeked");
          const a = px(v);
          const b = px(document.querySelector<HTMLImageElement>("dialog[open] .demo-poster")!);
          let sum = 0;
          for (let i = 0; i < a.length; i += 4) sum += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
          return sum / (a.length / 4) / 3;
        },
        [`/media/bitewise-demo-${theme}.mp4`, t] as const,
      );
    expect(await diffAt(4), "the settled frame").toBeLessThan(1);
    expect(await diffAt(START.bitewise[theme]), "the start frame").toBeGreaterThan(1);

    // The refused state passes axe.
    const axe = await new AxeBuilder({ page }).include("dialog[open]").analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);

    if (how === "click") await play.click();
    else {
      await play.focus();
      await page.keyboard.press("Enter");
    }
    await expect.poll(() => playing(page, "dialog[open] video"), { timeout: 15_000 }).toBe(true);
    // From the usual start (past the login), not from 0 and not from the still's 4.0 s.
    const t0 = (await flag(page, "__t0")) as number;
    expect(t0).toBeGreaterThanOrEqual(START.bitewise[theme] - 0.1);
    expect(t0).toBeLessThan(3.5);
    // The still fades and goes, the button with it; the controls are back; focus stays in the dialog.
    await expect(play).toHaveCount(0);
    await expect(poster).toHaveCount(0);
    expect((await tourState(page))?.controls).toBe(true);
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog[open]")))).toBe(true);
    await ctx.close();
  });
}

test("Bitewise: Esc on a refused tour closes it; reopening, the tour plays with no still", async ({ page }) => {
  const posters: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("demo-poster")) posters.push(r.url());
  });
  await page.addInitScript(REFUSE_FIRST_PLAY);
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.locator("article:has(#bw-title)").getByRole("button", { name: "Demo video of Bitewise" });
  await button.click();
  const dialog = page.getByRole("dialog", { name: "Bitewise demo video" });
  await expect(dialog.locator(".demo-poster")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
  expect(posters.length).toBe(1);
  // Only the first play() is refused: this time it plays, and the still never shows.
  await button.click();
  await expect.poll(() => playing(page, "dialog[open] video"), { timeout: 15_000 }).toBe(true);
  await expect(dialog.locator(".demo-poster, .demo-play")).toHaveCount(0);
});

for (const [name, slug, title] of [
  ["Ascend", "ascend", "#as-title"],
  ["Orbit", "orbit", "#or-title"],
] as const) {
  test(`${name} starts on a settled screen: a refused tour stays paused there with its native controls, no still`, async ({ page }) => {
    await page.addInitScript(REFUSE_FIRST_PLAY);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator(`article:has(${title})`).getByRole("button", { name: `Demo video of ${name}` }).click();
    const dialog = page.getByRole("dialog", { name: `${name} demo video` });
    await expect.poll(async () => (await tourState(page))?.ready ?? 0).toBeGreaterThanOrEqual(2);
    expect(await flag(page, "__refused")).toBe(true);
    const state = (await tourState(page))!;
    expect(state).toMatchObject({ paused: true, controls: true });
    expect(state.time).toBeCloseTo(START[slug].light, 1);
    await expect(dialog.locator(".demo-poster, .demo-play")).toHaveCount(0);
  });
}
