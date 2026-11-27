# Portfolio: Dani Kainikkara

A landing page that works like a product launch page, with me as the
maker. Plan and research: `~/Documents/portfolio-research.md` (read it
first). A visual draft of the landing page exists as a Claude design
canvas; the sections below follow it.

## Sections (top to bottom)

1. Nav: name; Work, About, Resume (once the PDF exists).
2. Hero: "From idea to live app, end to end." and the subline, one
   button (See the work). Below it, three equal phones, Bitewise, Ascend
   and Orbit in that order, each playing its own loop from public/media
   (theme-matched, muted, inline, paused under Reduce Motion) with a
   caption and a pause button. Flat CSS phones with a gentle tilt, flat
   under Reduce Motion. A swipeable row on phones, three columns over the
   tiles from 1100 px. Only loops on screen load, and the side ones wait
   for Bitewise's to start.
3. Work: three tiles of the same size and layout, so none looks like the
   main project: Bitewise (https://trybitewise.vercel.app), Ascend
   (habit tracker, https://ascend-dk.vercel.app) and Orbit (network CRM,
   https://orbit-dk.vercel.app). Each has one line, its numbers, one
   decision, Open [app], Demo video (the full tour in an on-page dialog,
   starting after the login) and a cropped phone with a theme-matched
   still of a screen its hero loop doesn't show. Bitewise also links its
   case study. No budget tracker. Anything I still have to supply
   (photos, resume) stays hidden behind a flag in content/site.ts; no
   [BRACKETS] in production.
4. About: TMU Computer Engineering, Toronto Humanoid Robotics Club,
   guitar. Engineering work and school only. Resume PDF, GitHub
   (danikcompeng), LinkedIn, email. No phone number.
5. Case study page /work/bitewise (live).

No "How I build" section and no pinned Bitewise story: both were removed
on 2026-11-27 (plans/portfolio.md, rounds 10 and 11).

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
