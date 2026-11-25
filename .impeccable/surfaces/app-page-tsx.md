---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface: landing page (`/`)

Mode: **Persuade**. The visitor (a product or design-engineering lead, or a recruiter, arriving from a message or resume link) should know within seconds who Dani is and what Dani ships, try Bitewise or look at the work, and leave with an obvious way to get in touch.

- Action: "Try Bitewise" (live demo, no sign-up) and "See the work"; the close is the email.
- Proof: live products, real recordings and screenshots, dated test and review counts with sources (plans/portfolio.md section 3).
- Constraints: never invent numbers or claims; placeholders stay visibly bracketed; no phone number; never claim a project was built for a specific company; 390 px to 1440 px; Reduce Motion respected.
- Memorable moment: the tilted phone in the hero straightens as you scroll and stays pinned while the four Bitewise steps pass and its screen changes.
- Unresolved: case study page (Thursday), resume PDF without a phone number, headshot and project photos.

## Direction contract

THESIS: The page is a neutral stage and the products bring the colour. One phone, the real Bitewise app, is the hero object and the first chapter of the proof. Refuses the template portfolio (name, skills list, grid of same-size project cards) and the SaaS split hero with a badge row.

OWN-WORLD: Near-black stage oklch(0.16 0.004 260) with one step-lighter raised surface and alpha hairlines; light counterpart off-white oklch(0.985 0.002 260) with near-black ink. No site accent: colour arrives only as each product's own field, Bitewise matcha, Ascend persimmon, Orbit blue, taken from their tokens. Geist display set large and tight; Geist Mono only for data, tabular. Concentric radii 8/14/22/30, in-house 1.5 px icons, a flat CSS phone with a real bezel.

STORY: The visitor sees a live product before a résumé, watches Bitewise solve a real problem in four steps, then meets three more things Dani built, a reviewed AI workflow with real counts and quoted catches, and a short about that ends on the email.

FIRST VIEWPORT: Desktop 1440 x 900: slim nav; left column h1 "I design and ship real products." at ~88 px over two lines, a two-line subline, then "See the work" (solid ink, primary) and "Try Bitewise" (outlined, opens the live app); right column the phone at ~75% of viewport height, tilted back in perspective, playing the Bitewise loop, a small mono label under it. Mobile 390: h1, subline, both buttons, then the phone's top edge above the fold.

FORM: Pinned launch page: hero and product story share one sticky phone that straightens on scroll; then a bento of product-tinted tiles, a drawn review pipeline, and an about that closes on contact. seed: none (pinned): "Dark-first, near-black base, Geist + Geist Mono" and "Hero: \"I design and ship real products.\" Tilted phone playing the Bitewise loop video" (CLAUDE.md); "A neutral, near-black/off-white base so each project brings its own colour" (portfolio-research.md).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
