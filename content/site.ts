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
  // meal-cost-tracker README.md:10-12, "Full tour with a real iPhone scan" (the light one).
  bitewiseTour: "https://github.com/danikcompeng/meal-cost-tracker/blob/main/design/videos/bitewise-demo-light-real-scan.mp4",
  // The two code-reviewer catches, linked to their fixes as README.md:71-74 does.
  bitewiseFixFree: "https://github.com/danikcompeng/meal-cost-tracker/commit/599293a",
  bitewiseFixOvernight: "https://github.com/danikcompeng/meal-cost-tracker/commit/8ca92ae",
  ascend: "https://ascend-dk.vercel.app",
  orbit: "https://orbit-dk.vercel.app",
  // The full demo tours, in the theme the visitor sees: habit-tracker 2901fa6, network-crm ce70efc.
  ascendTour: {
    dark: "https://github.com/danikcompeng/habit-tracker/blob/main/design/videos/ascend-demo-dark.mp4",
    light: "https://github.com/danikcompeng/habit-tracker/blob/main/design/videos/ascend-demo-light.mp4",
  },
  orbitTour: {
    dark: "https://github.com/danikcompeng/network-crm/blob/main/design/videos/orbit-demo-dark.mp4",
    light: "https://github.com/danikcompeng/network-crm/blob/main/design/videos/orbit-demo-light.mp4",
  },
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
  secondary: { label: "Try Bitewise", href: links.bitewise },
  phoneCaption: "Bitewise · recorded on the live demo",
};

export const story = {
  name: "Bitewise",
  // meal-cost-tracker README.md:3
  oneLiner: "Cheap meals that hit your macros, on repeat, with a swap when you're bored.",
  steps: [
    {
      id: "problem",
      title: "The problem",
      // Dani's words, meal-cost-tracker README.md:17-19, shortened.
      body: "Calorie trackers don't know what food costs. Meal planners make up recipes with ingredients I don't have. Bitewise puts macros and money on one screen.",
      screen: "today",
      alt: "Bitewise's Today screen: 926 kcal left in a ring, protein, carbs, fat and water rings, and what today costs.",
    },
    {
      id: "swap",
      title: "The swap",
      // meal-cost-tracker CLAUDE.md (swap ranking), lib/entry-messages.ts (Undo).
      body: "Bored of a meal? Swipe through my own recipes, ranked by similar protein, foods I've had this week and cost, and swap it in place, with Undo.",
      screen: "swap",
      alt: "A swap card instead of Chicken rice bowl: Tuna rice, $2.01 per serving, 46 g protein, uses 3 foods you've had this week.",
    },
    {
      id: "scan",
      title: "The scan",
      // components/scan-flow.tsx: "From Open Food Facts · compare with the label".
      body: "Scan a barcode and Open Food Facts fills in what it knows. I check it against the label and add what I paid.",
      screen: "scan",
      alt: "The camera scanner framing the barcode on a bag of bagels.",
    },
    {
      id: "cost",
      title: "Cost per serving",
      // components/recipe-cost.tsx; "Missing stays missing", CLAUDE.md.
      body: "Every recipe comes down to one number, with protein per dollar. If a price is missing it shows a dash, never a lower number.",
      screen: "cost",
      alt: "The Chicken rice bowl recipe: $2.48 cost per serving, makes 4 servings, 22 g protein per dollar.",
    },
  ],
} as const;

export const bitewise = {
  name: "Bitewise",
  // A product line that isn't the story's one-liner again (design-critic and finish review 1).
  // Dani's own words in the career notes: "Macro tracking comes first, cost second."
  tileLine: "A meal tracker for the cheap meals I actually repeat: macros first, cost second.",
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
  decisions: [
    {
      title: "Missing stays missing",
      // CLAUDE.md, README.md:36-39
      body: "A number that looks right but quietly leaves something out is worse than no number, so an unknown price shows a dash.",
    },
    {
      title: "No Undo timer",
      // plans/polish.md
      body: "Web pages can't tell whether VoiceOver is on. Instead of guessing, Undo has no timer, for everyone.",
    },
  ],
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

export const build = {
  title: "How I build",
  intro:
    "On Ascend and Orbit, each feature is planned in writing. A logic-checker reviews the plan before any code; a code-reviewer, and a design-critic when a screen changes, review the build. All three are read-only AI agents: they report, I decide.",
  stats: {
    logicChecker: {
      floor: 180,
      exact: 184,
      asOf: "2026-11-25",
      source: "Ascend 98 + Orbit 86 logic-checker rows, in 9 + 6 plan reviews",
    },
    planReviews: {
      floor: 15,
      exact: 17,
      asOf: "2026-11-25",
      source: "logic-checker plan reviews at committed HEAD: Ascend 11 (F1-4, F5+6, F7, refinement, F8, 8b, 8c, 9), Orbit 6 (code-reviewer recount, review 1)",
    },
    codeReviewer: {
      floor: 140,
      exact: 148,
      asOf: "2026-11-25",
      source: "Ascend 83 + Orbit 65 code-reviewer rows",
    },
    designCritic: {
      floor: 160,
      exact: 169,
      asOf: "2026-11-25",
      source: "Ascend 87 + Orbit 82 design-critic rows",
    },
    findings: {
      floor: 500,
      exact: 501,
      asOf: "2026-11-25",
      source: "Ascend 268 + Orbit 233 numbered review rows",
    },
    fixed: {
      floor: 450,
      exact: 464,
      asOf: "2026-11-25",
      source: "Rows whose outcome starts with 'Fixed': Ascend 240 + Orbit 224",
    },
  } satisfies Record<string, Stat>,
  catches: [
    {
      agent: "logic-checker",
      app: "Ascend",
      severity: "High",
      // habit-tracker plans/habit-tracker.md, Feature 3 plan review, #2
      quote: "Holding Space: auto-repeat keydowns after 650 ms undo the habit just completed, then re-hold, flickering until release.",
    },
    {
      agent: "logic-checker",
      app: "Orbit",
      severity: "High",
      // network-crm plans/crm.md, Feature 3 plan review, #2
      quote: "Status matching undefined; substring matching turns “No offer” into an offer.",
    },
    {
      agent: "code-reviewer",
      app: "Orbit",
      severity: "High",
      // network-crm plans/crm.md, Feature 5 code-reviewer, #1
      quote: "Lifting the last, still finger of a pinch (or a two-finger tap) counted as a tap and opened a sheet; a right-click did too.",
    },
  ],
  footnote: "Counts from each repo's review logs and test runs on Nov 25, 2026, rounded down.",
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
    alt: "The swap sheet instead of Overnight oats: Egg fried rice first, $1.36 per serving, 21 g protein, uses 3 foods you've had this week.",
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
