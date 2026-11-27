// Everything the page says lives here: copy, links and numbers.
//
// Rule: never invent numbers or claims. Each number below is a `Stat`: the page shows
// `floor` ("900+"), and `exact`, `asOf` and `source` say where it came from, so anyone
// can check it. The logs only grow, so a floor stays true (plans/portfolio.md, D9).
// Nothing unsupplied ships: anything Dani still has to supply (a photo, the resume) stays
// hidden behind a flag below until it exists. `scripts/check-built-html.mjs` fails the
// build if a "[" placeholder ever reaches the page.

export type Stat = {
  /** What the page shows, e.g. 900 → "900+". */
  floor: number;
  /** The value counted on `asOf`. */
  exact: number;
  asOf: string;
  /** Repo-relative file and section, and how it was counted. */
  source: string;
};

export const fmt = (s: Stat) => `${s.floor.toLocaleString("en-CA")}+`;

export const links = {
  email: "danikainikkara@gmail.com",
  github: "https://github.com/danikcompeng",
  linkedin: "https://www.linkedin.com/in/dani-kainikkara-42824b395/",
  bitewise: "https://trybitewise.vercel.app",
  bitewiseCode: "https://github.com/danikcompeng/meal-cost-tracker",
  // meal-cost-tracker README.md:10-12, "Full tour with a real iPhone scan" (the light one):
  // the case study's "Full tour video". The home page plays the tours itself (Demo video).
  bitewiseTour: "https://github.com/danikcompeng/meal-cost-tracker/blob/main/design/videos/bitewise-demo-light-real-scan.mp4",
  // The two code-reviewer catches, linked to their fixes as README.md:71-74 does.
  bitewiseFixFree: "https://github.com/danikcompeng/meal-cost-tracker/commit/599293a",
  bitewiseFixOvernight: "https://github.com/danikcompeng/meal-cost-tracker/commit/8ca92ae",
  ascend: "https://ascend-dk.vercel.app",
  orbit: "https://orbit-dk.vercel.app",
} as const;

/**
 * Things that don't exist yet. Flip one to true once its file is in place; until then
 * nothing shows or links to it (content/site.test.ts checks the file exists when on).
 */
export const flags = {
  /** /work/bitewise (app/work/bitewise/page.tsx), approved by Dani 2026-11-25. */
  caseStudy: true,
  /** A resume PDF without the phone number, at public/Dani-Kainikkara-Resume.pdf. */
  resumePdf: false,
  /** A headshot for About, at public/media/headshot.jpg (4:5). */
  headshot: false,
} as const;

export const resumeHref = "/Dani-Kainikkara-Resume.pdf";
export const headshotSrc = "/media/headshot.jpg";

export const hero = {
  title: "From idea to live app, end to end.",
  subline:
    "I'm Dani Kainikkara, a Computer Engineering student at Toronto Metropolitan University. I\u00a0design, build and test every part myself, with AI as a daily tool.",
  primary: { label: "See the work", href: "#work" },
};

/** The swap sheet, opened on the live demo: the case study's figure. */
const swapSheetAlt =
  "The swap sheet instead of Overnight oats: Egg fried rice first, $1.36 per serving, 21 g protein, uses 3 foods you've had this week.";

export const bitewise = {
  name: "Bitewise",
  // A product line, not the README's one-liner (design-critic and finish review 1).
  // Dani's own words in the career notes: "Macro tracking comes first, cost second."
  tileLine: "A meal tracker for the cheap meals I actually repeat: macros first, cost second.",
  // public/media/bitewise-loop-*.mp4: shots 1 and 4 of meal-cost-tracker e2e/record-demo.ts.
  video: {
    caption: "Today's rings, then a swap",
    alt: "A recording of Bitewise's Today screen on the demo account: the calorie, protein, carbs, fat and water rings fill, then I'm tired of this on lunch skips one suggestion, swaps in the next and undoes it.",
  },
  // The tile's still: a recipe's cost per serving (public/media/bitewise-cost-*, round 11), a
  // screen the hero loop doesn't show.
  still: {
    alt: "The Chicken rice bowl recipe: $2.48 cost per serving, makes 4 servings, 22 g protein per dollar; sugar, fiber, sat fat and sodium show dashes, as unknown.",
  },
  // The case study's first screen.
  screens: {
    today: {
      alt: "Bitewise's Today screen: 926 kcal left in a ring, protein, carbs, fat and water rings, and what today costs.",
    },
  },
  stats: {
    unitTests: {
      floor: 900,
      exact: 917,
      asOf: "2026-11-24",
      source: "meal-cost-tracker plans/impeccable.md, last recorded Vitest run (917 passed, 37 files)",
    },
    e2eTests: {
      floor: 7,
      exact: 7,
      asOf: "2026-11-24",
      source: "meal-cost-tracker plans/impeccable.md, same run (7 passed)",
    },
    plans: {
      floor: 14,
      exact: 14,
      asOf: "2026-11-25",
      source: "meal-cost-tracker plans/*.md, committed and pushed at 8756f90 (the README's \"13 plans\" predates one); shown exactly in the case study",
    },
    codeReviews: {
      floor: 40,
      exact: 45,
      asOf: "2026-11-25",
      source: "meal-cost-tracker .claude/agent-memory/code-reviewer/review-history.md, lines starting '- 2026-'",
    },
  } satisfies Record<string, Stat>,
  // One decision per tile, like Ascend and Orbit (round 11).
  decision: {
    title: "Missing stays missing",
    // CLAUDE.md, README.md:36-39; the dash: components/recipe-cost.tsx:11 ("Unknown cost: a big
    // '—' ... never a lower number")
    body: "A number that looks right but quietly leaves something out is worse than no number, so an unknown price shows a dash.",
  },
};

