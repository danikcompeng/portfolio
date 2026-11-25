---
version: 1
slug: "app-work-bitewise-page-tsx"
primary_target: "app/work/bitewise/page.tsx"
related_targets: []
---

# Surface: Bitewise case study (`/work/bitewise`)

Mode: **Read**. The reader (a product or design-engineering lead, or a recruiter) clicked "Read the case study" on the Bitewise tile and wants to know how Dani thinks: the problem, what was built, the decisions, and how AI was used. They leave by trying the demo or reading the code.

- Proof: the real Today and swap screens, the tile's dated counts, and two catches linked to their commits.
- Constraints: Dani's approved words only (light edits); anything that can't be traced to meal-cost-tracker's README, plans, notes or commits is cut; every number from `content/site.ts` with its source; no label above a heading; 390 px to 1440 px, light and dark.
- Memorable moment: the page opens on Bitewise's own field with the real app in the phone, then goes quiet for reading.
- Unresolved: the View Transition between the home tile and this page (planned in section 1 of the plan, not in this brief).

## Direction contract

THESIS: A case study that opens like the product's own page and then reads like a letter: Bitewise's field and its real Today screen up top, then six short sections in Dani's words in one calm column. Refuses the template case study: a hero banner image, Challenge / Solution / Results cards, a big-number metric strip.

OWN-WORLD: The site's neutral stage (near-black / off-white) with one exception: the header tile on the Bitewise matcha field, its links in Bitewise's accent. Geist prose in ink at about 17 px with 1.65 line height on a 38rem measure; h2 at title size; Geist Mono only for the counts. The flat phone with a real bezel is the one lifted object; icons are the in-house 1.5-stroke set.

STORY: The reader learns the problem, sees what was built, understands the hardest decision (the swap ranking) and the missing-stays-missing rule, sees the reviewed AI workflow with two real catches linked to their fixes, and leaves to try the live demo or read the code.

FIRST VIEWPORT: Desktop 1440 x 900: slim nav; a full-width matcha tile. Left: the h1 "Bitewise: cheap meals that hit your macros" at section size over two lines, the three counts in mono, then Try the live demo, Code on GitHub and Full tour video. Right: the phone showing Today at about 290 px wide, most of it in view. Mobile 390: h1, counts and links, then the top of the phone above the fold.

FORM: A reading column with marginal screens: one column of sections, the swap phone beside its section at 1024 px and up, stacked after its text below that. seed: none (pinned): Dani chose "Text + 2 screens": "A header on Bitewise's matcha field with the Today screen in a phone, then your sections in a reading column; the swap cards sit beside the ranking section." (2026-11-25).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
