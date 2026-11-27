---
name: Dani Kainikkara
description: A neutral near-black stage where each product brings its own colour, and one real phone carries the proof.
colors:
  bg: "light-dark(oklch(0.985 0.002 260), oklch(0.16 0.004 260))"
  bg-raised: "light-dark(oklch(1 0 0), oklch(0.2 0.005 260))"
  bg-sunk: "light-dark(oklch(0.955 0.003 260), oklch(0.135 0.004 260))"
  ink: "light-dark(oklch(0.2 0.006 260), oklch(0.96 0.003 260))"
  ink-muted: "light-dark(oklch(0.44 0.008 260), oklch(0.76 0.008 260))"
  line: "light-dark(oklch(0.2 0.01 260 / 0.11), oklch(1 0 0 / 0.09))"
  line-strong: "light-dark(oklch(0.2 0.01 260 / 0.22), oklch(1 0 0 / 0.18))"
  shadow-color: "light-dark(oklch(0.25 0.02 260 / 0.2), oklch(0 0 0 / 0.55))"
  bw-field: "light-dark(oklch(0.948 0.03 128), oklch(0.215 0.028 135))"
  bw-accent: "light-dark(oklch(0.44 0.09 130), oklch(0.7593 0.1016 136.4))"
  bw-line: "light-dark(oklch(0.44 0.09 130 / 0.24), oklch(0.76 0.1 136 / 0.2))"
  as-field: "light-dark(oklch(0.952 0.026 55), oklch(0.215 0.03 45))"
  as-accent: "light-dark(oklch(0.5 0.15 42), oklch(0.75 0.15 48))"
  as-line: "light-dark(oklch(0.5 0.15 42 / 0.24), oklch(0.75 0.15 48 / 0.2))"
  or-field: "light-dark(oklch(0.952 0.02 265), oklch(0.205 0.032 268))"
  or-accent: "light-dark(oklch(0.49 0.2 264), oklch(0.75 0.13 268))"
  or-line: "light-dark(oklch(0.49 0.2 264 / 0.22), oklch(0.75 0.13 268 / 0.2))"
  phone-body: "oklch(0.14 0.004 260)"
  phone-edge: "oklch(0.32 0.006 260)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.1rem + 5.2vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  section:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.35rem + 2.8vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 0.7vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.024em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 550
    lineHeight: 1
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "\"tnum\" 1"
rounded:
  tag: "6px"
  r-2: "14px"
  pill: "999px"
spacing:
  nav-height: "56px"
  gutter: "clamp(20px, 5vw, 80px)"
  content-max: "1280px"
  section-block: "clamp(96px, 12vw, 160px)"
  tile-pad: "clamp(22px, 3vw, 40px)"
  grid-gap: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.button}"
    rounded: "{rounded.r-2}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "light-dark(oklch(0.3 0.006 260), oklch(0.88 0.003 260))"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.r-2}"
    padding: "0 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.line}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    height: "44px"
  text-link-bitewise:
    textColor: "{colors.bw-accent}"
  text-link-ascend:
    textColor: "{colors.as-accent}"
  text-link-orbit:
    textColor: "{colors.or-accent}"
  media-button:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "44px"
  media-button-hover:
    backgroundColor: "{colors.bg-sunk}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    size: "44px"
  icon-button-hover:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
  nav:
    backgroundColor: "{colors.bg}"
    height: "{spacing.nav-height}"
  nav-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-small}"
    padding: "0 10px"
    height: "44px"
  nav-link-hover:
    textColor: "{colors.ink}"
  tile:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.ink}"
    padding: "{spacing.tile-pad}"
  tile-bitewise:
    backgroundColor: "{colors.bw-field}"
  tile-ascend:
    backgroundColor: "{colors.as-field}"
  tile-orbit:
    backgroundColor: "{colors.or-field}"
  phone:
    backgroundColor: "{colors.phone-body}"
---

# Design System: Dani Kainikkara

## Overview

**Creative North Star: "The Neutral Stage"**

The page is a launch stage with the house lights down. A near-black floor (light mode: an off-white one with near-black ink) carries no colour of its own. Colour walks on with each product, as that product's own field, hairline and link colour, lifted from its own design tokens. The hero objects are three real phones, one per app, each playing its app: flat CSS devices with a true bezel, tilted back in perspective, equal in size and order (round 10: no app is the main one).

