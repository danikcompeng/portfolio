# Portfolio plan

Status: **revised after logic-checker**, 2026-11-25. Written by Claude from `CLAUDE.md`,
`PRODUCT.md` and `~/Documents/portfolio-research.md`, with facts pulled from the three app
repos (sources below). Dani asked for the build to go ahead without waiting for approval;
Claude's own calls are logged under "Decided while Dani was away" at the end.

## 1. Scope

**Today (Wed 2026-11-25):** the landing page `/`, complete: nav, hero, Bitewise story,
work grid, how I build, about and contact. Plus a 404 page, metadata and an Open Graph
image for link previews. Local git repo, no deploy (GitHub and Vercel need Dani).

**Thursday:** the case study `/work/bitewise` and the View Transition between it and the
home page. Until it exists, no link to it is rendered (a flag in `content/site.ts`).

**Not in this round:** the 3D (React Three Fiber) phone, the live Bitewise iframe (D6), a
blog, analytics.

## 2. Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Theme follows the system setting, with a toggle that overrides it and is remembered.** Dark is the design drawn first; light is a full counterpart. A plain inline `<script>` in `<head>` sets `data-theme` before first paint (`suppressHydrationWarning` on `<html>`). | Respects the visitor's setting; "dark-first" is about the base palette. `next/script` beforeInteractive runs only after the Next chunks load, so it would flash (logic-checker #3; `docs/01-app/02-guides/preventing-flash-before-hydration.md`). |
| D2 | **The hero phone is the story phone.** One sticky phone carries the hero and the four Bitewise steps: it starts tilted, straightens as the hero block scrolls away, and its screen changes per step. | One hero object, one authored motion, and the hero flows straight into the proof. |
| D3 | **Pinned story when the window is ≥ 1024 px wide and ≥ 540 px tall** (common laptops at 1280 × 600 included). Otherwise the steps stack, each with its own still. One DOM, switched by a CSS media query; JS reads the same `matchMedia` to decide which phone gets a video source, so the hidden layout's video never downloads. | A pinned phone plus captions doesn't fit a 390 × 667 phone; a 540 px cut-off keeps short laptops pinned (logic-checker #10). |
| D4 | **Flat CSS-perspective phone.** No 3D this round. | The brief says flat first; it is the Reduce Motion and phone fallback anyway. |
| D5 | **Screens are real frames from Bitewise's demo recordings** (`design/videos/bitewise-*`, recorded on production 2026-11-23). Today, the swap and cost per serving come in both themes; the scan is the real iPhone camera frame from the light recording, used in both themes (round 3). | Real product, current name, same demo account. |
| D6 | **No live iframe of Bitewise.** "Try Bitewise" opens the live app in a new tab. | The demo login cookie is SameSite=Lax (Supabase default), so "Try the demo" inside a cross-site iframe would likely bounce back to login. |
| D7 | **No resume link until Dani supplies a PDF without the phone number** (`flags.resumePdf`). | Every resume PDF found lists a phone number; the site must not. Round 2: nothing bracketed ships. |
| D8 | **Network CRM appears as "Orbit"** with https://orbit-dk.vercel.app. | It answers live (307 to /login, checked 2026-11-25) and the rename is committed (2f11512, 201c840). |
| D9 | **Numbers show as conservative floors** ("900+ unit tests", "500+ review findings"). `content/site.ts` keeps the exact value, the date and the source (file + section heading) behind each one. | The repos are being committed to today; three counts of the same logs already disagree by a few rows (logic-checker #2). A floor stays true as the logs grow. |
| D10 | **No motion library.** The screen crossfade is a CSS opacity transition on stacked layers; the tilt is a CSS scroll-driven animation; reveals are a tiny IntersectionObserver. `motion` is uninstalled. | Nothing visible is lost, the video stays mounted, and the client bundle stays small (logic-checker #13). |

## 3. Facts and sources

Floors are what the site shows; exact values are what the logs said on 2026-11-25.

### Bitewise (`~/Documents/meal-cost-tracker`)
- One-liner: "Cheap meals that hit your macros, on repeat, with a swap when you're bored." (`README.md:3`)
- Problem, in Dani's words: "Calorie trackers don't know what food costs. Meal planners make up recipes with ingredients I don't have. None of the apps I tried let me swap one of *my* meals for another with the same protein at the price I actually paid." (`README.md:17-19`)
- Live: https://trybitewise.vercel.app, "Try the demo", no sign-up. Code: https://github.com/danikcompeng/meal-cost-tracker (public).
- **900+ unit tests** (917 at the last recorded run, `plans/impeccable.md`, 2026-11-24), **7 end-to-end** (same run).
- **160+ commits** (166 on 2026-11-25, `git log`).
- **40+ reviews** by a read-only code-reviewer agent (45 entries in `.claude/agent-memory/code-reviewer/review-history.md`).
- Decisions: "Missing stays missing" (`CLAUDE.md`, `README.md:36-39`); no Undo timer because "Web pages can't tell whether VoiceOver is on" (`plans/polish.md`); 7 of 10 craft techniques (`plans/craft.md`) and 8 of 10 motion techniques (`plans/motion.md`).

### Ascend (`~/Documents/habit-tracker`)
- "A habit tracker you press like a physical key." (`CLAUDE.md:5`, `DESIGN.md:3`). Hold a key for 0.65 s to complete a habit; tap a done key to undo (`README.md`).
- Live: https://ascend-dk.vercel.app.
- **500+ unit and database tests, 90+ browser tests** (516 and 90 at Feature 10, `plans/habit-tracker.md` Reviews; 379 and 77 at Feature 8b before that).
- **260+ review findings** (268 by the fact agent's count, 285 by Claude's parser, both of committed HEAD; Reviews log).
- Decision (round 4): the Climb never slips: altitude is derived from check-ins like streaks, each day climbs by the share of habits done, up to 150 m, and a missed day never costs any (plan, Feature 10). Before: "Streaks are derived, never stored".
- Screens: `docs/screenshots/feature-10/today-{dark,light}.png` (Today with The Climb strip; round 4).

### Orbit (`~/Documents/network-crm`)
- "A personal CRM for an internship search: the people you meet, who introduced you to whom, what you talked about, when to follow up, and every application, with a map of your network at the centre." (`README.md:3-5`)
- Live: https://orbit-dk.vercel.app.
- **500+ unit tests** (527 after Feature 5, `plans/crm.md` Feature 5 review; no later count recorded).
- **230+ review findings** (233 at committed HEAD; the logic-checker counted 246 including an uncommitted second round).
- Decision (paraphrased, no quote marks; round 4): each ring is an introduction depth and each person sits at their branch's angle, with no physics run, so the same network always draws the same way (`plans/crm.md`, Feature 7 plan, Angles). Before: the Feature 5 radial tree settled by a short force run.
- Screens: `docs/screenshots/feature-7/map-{dark,light}.png` (the 3D map; round 4).
- **Do not quote** the plan's "Why" section (it names a contact).

### Across Ascend and Orbit (the three-agent workflow)
- **500+ findings, 450+ fixed.** logic-checker **180+** across **15+** plan reviews, all before code; code-reviewer **140+**; design-critic **160+**. (Exact at the fact agent's count: 501 / 464 / 184 / 15 / 148 / 169.)
- Caught before shipping (excerpts, marked as such on the page):
  - logic-checker, Ascend, High: "Holding Space: auto-repeat keydowns after 650 ms undo the habit just completed …"
  - logic-checker, Orbit, High: "… substring matching turns 'No offer' into an offer."
  - code-reviewer, Orbit, High: "Lifting the last, still finger of a pinch (or a two-finger tap) counted as a tap and opened a sheet …"
- **Not claimed:** that every feature had all three reviewers (design-critic runs only when a screen changed; renames skipped the logic-checker), that the phone check was done (no result is logged), Lighthouse scores, any user or usage numbers.

### Other work and about (from Dani's resume and career notes)
- TMU Computer Engineering, first year, expected 2030. Toronto Humanoid Robotics Club, team member. RCM Guitar Level 5, 8 years.
- Contact: danikainikkara@gmail.com, github.com/danikcompeng, linkedin.com/in/dani-kainikkara-42824b395.
- **Not on the site:** phone number, high school, GPA, the EE transfer, non-engineering jobs (round 2: the site covers engineering work and school only).

## 4. Material Dani supplies

Hidden until it exists (round 2): each item has a flag in `content/site.ts`; turning one on
without its file fails a unit test, and `scripts/check-built-html.mjs` fails the build if a
"[" reaches the page.
1. Headshot, `public/media/headshot.jpg` (4:5) → `flags.headshot`.
2. Resume PDF without the phone number, `public/Dani-Kainikkara-Resume.pdf` →
   `flags.resumePdf`. Check its text and metadata by hand for a phone number first.

## 5. Design direction

This section is the bar for the design-critic and the finish review.

- **Thesis:** the page is a neutral stage; the products bring the colour. It refuses the
  template portfolio (name, skills list, grid of same-size project cards) and the SaaS split
  hero with a badge row.
- **Ground:** near-black, not pure black (`oklch(0.16 0.004 260)`), raised surfaces a step
  lighter, alpha hairlines. Light: off-white (`oklch(0.985 0.002 260)`) with near-black ink.
  Text ≥ 4.5:1 on every surface it sits on, checked by a unit test that reads the CSS.
- **Colour comes only from the products, as fields:** Bitewise matcha (`oklch(75.93% 0.1016
  136.4)` at night, `oklch(49.09% 0.0938 130)` by day, from its DESIGN.md), Ascend persimmon
  (`#FF8F57` / `#B8420E`), Orbit blue (`#8AA8FF` / `#1D4ED8`). Each product's tile is tinted
  with its hue (a deep tint on dark, a pale tint on light) and its links use its accent. No
  site-wide accent, no neon, no glow, no gradient text.
- **Type:** Geist for everything, display set large and tight (600 weight, −0.035em, max
  6rem); Geist Mono only for data (counts, agent names, file paths, dates), tabular. Body
  17–18 px, 65–75ch.
- **Shape:** concentric radii (outer = inner + padding), one radius scale (8 / 14 / 22 /
  30 px), one icon set drawn in-house at 1.5 px stroke.
- **First viewport (1440 × 900):** nav row; h1 "From idea to live app, end to end." at ~88 px
  over two lines, left; subline; two buttons; the phone on the right at ~75% of the viewport
  height, tilted back in perspective, playing the Bitewise loop, a small label under it. At
  390 px: h1, subline, buttons, then the phone's top edge above the fold.
- **Signature interaction:** scrolling from the hero, the phone straightens and stays pinned
  while the four Bitewise steps pass on the left and its screen changes with them.
- **Motion grammar:** exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`), 150–250 ms for
  presses and toggles, 400–600 ms for reveals and screen changes. Reveals start at 0.97 scale
  and fade in, once, and only for content below the fold at load. Press feedback (0.97) on
  everything clickable. Content is visible without JS. Reduce Motion: no tilt, no autoplay,
  no reveals, instant screen changes.
- **Browser surfaces themed:** selection colour, focus ring (2 px, offset 3 px), scrollbar
  colours, caret, underline offset.

## 6. Page, section by section

### Nav
- Left: "Dani Kainikkara" (link to top). Right: Work, How I build, About (anchors), Resume
  (once it exists, D7), theme toggle.
- Theme toggle: label "Dark theme", `aria-pressed` set after mount from the real theme
  (`useSyncExternalStore` with a server snapshot, so no hydration mismatch); the sun/moon
  icon is switched by CSS from `data-theme`.
- Sticky, 56 px; a translucent ground with backdrop blur once scrolled (text stays readable
  over the phone). 44 px targets. At 390 px: name, Work, About, toggle; How I build and
  Resume are also in the footer.
- A skip link to `#main`.

### Hero + Bitewise story (one section, D2)
- **Pinned layout (D3):** a two-column grid; the right column holds a `position: sticky`
  phone (vertically centred, height from the viewport: `min(76svh, 780px)`) for the whole
  hero + story range. Left column: the hero block (`min-height: calc(100svh - 56px)`), then
  an h2 block introducing Bitewise, then four **contiguous** step blocks (~85svh each, text
  centred).
- **Tilt:** the hero block is a named view timeline (`view-timeline: --hero`, shared through
  `timeline-scope` on the section); the phone animates from
  `rotateY(-18deg) rotateX(8deg) rotateZ(1deg)` to flat over the hero's exit range, under
  `@supports (animation-timeline: view())`. Without support or with Reduce Motion it is flat.
- **Active screen:** on scroll (rAF-throttled) and resize, compare each step's top with the
  viewport's centre line: the active step is the last one whose top is above it; above step 1
  the screen is the video. Past step 4 it stays on step 4 until the phone unpins
  (logic-checker #4). A pure helper `activeStep(tops, centre)` holds the rule and is unit
  tested.
- **Screen layers:** the video and four stills are stacked in the phone; the active one has
  `data-active` and fades in over 400 ms (instant with Reduce Motion). The video stays
  mounted; stills are `next/image`, lazy, theme-matched (the other theme's copy is
  `display: none`, so it never downloads).
- A four-tick progress rail beside the phone (`aria-hidden`). Each step is a real `h3` +
  paragraph in reading order, under the story's `h2`.
- **Stacked layout:** hero block, the phone with the video, the h2, then each step as text +
  its still in a smaller flat phone. The section clips horizontal overflow.
- **Copy:**
  - h1: "From idea to live app, end to end."
  - Subline: "I'm Dani Kainikkara, a Computer Engineering student at TMU. I design, build and
    test apps end to end, with AI as a daily tool."
  - Buttons: "See the work" (to `#work`), "Try Bitewise" (new tab, ↗ icon; accessible name
    "Try Bitewise (opens in a new tab)").
  - Under the phone: "Bitewise · recorded on the live demo".
  - h2: "Bitewise" + "Cheap meals that hit your macros, on repeat, with a swap when you're
    bored."
  - The problem: "Calorie trackers don't know what food costs. Meal planners make up recipes
    with ingredients I don't have. Bitewise puts macros and money on one screen."
  - The swap: "Bored of a meal? Swipe through my own recipes, ranked by similar protein, foods
    I've had this week and cost, and swap it in place, with Undo."
  - The scan: "Scan a barcode and Open Food Facts fills in what it knows. I check it against
    the label and add what I paid." (logic-checker #8)
  - Cost per serving: "Every recipe comes down to one number, with protein per dollar. If a
    price is missing it shows a dash, never a lower number."
- **Video** (`bitewise-loop-{dark,light}.mp4`, 0.78 MB, 22 s): no `autoPlay` attribute.
  A client component sets the source for the current theme after mount (and swaps it when
  the theme changes), starts at 3.4 s (the poster frame, past the login screen), and plays
  only while: the phone is on screen, the video layer is active, Reduce Motion is off, the
  page is visible, and the visitor hasn't paused it. Leaving any of those pauses it (cleanup
  pauses too). A pause button (44 px, opaque backing, constant label "Pause video" with
  `aria-pressed`) satisfies WCAG 2.2.2. If `play()` is refused (Low Power Mode) the poster
  stays and the button shows the paused state. The video is `aria-hidden`; the step text
  carries the meaning. (logic-checker #7)

### Work (`#work`), a bento grid
- Desktop (12 columns, 20 px gaps): row 1 Bitewise, full width; row 2 Ascend (6) + Orbit (6);
  that's all (round 2: Bitewise, Ascend and Orbit only). Below 1024 px: one column.
- **Bitewise** (matcha field): name, one-liner, facts (900+ unit tests · 7 end-to-end · 40+
  code reviews), two decisions with one line of reasoning each ("Missing stays missing", "No
  Undo timer"), actions "Try the live demo ↗", "Code on GitHub ↗" (case study once it
  exists). Media: the full tour (`bitewise-tour-{dark,light}.mp4`, ~2.4 MB) in a phone,
  source set only when the tile is near the viewport, same play rules and pause button.
- **Ascend** (persimmon field): name, one-liner, Today with The Climb strip, the decision "A
  climb that never slips", facts (500+ unit and database tests · 90+ browser tests · 260+
  review findings), "Open Ascend ↗".
- **Orbit** (blue field): name, "A personal CRM for an internship search, with a map of who
  introduced you to whom.", the 3D map screen, the decision (paraphrased), facts (500+ unit
  tests · 230+ review findings), "Open Orbit ↗".
- Each action is its own link (no whole-tile link). Hover lifts the media 2 px.

### How I build (`#how`)
- Heading "How I build", line: "On Ascend and Orbit, each feature is planned in writing. A
  logic-checker reviews the plan before any code; a code-reviewer, and a design-critic when a
  screen changes, review the build. All three are read-only AI agents: they report, I decide."
- Pipeline drawn in HTML/CSS: Plan → logic-checker → Build → (code-reviewer ∥
  design-critic) → Phone check → Ship. Horizontal with a fork at ≥ 1024 px, vertical below.
  - Plan: "Written up in `plans/*.md` before any code."
  - logic-checker: "Walks the plan step by step, hunting edge cases." 180+ findings in 15+
    plan reviews.
  - Build: "Claude Code builds it, with tests." 500+ unit and 90+ browser tests on Ascend.
  - code-reviewer: "Reads the diff for bugs, security and accessibility." 140+ findings.
  - design-critic: "Judges screenshots at phone size, light and dark." 160+ findings.
  - Phone check: "A written checklist for a real phone." (no number, no claim it ran)
  - Ship: "Every finding is logged with what was done." 450+ of 500+ fixed.
- "Caught before it shipped": the three excerpts from section 3, each with agent, app and
  severity, set as quotations with ellipses (not cards).
- Footnote: "Counts from each repo's review logs and test runs on Nov 25, 2026, rounded down."

### About (`#about`) and contact
- One column until the headshot exists; then two columns at ≥ 1024 px, photo (4:5) left.
- Text: "I'm a first-year Computer Engineering student at Toronto Metropolitan University.
  Lately I've built a meal tracker, a habit tracker and a CRM for my internship search."
- Facts: TMU Computer Engineering (expected 2030); Toronto Humanoid Robotics Club, team
  member; guitar, RCM Level 5 after 8 years.
- Contact, the page's close: "Say hello" + the email as a large mailto link with a "Copy"
  button (announces "Email copied" in a live region), GitHub, LinkedIn, Resume once it exists.
- Footer: "© 2026 Dani Kainikkara · Built with Next.js and Claude Code".

### 404
- "That page doesn't exist." + link home, in the same world.

### Metadata
- Title "Dani Kainikkara · From idea to live app, end to end"; description from the subline;
  `themeColor` for both schemes in the `viewport` export (it follows the OS, not the toggle);
  `app/icon.svg` monogram (the starter `favicon.ico` is deleted); Open Graph image (1200 ×
  630) from `ImageResponse` with a Geist font file read at module scope.

## 7. Accessibility and performance

- WCAG 2.2 AA. One `h1`; `h2` per section (the story has its own); steps are `h3`. Visible
  focus. 44 px targets. External links say they open a new tab. A pause button on every
  playing video. Content visible without JS. axe in Playwright, both themes, 0
  serious/critical.
- Budget: first load under ~2 s on a mid phone over 4G. Client JS: the inline theme script,
  the story/video component, the toggle, copy-email, reveals. Images via `next/image`
  (`images.formats` includes AVIF). Hero loop 0.78 MB; tour videos only near the viewport.
  Fonts via `next/font`. Lighthouse once deployed (not claimed before).

## 8. Architecture

```
app/
  layout.tsx          fonts, metadata, viewport, inline theme script, skip link
  page.tsx            sections in order (server component)
  globals.css         tokens (OKLCH), themes, browser surfaces, scroll-driven tilt
  not-found.tsx, icon.svg, opengraph-image.tsx
components/
  nav.tsx, theme-toggle.tsx (client)
  hero-story.tsx      hero + steps layout (server), one DOM for both layouts
  phone.tsx           the frame (server), concentric radii
  story-screen.tsx    (client) active step, stacked layers
  loop-video.tsx      (client) themed source, play rules, pause button
  work.tsx, how-i-build.tsx, about.tsx, themed-image.tsx
  copy-email.tsx (client), reveal.tsx (client), icons.tsx
content/site.ts       every string, link and number (exact value, date, source), flags
lib/                  contrast.ts, css-tokens.ts, active-step.ts (+ tests)
public/media/         videos, stills, screenshots (provenance embedded + SOURCES.md)
e2e/                  screens.e2e.ts (390 + 1440, light + dark), smoke.e2e.ts
```

## 9. Tests

- Vitest: contrast maths; every text/surface pair in both themes read from `globals.css`
  (4.5:1 text, 3:1 marks); content rules (no phone-number pattern in `content/` or text files
  in `public/`, no claim of being built for a specific company, every external link https, every number has a source
  and its floor ≤ its exact value); `activeStep` boundaries (above step 1, exactly on a top,
  past step 4).
- Playwright: screens at 390 × 844 @3 and 1440 × 900 @2, light and dark, full page and first
  viewport; smoke: no console errors, nav anchors land on their sections, external links have
  `rel="noopener noreferrer"`, axe in both themes, Reduce Motion leaves the videos paused and
  the phone flat, the theme toggle persists across reload without a flash.

## 10. Build order

1. Tokens, layout, theme script and toggle, nav, footer.
2. Media into `public/media` with provenance.
3. Hero + story (phone, video, steps, pin, tilt).
4. Work grid, How I build, About.
5. Metadata, icon, OG image, 404.
6. Tests, screenshots, detector, reviewers (code-reviewer, design-critic, Impeccable finish
   review), fixes, DESIGN.md, commit.

## Open questions for Dani

Answered in round 2 (2026-11-25): keep "a written checklist" for the phone check; hide
unsupplied material (no brackets); skip the iOS 16 fallback; keep the hero video for now;
remove Niagara Parks, the Unity racing game and the Spotify display. Round 3: keep
"Guitar, RCM Level 5" in About; one scan frame for both themes. Still open:
1. Theme: follow the system (current), or dark for everyone with light on request?

## Round 2: Dani's decisions (2026-11-25)

1. **No company names in the repo.** Every mention of the company and of the person who
   asked to see the work is gone; the rule is now "never claim a project was built for a
   specific company" (CLAUDE.md, PRODUCT.md, the agents, the test). Local history was
   replaced by one clean commit before anything was pushed.
2. **Dark scan.** `bitewise-scan-dark.png` is the camera frame at 62.4 s of
   `bitewise-demo-dark-real-scan.mp4`; the scan step is now a theme pair like the others.
   CLAUDE.md's video path now reads `bitewise-loop-dark.mp4`.
3. **No [BRACKETS] in production.** The headshot and the resume link are
   hidden behind flags in `content/site.ts` (section 4); the placeholder component is gone.
   `postbuild` runs `scripts/check-built-html.mjs`, which fails the build if a "[" reaches
   visible text, and the smoke test checks the served page the same way.
4. **Niagara Parks removed** from About, content and tests: the site covers engineering work
   and school only.
5. **Unity racing game removed** from the Work grid, content, copy, tests and this plan (no
   evidence of it left). Unity isn't listed as a skill anywhere on the site.
6. **Spotify display removed** the same way (no proof of it left): the Work tile, its flag,
   content, the About sentence, tests, docs. Work is Bitewise, Ascend and Orbit.
7. Reviewers (code-reviewer and design-critic) check the two fixes the finish review never
   saw plus everything above, before shipping.

## Round 3: Dani's decisions (2026-11-25)

1. **Keep "Guitar, RCM Level 5"** in About.
2. **One scan frame for both themes.** The dark recording's frame (round 2) was letterboxed
   with the lookup sheet already open, which the design-critic rated its top issue; the scan
   step now uses the light recording's full-bleed camera frame in both themes, as in round 1.
   `bitewise-scan-dark.png` is removed; the light frame is `bitewise-scan.png` again.
3. **A cleaner scan frame** (Dani): `bitewise-scan.png` is now the frame at 62.1 s of the Nov 25
   re-recording of `bitewise-demo-light-real-scan.mp4`; its source note is re-embedded.
4. **New hero copy** (Dani): headline "From idea to live app, end to end." (page, titles, OG
   image and its alt, smoke test); subline spells out "Toronto Metropolitan University" and
   says "I design, build and test every part myself". A no-break space keeps "I" with
   "design" at 390 px. Checked at 390 and 1440, light and dark: two-line headline at both.

## Round 4: new Ascend and Orbit screens (2026-11-25)

Dani's brief: `~/Documents/claude-inbox/portfolio/01-new-ascend-orbit-images.md`.
1. **New screenshots** (Dani): Ascend's Today with The Climb strip (habit-tracker Feature 10)
   and Orbit's 3D map (network-crm Feature 7), light and dark; `SOURCES.md` updated.
2. **Alt text** for both now describes what they show.
3. **Decisions**: Ascend's becomes "A climb that never slips" (Feature 10 rules); Orbit's keeps
   its title but now describes the 3D layout (no physics run), since the 3D map has no force run.
4. **Ascend's test counts** from the Feature 10 log: 516 unit and database tests (500+), 90
   browser tests (90+), on the tile and in How I build. Orbit's Feature 7 log records no new
   totals, so its 500+ stays. Review-finding totals weren't recounted: the floors are still
   true lower bounds.

## Round 5: the Bitewise case study (2026-11-25)

Dani's brief: `~/Documents/claude-inbox/portfolio/02-bitewise-case-study.md` (approved draft,
Dani's words). Layout chosen by Dani: text plus two real screens.

**Route** `app/work/bitewise/page.tsx`, static (prerendered), Read mode. `flags.caseStudy`
turns on; the Bitewise tile's "Read the case study" link (already behind the flag) becomes a
`next/link`. The View Transition named in section 1 is not in this round (not in Dani's
brief; logged as open).

**Content** in `content/site.ts` as `caseStudy`, every claim with its source comment. Light
edits only, Dani's voice:
- Title "Bitewise: cheap meals that hit your macros" (README tagline). Facts row: the tile's
  own `bitewise.stats` (900+ unit tests, 7+ end-to-end tests, 40+ code reviews).
- Links: Try the live demo, Code on GitHub, Full tour video (GitHub file view of
  `design/videos/bitewise-demo-light-real-scan.mp4`, the README's "full tour with a real
  iPhone scan"; checked 200).
- The problem; What I built; The hardest decision: the swap ranking; A rule I kept
  everywhere: missing stays missing; How I built it; What I'd do next. Sources:
  README.md (Why, What it does, Interesting decisions, How I built it with AI),
  `plans/swap.md` §2 ("pure, tested"), CLAUDE.md feature 4 (purchases, "What's in my
  kitchen") for What I'd do next.
- **Cut** (can't be traced): "so I could change the rules without breaking the screen".
  The sentence ends at "It's a pure function with its own tests."
- The two catches link to their commits, as the README does: 599293a (a package size of 0
  made a food look free: `pricePerUnit` returned 0) and 8ca92ae (the day rolls over when
  the app comes back to the screen). "900+ unit tests" is `fmt(bitewise.stats.unitTests)`,
  the tile's source.

**Layout** (the site's world, no new tokens):
- Nav as everywhere. A header tile on the Bitewise field (`.tile tile-bw`, its own story, so
  its colour is allowed): h1 (t-section; no label above it, the craft floor bans one),
  facts, the three links; the
  Today screen in a phone on the right at ≥ 1024 px, under the text below that (the
  `story.steps` alt). Priority image (it's the first viewport).
- Then the six sections in a reading column (max 38rem, prose 1.0625rem / 1.65 in ink),
  h2 at t-title. The swap screen in a phone beside "The hardest decision" at ≥ 1024 px,
  after its text below that (its existing alt).
- Close: "Try the live demo", "Code on GitHub", and "Back to the work" (`/#work`, with a
  drawn left arrow from `icons.tsx`, not a "←" glyph). Footer
  shared with the home page (a `Footer` component; links `/#…` off the home page).
- No reveals or video on this page: it's for reading.

**Metadata**: title "Bitewise case study · Dani Kainikkara", description from the problem
line; the root Open Graph image still applies (check it's in the built HTML).

**Tests**: smoke: the page loads with one h1 and no console errors; axe at 390 and 1440 in
light and dark; every outside link opens in a new tab with its label; no "[" in its text;
"Back to the work" lands on `#work`; the home tile links to it. The postbuild bracket check
covers the new HTML. site.test: the flag's file check already exists. Screenshots at 390 and
1440, light and dark.

**Changed after the reviews** (see Reviews, Round 5): the price sentence is Dani's own again;
"checked every change before it was committed" is cut (it can't be backed), leaving "A
read-only code-reviewer agent caught real bugs before I committed them"; the swap figure is a
new live-demo capture with the page unscrolled (`bitewise-swap-sheet-*`), captioned; links
between the two pages are plain `<a>` (full loads), so no hidden page stays mounted; the case
study has its own link preview.

## Reviews

### Plan review, logic-checker (2026-11-25)
Verdict: **Ready after fixes**.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | Critical | "How I build" claimed every feature went through all three reviewers and a phone test; the logs show design-critic only when a screen changed, renames without a logic-checker, and no recorded phone-check result. | Fixed | Copy now describes the process without "every"; the phone step is "a written checklist" with no claim it ran; "Not claimed" list extended. |
| 2 | High | Counts already stale "as of Nov 25" (new commits and review rounds today; drifted line cites). | Fixed | D9: floors on the page, exact value + date + section-heading source in `content/site.ts`; recounted from committed HEAD. |
| 3 | High | Inline `next/script` beforeInteractive runs after the Next chunks, so the theme flashes. | Fixed | D1: plain inline `<script>` in `<head>`, per the Next.js flash-before-hydration guide. |
| 4 | High | "No step under the band" covers three states, so the phone flips back to the video at the end of the story. | Fixed | Active step = last step whose top is above the centre line; above step 1 = video; contiguous step blocks; pure helper with tests. |
| 5 | Medium | `rootMargin: -50% 0 -50% 0` throws (unitless 0). | Fixed | No IntersectionObserver band; scroll geometry instead (#4). |
| 6 | Medium | Hero height and tilt range unspecified (step 1 active on load on tall screens). | Fixed | Hero block `min-height: calc(100svh - 56px)`; tilt driven by the hero's own view timeline. |
| 7 | Medium | Video rules conflict (autoPlay vs Reduce Motion, re-play after a pause, unmounting, decoding under a still, Activity, label + aria-pressed, contrast over video). | Fixed | No autoPlay; one play rule with five conditions; video stays mounted; cleanup pauses; constant label + `aria-pressed`; opaque button backing. |
| 8 | Medium | No dark scan source; scan copy overstates what Open Food Facts does. | Fixed | D5: the camera frame (dark UI) in both themes; copy now "fills in what it knows. I check it against the label". |
| 9 | Medium | Orbit quote drops "on one device". | Fixed | Paraphrased without quote marks, about branches not moving. |
| 10 | Medium | 640 px height cut-off drops common laptops; no wide-but-short layout; hidden layout's video. | Fixed | D3: ≥ 540 px tall; one DOM + media query; JS reads the same query before giving a video a source. |
| 11 | Medium | Toggle label computed in render mismatches on hydration. | Fixed | Constant label "Dark theme", `aria-pressed` after mount via `useSyncExternalStore`, icon by CSS. |
| 12 | Medium | A regex over `public/` can't see a phone number inside a PDF. | Fixed | Section 4: check the resume by hand when it arrives; the company rule is a generic phrase check. |
| 13 | Low | `motion` is unnecessary. | Fixed | D10: CSS crossfade; dependency removed. |
| 14 | Low | Theme-matched images, reveals blinking above the fold, hero poster as CSS background, tilt overflow at 390, h1 → h3 jump. | Fixed | Two lazy `next/image` copies hidden by theme; reveals only below the fold at load; poster via `next/image`; section clips overflow; story `h2` added. |
| 15 | Low | Next.js details: `themeColor` in `viewport`, AVIF opt-in, `preload` not `priority`, starter favicon, OG font file. | Fixed | Section 6 Metadata and 7. |
| 16 | Low | Stale notes: Orbit rename committed, 165 commits, Ascend one-liner source, quotes trimmed, Ascend screens about to change. | Fixed | Section 3 updated; quotes marked as excerpts; note to swap Ascend screens after Feature 9. |

### Build review 1, code-reviewer (2026-11-25)
Verdict: **Ship after fixes**. Checked and fine: every number against its source, the three quotes, alt text, privacy (no phone numbers, PNG chunks hold only provenance), hydration, Next 16 conventions, link safety, MP4 faststart and range requests.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | Medium | A video keeps playing after its source is withdrawn (layout switch, Reduce Motion turned on), because the effect returned early on `!src`. | Fixed | `loop-video.tsx` pauses, removes `src` and calls `load()` when the source goes away; e2e covers Reduce Motion mid-visit and crossing to the stacked layout. |
| 2 | Medium | A theme swap restarts the video at 0: the new source's first `timeupdate` wrote `data-t="0"`. | Fixed | `timeupdate` is ignored while `readyState === 0`; e2e checks the position survives a swap (within 2.5 s). |
| 3 | Medium | "15 plan reviews" rendered exact, and the logs now show 17. | Fixed | Rendered as "15+" (exact 17 recorded with its source). Every number on the page now goes through `fmt()`. |
| 4 | Medium | `sizes` ignored the height half of the pinned query, so wide-but-short windows got 32 px images. | Fixed | `PINNED_SIZES` / `STACKED_SIZES` built from `PINNED_QUERY` in `lib/client-state.ts`. |
| 5 | Medium | Video tests passed for the wrong reason (bundled Chromium may not decode H.264); play/pause untested. | Fixed | `e2e/video.e2e.ts` runs in branded Chrome: plays from the poster frame, stops under a still and resumes, pause survives scrolling, theme swap keeps position, Reduce Motion mid-visit, layout switch. |
| 6 | Low | Eager posters download both themes and get preloaded. | Fixed | Lazy with `fetchPriority="high"` on the hero, so the hidden theme's copy never loads. |
| 7 | Low | The theme doesn't follow an OS change mid-visit. | Fixed | With no stored choice, a `prefers-color-scheme` change updates `data-theme`. |
| 8 | Low | `light-dark()` needs Safari 17.5+; iOS 16 would lose every token. | Deferred | A fallback means a second copy of every token that can drift; noted for Dani (open question 5). |
| 9 | Low | Weak guards: no positive control for the tilt; the phone regex missed unseparated numbers. | Fixed | A tilt-present test; the regex now matches six common shapes (with fixtures) and skips digits inside longer numbers; the scan covers the folders that render text. |

### Build review 1, design-critic (2026-11-25)
Verdict: **Ship after fixes**. Nothing fails accessibility or breaks in either theme or width.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | Medium | The story's h2 runs into step 1 when pinned. | Fixed | `.story-steps { margin-top: 24svh }` in the pinned layout. |
| 2 | Medium | The same Today screen three times; the Bitewise tile repeats the story's one-liner. | Fixed | The tour starts on, and is postered with, the Recipes list (51.8 s); the tile has its own line. The hero poster stays the loop's own start frame. |
| 3 | Medium | "How I build" lost the fork; one station had two numbers. | Fixed | code-reviewer and design-critic are two stations drawn as a fork, each with its count. |
| 4 | Medium | Row 3 media tops can't align with fixed 16/10 boxes. | Fixed | At ≥ 1024 the media fills the tile height (`.tile-fill`). |
| 5 | Medium | About at 390: a 437 px photo box before the heading. | Fixed | Text first below `lg`. |
| 6 | Low | Hero phone at 70% of the viewport, not ~75%. | Fixed | `--phone-h: min(76svh, 780px)`. |
| 7 | Low | Rail shows before any step; caption off-centre and not mono. | Fixed | Rail fades in once a step is active; caption is `t-data`, centred. |
| 8 | Low | Ascend and Orbit phones start at different heights. | Fixed | Both sit on the tile bottom (`mt-auto`). |
| 9 | Low | Bad breaks at 390 ("Sep 2026 / – now", the contact row). | Fixed | `whitespace-nowrap`; Copy email gets its own row on phones. |
| 10 | Low | The phone's outline disappears on dark. | Fixed | A faint outer ring in dark. |
| 11 | Low | The hero video looks softer than the stills. | Not changed | The loop is 786 px wide (393 @2x) and there's no video encoder here; a higher-resolution export is Dani's call. |
| 12 | Low | Build station copy contradicts the "Me" legend. | Fixed | "I build it with Claude Code, with tests." |
| 13 | Low | Hover lift 3 px and on any part of the tile. | Fixed | 2 px, only when a link in the tile is hovered or focused. |

### Build review 1, Impeccable finish review (2026-11-25)
Run as a fresh agent from `.claude/agents/impeccable-finish-reviewer.md` (this session couldn't register the agent type). Code-led build, no image generation, no comp.

- **First pass: recapture.** The `first-viewport` tool's full-page shots were taken without scrolling, so reveals hadn't fired and the hero poster hadn't painted. Recaptured with an instant scroll-through and settle; verified 0 hidden reveals. It confirmed the 565 px "empty stretch" beside the pinned phone is not a fault.
- **Second pass: fix**, keeping "the live, tilted Bitewise phone that straightens into the pinned four-step story on a neutral near-black stage".

| # | Finding | Outcome | What changed |
|---|---|---|---|
| 1 | First viewport: caption not mono as the contract says; the rail shows before any step. | Fixed | Mono caption; rail hidden until a step is active. |
| 2 | Subline runs three lines at 1440 with "daily tool." orphaned. | Fixed | 37rem measure: two lines. |
| 3 | About labels in mono (labels aren't data). | Fixed | Geist sans, muted. |
| 4 | The story's h2 and step 1 read as one block. | Fixed | 24svh beat before the steps (same as design-critic #1). |
| 5 | How I build: ragged two- and three-line mono stacks; the agent name split. | Fixed | Number (mono) + label (sans), one per line; reviewers split into a fork. |
| 6 | The quotes read as fragments with ellipses. | Fixed | Each is a complete sentence from its source row. |

- **Verdict pass: fix.** All six scored resolved; two regressions from the round were named. This unattended run's single correction round was used up, so they were fixed afterwards without another review:

| # | Finding | Outcome | What changed |
|---|---|---|---|
| 7 | The fork's branch line crosses the code-reviewer text. | Fixed (not re-reviewed) | Fork text indented 32 px past the node; the line runs down the node's centre. |
| 8 | The Bitewise tile line describes the tile, not the product. | Fixed (not re-reviewed) | "A meal tracker for the cheap meals I actually repeat: macros first, cost second." (Dani's notes: "Macro tracking comes first, cost second.") |

### Round 2 review, code-reviewer (2026-11-25)
Verdict: **Ship after fixes**. Checked and fine: one-commit history with no matching objects, placeholder removal, flags, the Unity/Niagara/Spotify removals, the dark scan pairing, the tile line's source.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | Medium | The fork's 32 px indent wraps "code-reviewer"/"design-critic" between 1024 and ~1150 px. | Fixed | The pipeline goes horizontal at 1200 px; a smoke test checks agent names stay on one line at 1024, 1200 and 1440. |
| 2 | Medium | The bracket checks ignore attributes (alt, aria-label, title, meta content) and don't require the home page. | Fixed | `check-built-html.mjs` also scans those attributes and fails without `index.html`; its functions are unit tested (noscript, entities, attributes, scripts ignored). |
| 3 | Low | Dani's grep matches 22 of Next's own build files in `.next/`. | Fixed | `.next` is build output: removed after the last local build; use `git grep -i` or `--exclude-dir=.next`. |
| 4 | Low | The company test is case-sensitive and narrow; Markdown docs unscanned. | Fixed | Capitalised and more verbs ("created", "developed"), "for the …"; scans the root `.md` files and `plans/` too; fixtures test the pattern. |
| 5 | Low | The flag test ignores filename case (Windows), so a `Headshot.JPG` would 404 on Vercel. | Fixed | Compares against the exact names in the folder. |
| 6 | Low | Stale docs (D5, DESIGN.md placeholders, round-2 answers). | Fixed | Updated. |
| 7 | Low | The dark scan frame is letterboxed with the lookup sheet up. | Kept | Dani asked for this frame; every frame of the dark scan has the sheet up (see design-critic #1). |

### Round 2 review, design-critic (2026-11-25)
Verdict: **Ship after fixes**. Removals are clean; Work and About hold without them; both unseen fixes work.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | High | The dark scan still looks broken: pillarboxed camera, a band behind the hint, the "Looking up…" sheet flush left. | Kept, flagged | Dani asked for the dark recording's frame, and the sheet is up in every camera frame of it. The flush-left sheet may be a layout bug in Bitewise itself; noted for Dani. |
| 2 | Medium | The dark tour opens on a loading skeleton. | Fixed (root cause) | Native `loop` restarted the videos at 0, the demo's login and loading skeleton. Both now restart past it on `ended` (hero 4.6 s, tour 5 s); e2e checks the wrap. |
| 3 | Low | Ascend and Orbit text blocks don't line up. | Fixed | The two tiles share row tracks through a subgrid at ≥ 1024. |
| 4 | Low | The fork's second branch dead-ends. | Not changed | The fork label already reads as parallel; optional. |
| 5 | Low | The Bitewise tile line orphans "cost second." at 390. | Fixed | `text-wrap: balance` on the tile lines. The story subline stays the product's own tagline ("your macros"). |
| 6 | Low | About and Say hello read as two sections. | Fixed | Contact margin cut to `clamp(64px, 8vw, 112px)`. |
| 7 | Low | Plan section 6 out of date. | Fixed | Already updated with the Spotify removal (the critic read it mid-edit). |

### Round 5 plan review, logic-checker (2026-11-25)
Verdict: **Ready after fixes**. All copy checked against meal-cost-tracker's README, notes, plans, CLAUDE.md and the two commits.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | High | The smoke test asserted no `/work/` link on the home page, so turning the flag on would fail it. | Fixed | Replaced by a test that the tile opens the case study and "Back to the work" returns to `#work`. |
| 2 | Medium | "A food with no price shows 'no price yet'" can't happen today: every food has a price. | Fixed (light edit) | "A cost that can't be worked out shows 'no price yet', never $0", which is what `lib/cost.ts` and the row do. |
| 3 | Medium | "Checked every change before it was committed" overstates: the agent came on day two, and small commits had no review. | Fixed (light edit) | "Once I'd set it up, a read-only code-reviewer agent checked every feature before I committed it" (`notes.md`: "every feature since gets reviewed before its commit"). |
| 4 | Medium | A page `openGraph` replaces the layout's; the root image might not survive. | Fixed | It didn't (the test caught it). The case study now has its own link preview (its title, Bitewise's colour), from a template shared with the home page's (`lib/og-image.tsx`); a smoke test checks `og:image`. |
| 5 | Medium | A shared footer's "Back to top" would leave the page; the page needs `#main`. | Fixed | The page header is `#top`, `<main id="main" tabIndex={-1}>`; footer section links go to `/#…` off the home page; a smoke test clicks Back to top. |
| 6 | Medium | `priority` would preload the hidden theme's copy too. | Fixed | `ScreenLayer`/`ThemedImage` take `priority` as `fetchPriority="high"` on lazy images, as the video posters do. |
| 7 | Low | "The hardest decision" isn't in any source. | Kept | Dani's own judgement in his approved text, not a fact; flagged in the summary. |
| 8 | Low | "What I'd do next: track purchases"; notes name another next feature. | Kept | Dani's stated intent (CLAUDE.md feature 4); flagged. |
| 9 | Low | "Every feature started as a written plan": early features have no file in `plans/`. | Kept | README.md:63 says it, the source Dani named; flagged. |
| 10 | Low | Check the commits really hold the fixes. | Checked | 599293a changes `return 0` to `null` in `pricePerUnit`; 8ca92ae adds `day-rollover.tsx`. |
| 11 | Low | The bracket check only required `index.html`. | Fixed | It also requires `bitewise.html` while the page's source exists. |
| 12 | Low | New URLs should be in `links` for the https test. | Fixed | `bitewiseTour`, `bitewiseFixFree`, `bitewiseFixOvernight`. |
| 13 | Low | The tour link is the light video only. | Kept | The README's "full tour with a real iPhone scan" link; one link keeps the row short. |
| 14 | Low | "Foods you'd have to buy" means foods not logged this week. | Kept | README wording; "What I'd do next" explains it. |
| 15 | Low | Resume would vanish on phones once its flag is on (the footer had none). | Fixed | The shared footer shows Resume when its flag is on. |

### Round 5 build review, code-reviewer (2026-11-25)
Verdict: **Ship after fixes**. No privacy problems or invented claims; every source comment checked.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | Medium | After a client-side visit the hidden home stays mounted: duplicate `#main`, `#top`, `#how-title`. | Fixed | Links between the pages are plain `<a>` (`PageLink`): full loads, no hidden route. Section ids are `cs-…` anyway. |
| 2 | Medium | Home footer links became `next/link`, whose scroll doesn't move the keyboard's starting point. | Fixed | Plain `<a>` (as before); a test checks the next Tab lands in Work. |
| 3 | Medium | Focus stranded in the hidden route after Read the case study / Back to the work. | Fixed | Same as #1; a test checks the next Tab after Back to the work lands in Work. |
| 4 | Medium | The price sentence was reworded, not cut, against Dani's rule; the new wording is only partly true (the Foods list shows "—"). | Fixed | Dani's own sentence restored (README.md:36; CLAUDE.md feature 4 is the same rule). Flagged for Dani: today every food has a price, so it describes the rule, not a case you can hit. |
| 5 | Low | "Once I'd set it up … every feature" changes Dani's sentence too. | Fixed (cut) | The overclaiming clause is cut instead: "A read-only code-reviewer agent caught real bugs before I committed them, like …" (45 reviews over ~200 commits, so "every change" can't stand). Flagged for Dani. |
| 6 | Low | "today's meals" lost the Today screen's name. | Fixed | "Today's". |
| 7 | Low | `altFor` fell back to an empty alt. | Fixed | It throws if a story id is missing. |
| 8 | Low | `grid-row: 3 / span 3` hard-coded the ranking's position. | Fixed | `span 3`, auto-placed on the row of the section it follows. |
| 9 | Low | The header phone is lazy with high fetch priority (likely the LCP). | Accepted | Same trade-off as the hero poster: lazy keeps the other theme's copy from downloading. |
| 10 | Low | The link test only required the two commit URLs. | Fixed | It compares the exact set of five destinations. |
| 11 | Low | `#work` in viewport passes on a 1 px sliver. | Fixed | Checks the Work h2. |
| – | – | Missing tests: the case study's OG image; focus after navigation; the home footer. | Added | `og:image` fetched (200, image/png); the two Tab tests. The video and skip-link tests after client navigation no longer apply (full loads). |

### Round 5 build review, design-critic (2026-11-25)
Verdict: **Ship after fixes**. Nothing fails contrast or breaks at either width or theme.

| # | Severity | Finding | Outcome | What changed |
|---|---|---|---|---|
| 1 | Medium | The swap phone runs past the ranking section with no caption. | Fixed | A mono caption, "The swap · captured on the live demo". |
| 2 | Medium | The swap card's text is too small at 270 px. | Fixed | Up to 340 px, never wider than its column; 300 px below 1024. |
| 3 | Medium | The commit link's arrow wraps alone at 390 ("↗ , and"). | Fixed | Last word and arrow in one nowrap run. |
| 4 | Low | The swap frame starts mid-scroll (rings cut at the top). | Fixed | A new capture from the live demo, page unscrolled (see the finish review). |
| 5 | Low | At 1440 x 900 the first h2 sits just below the fold. | Fixed | `.cs-body` top padding `clamp(48px, 5vw, 72px)`. |
| 6 | Low | At 1024 to 1100 px the phone could overflow its column. | Fixed | Its width is capped by the column; measured at 1024, 1100 and 1440: no overflow. |
| 7 | Low | The h1 and the h2s don't share a left edge. | Fixed | At ≥ 1024 the column starts inside the tile's padding (h1 and h2 within 1 px). |
| 8 | Low | Footer link padding pushes text off the gutter. | Fixed | `-mx-2` on the footer nav. |
| 9 | Low | "40+ code reviews" wraps alone at 390. | Kept | Same as the home tile. |
| 10 | Low | Two long links at weight 550 make that paragraph heavy. | Fixed | 500. |
| 11 | Low | Copy: the "What I built" list is one long sentence; "a written plan I pushed back on" doesn't say whose. | For Dani | His approved words; not rewritten. |

### Round 5 build review, Impeccable finish review (2026-11-25)
Disposition: **fix**. Fidelity matched the contract and Dani's layout; three material fixes.

| # | Finding | Outcome |
|---|---|---|
| 1 | The commit links' arrow breaks badly (alone at 390; a gap before "," and "." at 1440). | Fixed: nowrap run; the icon's right side bearing trimmed. |
| 2 | The swap screenshot is cut at the top. | Fixed: `bitewise-swap-sheet-{light,dark}.png`, captured on the live demo (Try the demo, Today unscrolled, the sheet opened from Breakfast and closed; nothing swapped or reset), provenance embedded, SOURCES.md row. The home story keeps its frame. |
| 3 | DESIGN.md doesn't describe the reading level or the case-study layout. | Fixed: a Reading level in Typography and a paragraph in Layout. |
| – | Ceiling: no motion moment (the View Transition); no caption. | Caption added; the View Transition stays open (not in Dani's brief). |

Verdict pass over the recaptures: all three fixes **resolved**, no regressions seen; disposition **ship** (scoped to these fixes).

## Decided while Dani was away

- Theme follows the system with a remembered toggle, over dark-for-everyone: it respects the visitor's setting and is a one-line change (open question 3).
- Showed floors ("900+") over exact counts: the logs changed during this session.
- Used the iPhone camera frame for the scan step (round 2 tried a dark frame; round 3 went back to the light frame in both themes).
- Dropped the `motion` package: CSS covers every animation on this page.
- Named the network CRM "Orbit", its current committed name.
- Pinned story steps at 72svh (last 60svh), over 82svh: shorter gaps beside the pinned phone, still a comfortable scroll per step.
- Kept Geist despite Impeccable's "overused font" warning: the brief pins Geist + Geist Mono.
- Screenshots and checks run on `next build` + `next start`, not the dev server: Turbopack's watcher stopped picking up CSS edits in this session.
- Copied Impeccable's shipped agents (finish reviewer, documenter and three more) from `network-crm` into `.claude/agents/`, same version (0.1.27), so later sessions can use them.
- Left CLAUDE.md exactly as Dani wrote it, though its video path (`staple-loop-dark.mp4`) is now `bitewise-loop-dark.mp4` in the Bitewise repo, and it doesn't import the Next.js `AGENTS.md` the way the other repos do.
- Deferred the `light-dark()` fallback for iOS 16 (open question 5).
- Round 4: replaced Ascend's decision ("Streaks are derived, never stored") with the Climb line over keeping both, because a tile shows one decision and the new screenshot shows the Climb; the line still says altitude is derived "like streaks".
- Round 4: raised Ascend's test floors to 500+ and 90+ from the Feature 10 log (516 and 90), over leaving 370+ and 70+, since both counts are logged exactly; review-finding totals stay as true lower bounds (not recounted).
- Round 4: embedded each new screenshot's origin (the source file in habit-tracker or network-crm) and checked they're pixel-identical to those files.
- Round 5: made the links between the home page and the case study plain `<a>` (full page loads) over next/link plus focus management, because both pages are static and it removes the hidden-mounted-page problems at the root.
- Round 5: gave the case study its own link-preview image (its title, Bitewise's colour only) over the home page's, since a page-level `openGraph` drops the root image anyway.
- Round 5: captured a new swap frame from the live demo for the case study only (Try the demo, nothing swapped or reset) over cropping the old one, and left the home story's frame as it is.
- Round 5: made the hero-loop video test poll for the wrap instead of a fixed 1.2 s wait; it failed once on a busy machine and passed 18 of 18 on repeat.