export const ascend = {
  name: "Ascend",
  // habit-tracker CLAUDE.md:5, DESIGN.md:3
  oneLiner: "A habit tracker you press like a physical key.",
  // habit-tracker README.md
  detail: "Hold a habit for 0.65 s to complete it; tap a done one to undo.",
  // public/media/ascend-loop-*.mp4: what the recording shows (habit-tracker 2901fa6).
  video: {
    caption: "Holding habits to the Summit",
    alt: "A recording of Ascend's Today screen: three habits held one after another, the hot-air balloon climbing from 8,763 m above the clouds until a New zone: Summit card appears.",
  },
  // public/media/ascend-climb-*.png (habit-tracker docs/screenshots/feature-10/climb-top-*).
  still: {
    alt: "Ascend's Climb screen: altitude 8,763 m, above the clouds, 85 m to Summit, with the climb scrolled up into deep space: pixel planets and stars past the 42,500 m and 45,000 m marks.",
  },
  decision: {
    title: "A climb that never slips",
    // habit-tracker plans/habit-tracker.md, Feature 10 rules 1-2 and "Consequences" (at most 150 m a day)
    body: "Altitude is derived from check-ins, like streaks: each day climbs by the share of habits done, up to 150 m, and a missed day never costs any.",
  },
  stats: {
    unitTests: {
      floor: 600,
      exact: 608,
      asOf: "2026-11-26",
      source: "habit-tracker plans/habit-tracker.md, Reviews, Feature 10g final checks (608 unit and database tests), commit 5d9acb6",
    },
    browserTests: {
      floor: 90,
      exact: 95,
      asOf: "2026-11-26",
      source: "habit-tracker plans/habit-tracker.md, Reviews, Feature 10g final checks (browser suite on the production build: 95 passed), commit 5d9acb6",
    },
    findings: {
      floor: 260,
      exact: 268,
      asOf: "2026-11-25",
      source: "habit-tracker plans/habit-tracker.md, Reviews: numbered rows under logic-checker (98), code-reviewer (83), design-critic (87); a stricter parse of committed HEAD gave 285",
    },
  } satisfies Record<string, Stat>,
};

export const orbit = {
  name: "Orbit",
  // network-crm README.md:3-5, shortened
  oneLiner: "A personal CRM for an internship search, with a map of who introduced you to whom.",
  // public/media/orbit-loop-*.mp4: what the recording shows (network-crm ce70efc).
  video: {
    caption: "The 3D map, turning and growing",
    alt: "A recording of Orbit's 3D map on the demo account: you as a planet in the centre and 20 demo contacts on tilted rings, turned with a drag, then Watch it grow replaying the network from Sep 27 to today.",
  },
  // public/media/orbit-person-*.png: the live demo's page for Grace Liu (2026-11-27).
  still: {
    alt: "Orbit's page for Grace Liu, a demo contact: Hardware Engineering Intern at Halcyon Labs, Talking, next follow-up in 5 days, introduced through Elena Marsh, met as Elena's student last year.",
  },
  decision: {
    title: "A map that stays put",
    // network-crm plans/crm.md, Feature 7 plan, Angles ("Pure and deterministic, no force run")
    body: "Each ring is an introduction depth and each person sits at their branch's angle, with no physics run, so the same network always draws the same way.",
  },
  stats: {
    unitTests: {
      floor: 500,
      exact: 527,
      asOf: "2026-11-24",
      source: "network-crm plans/crm.md, Reviews, Feature 5 code-reviewer 'Tests' row (527 unit tests, 29 e2e); no later count recorded",
    },
    findings: {
      floor: 230,
      exact: 233,
      asOf: "2026-11-25",
      source: "network-crm plans/crm.md, Reviews at committed HEAD: logic-checker 86, code-reviewer 65, design-critic 82",
    },
  } satisfies Record<string, Stat>,
};