Density is generous and editorial: large tight Geist headings, long measure-capped leads in a muted ink, and numbers set in Geist Mono as data rather than decoration. Surfaces are flat and separated by tone and alpha hairlines; the phone is the only thing that casts a shadow. Motion is short and soft (one ease-out curve, 160 to 560 ms), comes from scroll and press, and disappears under Reduce Motion. Dark is the first theme; light is a full counterpart, and both resolve from one `light-dark()` token each.

The system refuses the template portfolio (name, skills list, a grid of cards that show no real product) and the SaaS split hero with a badge row.

**Key Characteristics:**
- Neutral stage, hue 260 at near-zero chroma; no site accent.
- Product colour only as a field, line and accent scoped to that product (Bitewise matcha, Ascend persimmon, Orbit blue).
- Geist set large and tight at weight 600; Geist Mono only for data, tabular.
- Flat, tonal layering with alpha hairlines; one lifted object, the phone.
- Concentric corners: an outer radius is the inner radius plus the padding between them.
- In-house 1.5-stroke line icons on a 24-unit grid.
- Nothing unsupplied ships: a missing photo or file hides its slot until it exists.

## Colors

A cool, almost colourless neutral stage, with three borrowed product palettes that appear only inside their own product.

### Primary
- **Stage Ink** (`ink`): the one action colour. Text, the solid primary button, the focus ring, form accent and caret. The site's strongest mark is ink on the page colour, never a hue.

### Neutral
- **Night Stage / Paper Stage** (`bg`): the page floor; the near-black base in dark, off-white in light.
- **Raised Step** (`bg-raised`): one step lighter (pure white in light mode). Neutral tiles and media buttons.
- **Sunk Step** (`bg-sunk`): one step deeper. Media-button hover.
- **Muted Ink** (`ink-muted`): sublines, leads, labels, captions, nav links at rest. Holds 4.5:1 on every surface, product fields included.
- **Hairline** (`line`) and **Strong Hairline** (`line-strong`): alpha borders that tint whatever they sit on. `line` divides sections and backs hover fills; `line-strong` outlines secondary buttons and media buttons.
- **Shadow Tint** (`shadow-color`): used only in the phone's cast shadow.
- **Phone Body** (`phone-body`) and **Phone Edge** (`phone-edge`): fixed dark values, the same in both themes, because the device is a dark object like the real thing.

### Product Fields (borrowed, never the site's own)
- **Matcha Field / Matcha** (`bw-field`, `bw-accent`, `bw-line`): Bitewise, from meal-cost-tracker's DESIGN.md. The Bitewise tile and its links only.
- **Persimmon Field / Persimmon** (`as-field`, `as-accent`, `as-line`): Ascend, from habit-tracker's DESIGN.md. The Ascend tile and its links only.
- **Orbit Field / Orbit Blue** (`or-field`, `or-accent`, `or-line`): Orbit, from network-crm's globals. The Orbit tile and its links only.

### Named Rules
**The Borrowed Colour Rule.** The site owns no accent. Colour enters only as a product's field, line and accent, taken from that product's own tokens and scoped to that product's tile. A project without its own palette gets a neutral `bg-raised` tile.

**The Ink Action Rule.** The primary action is solid ink on the page colour. Inside a product tile, links take that product's accent through `--accent`; everywhere else they are ink.

**The One Line Per Token Rule.** Every theme-dependent colour is a single `light-dark(<light>, <dark>)` declaration resolved by `color-scheme`. No dark-mode override blocks. `lib/palette.test.ts` reads these lines and checks every text colour on every surface at 4.5:1, so keep each token on one line in that shape.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace, monospace)

**Character:** One family doing two jobs: Geist at 600 with tracking that tightens as size grows reads as a confident product headline, and Geist Mono at a small size says "this is a measured fact". Binding by brand commitment (CLAUDE.md).

