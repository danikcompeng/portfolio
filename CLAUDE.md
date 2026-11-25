# Portfolio: Dani Kainikkara

A landing page that works like a product launch page, with me as the
maker. Plan and research: `~/Documents/portfolio-research.md` (read it
first). A visual draft of the landing page exists as a Claude design
canvas; the sections below follow it.

## Sections (top to bottom)

1. Nav: name; Work, How I build, About, Resume.
2. Hero: "I design and ship real products." Tilted phone playing the
   Bitewise loop video (`~/Documents/meal-cost-tracker/design/videos/bitewise-loop-dark.mp4`).
   Buttons: See the work, Try Bitewise (https://trybitewise.vercel.app).
   Flat CSS-perspective phone first; a 3D (React Three Fiber) version only
   if time allows, lazy-loaded, with the flat one as the Reduce Motion and
   phone fallback.
3. Bitewise story: phone pinned while four steps scroll past (the
   problem, the swap, the scan, cost per serving).
4. Work grid: Bitewise (big tile, case study + live demo), Ascend
   (habit tracker, https://ascend-dk.vercel.app), Network CRM (when
   live). No budget tracker. Real screenshots
   from each repo's docs/screenshots. Anything I still have to supply
   (photos, resume) stays hidden behind a flag in content/site.ts; no
   [BRACKETS] in production.
5. How I build: plan → logic-checker → build → code-reviewer +
   design-critic → phone test → ship, with real numbers from the repos
   (tests, review findings).
6. About: TMU Computer Engineering, Toronto Humanoid Robotics Club,
   guitar. Engineering work and school only. Resume PDF, GitHub
   (danikcompeng), LinkedIn, email. No phone number.
7. Case study page /work/bitewise (Thursday).

## Stack and rules

Next.js (App Router), TypeScript, Tailwind, Framer Motion, Vercel.
Dark-first, near-black base, Geist + Geist Mono. Respect Reduce Motion,
4.5:1 text contrast, 44 px targets, works at 390 px wide. Never invent
numbers or claims. Never claim a project was built for a specific
company. Use the impeccable skill
for design work (/impeccable). Same reviewer workflow as my other
projects: plan in plans/portfolio.md, reviewer agents adapted from
~/Documents/habit-tracker/.claude/agents, Playwright screenshots at 390
and 1440 wide, light and dark.

## Address

The portfolio lives at https://danikainikkara.vercel.app (not the usual
`<name>-dk` pattern: this is the link on my resume and LinkedIn). If that
name is taken on Vercel, use dani-kainikkara.vercel.app and tell me. A custom
domain (danikainikkara.dev or .me, via the GitHub Student Pack) may be added
later; the vercel.app address must keep working.