export const about = {
  title: "About",
  body: "I'm a first-year Computer Engineering student at Toronto Metropolitan University. Lately I've built a meal tracker, a habit tracker and a CRM for my internship search.",
  facts: [
    { label: "Studying", value: "Computer Engineering, Toronto Metropolitan University (expected 2030)" },
    { label: "Club", value: "Toronto Humanoid Robotics Club, team member" },
    { label: "Music", value: "Guitar, RCM Level 5, after 8 years" },
  ],
  photoAlt: "Dani Kainikkara",
};

/**
 * The Bitewise case study (/work/bitewise): Dani's approved draft
 * (claude-inbox/portfolio/02-bitewise-case-study.md), light edits only. Sources are in
 * ~/Documents/meal-cost-tracker. A paragraph is a list of parts: text, *emphasis*, or a
 * link. Anything that couldn't be traced was cut (plans/portfolio.md, Round 5).
 */
export type Part = string | { em: string } | { text: string; href: string };

export const caseStudy = {
  // README.md:3, "Cheap meals that hit your macros, on repeat"
  title: "Bitewise: cheap meals that hit your macros",
  metaTitle: "Bitewise case study · Dani Kainikkara",
  // public/media/SOURCES.md, bitewise-swap-sheet-*: what the frame shows.
  swapFigure: {
    alt: swapSheetAlt,
    caption: "The swap · captured on the live demo",
  },
  metaDescription:
    "How I built Bitewise, a meal tracker for cheap meals that hit your macros: the problem, the swap ranking, and building it with Claude Code and a code-reviewer agent.",
  sections: [
    {
      id: "problem",
      title: "The problem",
      // README.md:16-19 (Why)
      body: [
        [
          "I live on my own and repeat a few cheap meals that hit my protein. Calorie trackers don't know what food costs, and meal planners suggest recipes with ingredients I don't have. I wanted one screen with macros and money, and a way to swap a meal I'm sick of for another of ",
          { em: "mine" },
          " with the same protein, at the price I actually paid.",
        ],
      ] as Part[][],
    },
    {
      id: "built",
      title: "What I built",
      // README.md:5-6 (home screen), 23-32 (What it does). A list at Dani's request (round 6).
      body: [["A mobile-first web app you can install on your home screen:"]] as Part[][],
      list: [
        "Today's meals as rings for calories, protein, carbs, fat and water, plus what the day cost.",
        "Recipes with cost and protein per dollar per serving.",
        "Barcode scanning with Open Food Facts.",
        "The “I'm tired of this” swap.",
      ],
    },
    {
      id: "ranking",
      title: "The hardest decision: the swap ranking",
      // README.md:40-43; plans/swap.md section 2 ("pure, tested"). Cut, untraceable: "so I
      // could change the rules without breaking the screen". "Hardest" is Dani's own call.
      body: [
        [
          "It works like a spreadsheet sort: protein first, then how many foods you'd have to buy, then cost, then what you've eaten lately. Each column is a coarse group (protein “within 15%”, not exact grams), so later columns still get a say. It's a pure function with its own tests.",
        ],
      ] as Part[][],
    },
    {
      id: "missing",
      title: "A rule I kept everywhere: missing stays missing",
      // README.md:36-39; CLAUDE.md ("one rule, everywhere"; feature 4: "a food you haven't
      // bought shows 'no price yet', never a guess and never $0"). Dani's wording, kept: it's
      // the app's rule (components/amount-preview.tsx), though today every food has a price.
      body: [
        [
          "A food with no price shows “no price yet”, never $0. A recipe with one unknown sodium value shows a dash and names the food. A number that looks right but quietly leaves something out is worse than no number.",
        ],
      ] as Part[][],
    },
    {
      id: "how",
      title: "How I built it",
      // The plan sentence is Dani's (round 6); CLAUDE.md: "propose a short plan and wait for
      // my approval"; the count is bitewise.stats.plans. README.md:60-74; catches:
      // notes.md:96-102, commits 599293a and 8ca92ae. Cut, can't be
      // backed: "checked every change before it was committed" (45 reviews over ~200 commits;
      // notes.md:95 says every feature since the agent existed). The count is the tile's.
      body: [
        [
          `Features started as a plan Claude Code wrote and I pushed back on before any code existed; ${bitewise.stats.plans.floor} of those plans are in the repo. A read-only code-reviewer agent caught real bugs before I committed them, like `,
          { text: "a package size of 0 making a food look free", href: links.bitewiseFixFree },
          ", and ",
          { text: "an app left open overnight logging breakfast to yesterday", href: links.bitewiseFixOvernight },
          ".",
        ],
        [`${fmt(bitewise.stats.unitTests)} unit tests cover the maths, validation, ranking and colour contrast.`],
      ] as Part[][],
    },
    {
      id: "next",
      title: "What I'd do next",
      // README.md:44-46 ("Until I track purchases"); CLAUDE.md feature 4 (What's in my kitchen).
      body: [
        [
          "Track purchases, so “foods you have” can mean what's actually in your kitchen, not what you logged this week.",
        ],
      ] as Part[][],
    },
  ],
};