### Hierarchy
- **Display** (600, 44 to 88 px fluid, 0.98): the hero h1 only, capped near 16ch.
- **Headline / Section** (600, 36 to 60 px fluid, 1.02): every section h2 (Work, About, Say hello).
- **Title** (600, 24 to 32 px fluid, 1.1): tile names and the case study's section heads.
- **Lead** (400, 17 to 20 px fluid, 1.55): sublines and tile one-liners. Measure-capped at 30 to 44rem.
- **Body** (400, 17 px, 1.6): running text and about facts.
- **Reading** (400, 17 px, 1.65, in full ink, 38rem measure): the case study's prose (`.cs-prose`); its inline links take 500 and a 35% underline, their arrow kept with the last word.
- **Body Small** (400, 15 px): nav links, decision bodies, fact labels, figure captions. Small headings at this size (decision titles) take 600 and -0.01em.
- **Caption** (400, 14 px): footer and footnotes.
- **Button** (550, 16 px, 1): buttons and text links.
- **Data** (Geist Mono 400, 13 px, 1.5, tabular figures): counts, the case study's phone caption, tile metadata. A count beside its label is set at 15 px, weight 500, in full ink, with the label in muted body-small.

### Named Rules
**The Mono Means Data Rule.** Geist Mono appears only where the content is data: numbers, metadata, recorded-on captions. Always tabular. Never for prose or the heading levels.

**The Tightening Scale Rule.** All three heading steps are weight 600, and tracking tightens as size grows (-0.024em at title to -0.038em at display), with line height falling toward 1.

## Layout

One centred column, `content-max` wide with a fluid `gutter` on each side. Sections breathe on `section-block` padding top and bottom. The nav is a 56 px sticky bar.

The hero is the text (h1, subline, one button), then the three phones in Work's order, each with its caption (the app's name in ink, what the loop shows in muted body-small) and a pause button below it. Below 1100 px they are a full-bleed row that snaps phone by phone (each `min(64vw, 300px)`), the next phone peeking in; from 1100 px they take Work's three columns at 280 px, so each phone stands over its tile. A loop loads only once its phone is mostly inside the row.

Work is three tiles of the same size from 1100 px (three columns, 20 px gap), sharing six subgrid rows so names, lines, facts, decisions, links and phones line up; one column below. Each tile ends in a phone cropped by its bottom edge, showing a theme-matched still of a screen the hero loop doesn't feature. **Demo video** opens a native modal dialog: a dimmed backdrop, the tour in a phone as tall as the window allows, a 44 px close button top right; Esc or a click outside closes it and focus returns to the button. About is 4 + 8 columns when the headshot exists (photo last on narrow screens), one column until then; it closes on a hairline and a large email link.

The case study (`/work/bitewise`) opens on a full-width product tile (title, mono facts, links, the phone), then one 38rem reading column of h2-at-title sections. At 1024 px and up the column starts inside the tile's padding, in line with the h1, and a phone screen sits in the second column beside the section it illustrates (the swap, beside the ranking and the two sections after it), up to 340 px wide and never wider than that column, with a mono caption; below 1024 px it follows its section's text.

Breakpoints in use: 640 px (two-up decisions in a one-column tile), 768 px (wide nav links), 1024 px (case study columns), 1100 px (three tiles, three hero phones). Everything works at 390 px wide; the body clips horizontal overflow.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (`bg-sunk` below the page, `bg-raised` and product fields above it) and alpha hairlines that tint whatever they cross. The phone is the one lifted object, and its depth is physical: an inner edge ring, a faint top highlight, a dark-mode outer ring, a tight contact shadow and a long soft cast shadow. The nav gains a translucent blurred ground (78% page colour, 14 px blur) only once the page scrolls, driven by the scroll timeline where supported.

### Shadow Vocabulary
- **Phone body** (`box-shadow: inset 0 0 0 1px var(--phone-edge), inset 0 1px 0 1px oklch(1 0 0 / 0.06), 0 0 0 1px light-dark(oklch(0 0 0 / 0), oklch(1 0 0 / 0.08)), 0 2px 4px -1px var(--shadow-color), 0 32px 64px -24px var(--shadow-color)`): the phone, everywhere it appears.

### Named Rules
**The One Lifted Object Rule.** Only the phone casts a shadow. Tiles, buttons and the nav stay flat and separate by tone and hairline.

## Shapes

Soft, concentric corners. The working radius is 14 px (`r-2`): buttons, photos, the skip link, and the inner media radius that tiles are built around. Small marks take 6 px (`tag`: the focus ring); round controls are full pills. The phone's corners derive from its width (screen radius 12.8% of width, bezel 3.2%). Borders are 1 px solid hairlines. Icons are drawn in-house on a 24-unit grid, 1.5 stroke, round caps and joins.

