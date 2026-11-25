# Product

<!-- impeccable:product-schema 1 -->

> Written by Claude on 2026-11-25 from `CLAUDE.md` and `~/Documents/portfolio-research.md`
> without an interview: Dani asked for the build to go ahead without waiting for
> approval. Facts marked *(inferred)* come from those files, not from an answer.

## Platform

web

## Users

- **Primary:** product and design-engineering leads (the first reader is a PM friend at a
  design-tooling company who asked to see the work) and recruiters for software, computer
  and electrical engineering internships. They open the link from a short message, usually once, on a laptop or a
  phone, and decide within a minute whether Dani can design and ship. *(inferred from the
  research file's goal and the career context)*
- **Secondary:** anyone Dani links from a resume, LinkedIn or GitHub.

## Product Purpose

A landing page that works like a product launch page, with Dani as the maker. It shows
what Dani builds (live products), proof the work is done well (decisions, tests, review
findings), and how to get in touch. Success: a visitor knows what Dani does within
seconds, tries Bitewise or reads the case study, and has an obvious way to reach out.

## Positioning

"From idea to live app, end to end." Every project on the page is live or physically built,
and the numbers come from the repos (tests, reviewer findings). The claim a template
portfolio can't copy: a first-year engineering student whose apps are live, built with
a written, reviewed AI workflow that is shown, not described.

## Operating Context

- Visitors arrive from a message or resume link; most landing traffic is mobile, so the
  page must work at 390 px and load fast on a phone.
- The live products open in new tabs: Bitewise (https://trybitewise.vercel.app, one-tap
  demo, no sign-up) and Ascend (https://ascend-dk.vercel.app).
- A Bitewise case study at `/work/bitewise` follows on Thursday 2026-11-26.

## Capabilities and Constraints

- Next.js (App Router), TypeScript, Tailwind, Motion (Framer Motion), deployed on Vercel.
- Flat CSS-perspective phone in the hero first; a 3D (React Three Fiber) phone only if time
  allows, lazy-loaded, never on phones or with Reduce Motion.
- Never invent numbers or claims. Anything Dani still has to supply (photos, the resume)
  stays hidden behind a flag until it exists; nothing bracketed or made up ships.
- The site covers engineering work and school only.
- Undecided: Network CRM appears only once it is live; the case study page; a phone-free
  resume PDF (the current one lists a phone number, so it cannot be published).

## Brand Commitments

- Name: Dani Kainikkara. GitHub `danikcompeng`, LinkedIn `dani-kainikkara-42824b395`.
- Dark-first, near-black base with a light mode; Geist and Geist Mono (binding, from
  `CLAUDE.md`).
- A neutral base so each project brings its own colour (from the research file).
- Never claim a project was built for a specific company.
- No phone number or personal details beyond a contact email.

## Evidence on Hand

- Bitewise: loop and demo videos in `~/Documents/meal-cost-tracker/design/videos/`,
  screenshots and plans in that repo.
- Ascend: screenshots in `~/Documents/habit-tracker/docs/screenshots/`, including
  `impeccable-before/` and `impeccable-after/`.
- Network CRM: screenshots in `~/Documents/network-crm/docs/screenshots/`.
- Reviewer logs with real findings in each repo's `plans/*.md`.
- **Absent, must not be fabricated:** a headshot, testimonials, usage numbers for any app.

## Product Principles

1. Show the thing working before describing it.
2. Every number has a source in a repo; no source, no number.
3. Skimmable in 60 seconds; reasoning one click deeper.
4. Craft is the argument: the page itself must meet the standard it claims.
5. One hero object, done well; no 3D or motion for its own sake.

## Accessibility & Inclusion

WCAG 2.2 AA: 4.5:1 text contrast, keyboard navigation, visible focus, 44 px targets,
alt text, a pause control on autoplaying video, and Reduce Motion respected everywhere.
