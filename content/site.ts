// Everything the page says lives here: copy, links and numbers.
//
// Rule: never invent numbers or claims. Each number below is a `Stat`: the page shows
// `floor` ("900+"), and `exact`, `asOf` and `source` say where it came from, so anyone
// can check it. The logs only grow, so a floor stays true (plans/portfolio.md, D9).
// Anything Dani still has to supply is a `[BRACKETED]` placeholder, rendered visibly.

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
  ascend: "https://ascend-dk.vercel.app",
  orbit: "https://orbit-dk.vercel.app",
} as const;

/** Things that don't exist yet. Flip when they do; until then nothing links to them. */
export const flags = {
  /** /work/bitewise, planned for Thursday 2026-11-26. */
  caseStudy: false,
  /** A resume PDF without the phone number, at /Dani-Kainikkara-Resume.pdf. */
  resumePdf: false,
} as const;

export const resumeHref = "/Dani-Kainikkara-Resume.pdf";

export const hero = {
  title: "I design and ship real products.",
  subline:
    "I'm Dani Kainikkara, a Computer Engineering student at TMU. I design, build and test apps end to end, with AI as a daily tool.",
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
      alt: "The camera scanner framing the barcode on a bag of bagels, with Type the number and Enter manually below.",
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
  decision: {
    title: "Streaks are derived, never stored",
    // habit-tracker plans/habit-tracker.md, Data rules
    body: "A stored streak drifts the first time an undo, a delete or a bug touches history.",
  },
  stats: {
    unitTests: {
      floor: 370,
      exact: 379,
      asOf: "2026-11-25",
      source: "habit-tracker plans/habit-tracker.md, Reviews, Feature 8b (379 unit and database tests)",
    },
    browserTests: {
      floor: 70,
      exact: 77,
      asOf: "2026-11-25",
      source: "habit-tracker plans/habit-tracker.md, Reviews, Feature 8b (77 browser tests)",
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
  decision: {
    title: "A map that stays put",
    // network-crm plans/crm.md, Feature 5 plan (paraphrased: the source says "on one device")
    body: "The map is a radial tree settled by a short physics run, so adding someone mostly moves only their branch.",
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

export const spotify = {
  name: "Spotify display",
  // Resume, Projects
  oneLiner:
    "Firmware that shows the current Spotify track and its progress in real time, with physical play, pause, previous and next buttons.",
  stack: ["ESP32", "C/C++", "Python"],
  when: "Sep 2026 – now",
  photo: "PHOTO: the display on your desk",
  repo: "LINK: ESP32 repo, if public",
};

export const racing = {
  name: "2-player racing game",
  oneLiner: "ONE-LINER: what the game is and what you built",
  stack: ["C#", "Unity"],
  when: "Jan – May 2025",
  media: "SCREENSHOT or CLIP: the game running",
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
  body: "I'm a first-year Computer Engineering student at Toronto Metropolitan University. Lately I've built a meal tracker, a habit tracker, a CRM for my internship search and a Spotify display with real buttons.",
  facts: [
    { label: "Studying", value: "Computer Engineering, Toronto Metropolitan University (expected 2030)" },
    { label: "Club", value: "Toronto Humanoid Robotics Club, team member" },
    // Resume / LinkedIn: "Served ~250 visitors daily at the Welcome Centre"
    { label: "Work", value: "Niagara Parks, seasonal guest services, 2023–2026: about 250 visitors a day at the Welcome Centre" },
    { label: "Music", value: "Guitar, RCM Level 5, after 8 years" },
  ],
  photo: "PHOTO: headshot",
  resume: "RESUME: PDF without the phone number",
};