The token scale also declares 8, 22 and 30 px (`--r-1`, `--r-3`, `--r-4`); no built surface uses them yet.

**The Concentric Corner Rule.** An outer radius equals the inner radius plus the space between them: tile radius = 14 px + tile padding; phone radius = screen radius + bezel.

## Components

### Buttons
Solid, quiet and finger-sized.
- **Shape:** gently rounded (14 px), 48 px tall, 20 px side padding, 8 px icon gap, weight 550.
- **Primary:** solid ink with page-coloured text; hover steps one notch toward the middle grey.
- **Secondary:** transparent with a 1 px `line-strong` outline and ink text; hover fills with `line`. Used for "Try Bitewise" (with the up-right arrow) and "Copy email" (copy and check icons).
- **Press:** every pressable scales to 0.97 over 160 ms on the ease-out curve; colours transition over 240 ms. No scale under Reduce Motion.
- **Focus:** a 2 px ink outline, 3 px offset, 6 px radius, on every focusable element.

### Text Links
Underlined at 35% of the text colour, solid on hover, weight 550, 44 px tall, with the in-house up-right arrow when they open a new tab. In a product tile they take that product's accent; elsewhere they are ink.

### Media and Icon Buttons
44 px circles. The media (pause/play) button sits on `bg-raised` with a `line-strong` ring and sinks to `bg-sunk` on hover; it accompanies every autoplaying video. The theme toggle is borderless muted ink that gains a `line` fill and full ink on hover.

### Navigation
A 56 px sticky bar: the name at 15 px weight 600 on the left, body-small muted links on the right that turn ink on hover, then the theme toggle. Resume appears from 768 px once it exists, and is repeated in the footer. A translucent blurred ground fades in over the first 32 px of scroll.

### Product Tiles
- **Corner Style:** concentric (14 px + padding).
- **Background:** the product's field (`bw-field`, `as-field`, `or-field`), or `bg-raised` for a project with no palette.
- **Border:** 1 px of the product's line, or `line`.
- **Internal Padding:** `tile-pad`, fluid 22 to 40 px.
- **Content:** title, lead one-liner, mono facts, a decision, links (Demo video among them), then the cropped still. On hover or focus of a link inside, the still rises 2 px.

### The Phone (signature)
A flat CSS device sized by one variable, `--phone-w`: a dark body with a real bezel, concentric corners and the one shadow stack, around a 393 x 852 screen. Screens are stacked layers that cross-fade over 420 ms; theme-paired screenshots show only the current theme's copy. The three hero phones hold the same gentle fixed tilt (rotateY -10deg, rotateX 6deg); under Reduce Motion they are flat. Tile and case-study phones are flat.

### Missing material
Anything still to be supplied (a headshot, the resume) is switched off by a flag in `content/site.ts` and leaves no trace on the page; `scripts/check-built-html.mjs` fails the build if a "[" ever reaches visible text. Never filled with invented material.

### Reveal
Content that starts below the fold fades in from 0.97 scale over 560 ms once, with up to a few 60 to 80 ms staggers. Nothing visible at load is hidden; under Reduce Motion nothing is hidden.

## Do's and Don'ts

### Do:
- **Do** give every new colour one `light-dark()` line in `:root` and add its text pairs to `lib/palette.test.ts` at 4.5:1 (3:1 for non-text marks).
- **Do** bring a new project's colour from its own tokens as a `-field`, `-accent` and `-line` triple, and scope it to that project's tile.
- **Do** set every count in Geist Mono with tabular figures, in full ink beside a muted label.
- **Do** build radii concentrically: outer = inner + padding.
- **Do** keep every target at least 44 px and pair every autoplaying video with a pause button.
- **Do** route all motion through `--ease-out` and the four durations (160, 240, 420, 560 ms), and drop transforms under Reduce Motion.
- **Do** hide missing material behind its flag until the real file exists.

### Don't:
- **Don't** introduce a site accent or tint the stage; the products are the only colour.
- **Don't** use a product's colour outside its own tile.
- **Don't** cast a shadow from anything but the phone.
- **Don't** set prose or the display, section, step or title levels in Geist Mono; the only mono headings are agent names, which are identifiers.
- **Don't** use icon fonts or third-party icon sets; draw icons on the 24-unit, 1.5-stroke grid.
- **Don't** fall back to a grid of same-size project cards or a split hero with a badge row.
