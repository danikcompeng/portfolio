// Static imports give next/image the real sizes. Provenance is embedded in each file and
// listed in public/media/SOURCES.md.
import ascendPosterDark from "@/public/media/ascend-loop-poster-dark.png";
import ascendPosterLight from "@/public/media/ascend-loop-poster-light.png";
import costDark from "@/public/media/bitewise-cost-dark.png";
import costLight from "@/public/media/bitewise-cost-light.png";
import loopPosterDark from "@/public/media/bitewise-loop-poster-dark.png";
import loopPosterLight from "@/public/media/bitewise-loop-poster-light.png";
import tourPosterDark from "@/public/media/bitewise-tour-poster-dark.png";
import tourPosterLight from "@/public/media/bitewise-tour-poster-light.png";
import scan from "@/public/media/bitewise-scan.png";
import swapDark from "@/public/media/bitewise-swap-dark.png";
import swapLight from "@/public/media/bitewise-swap-light.png";
import swapSheetDark from "@/public/media/bitewise-swap-sheet-dark.png";
import swapSheetLight from "@/public/media/bitewise-swap-sheet-light.png";
import todayDark from "@/public/media/bitewise-today-dark.png";
import todayLight from "@/public/media/bitewise-today-light.png";
import orbitPosterDark from "@/public/media/orbit-loop-poster-dark.png";
import orbitPosterLight from "@/public/media/orbit-loop-poster-light.png";

export const screens = {
  today: { dark: todayDark, light: todayLight },
  swap: { dark: swapDark, light: swapLight },
  // One frame in both themes: the light recording's full-bleed camera view (round 3).
  scan,
  cost: { dark: costDark, light: costLight },
} as const;

export const loop = {
  sources: { dark: "/media/bitewise-loop-dark.mp4", light: "/media/bitewise-loop-light.mp4" },
  posters: { dark: loopPosterDark, light: loopPosterLight },
  /** The poster frame: Today, settled, past the login screen and its crossfade. */
  start: 4.6,
};

export const tour = {
  sources: { dark: "/media/bitewise-tour-dark.mp4", light: "/media/bitewise-tour-light.mp4" },
  // The Recipes list: a part of the tour the story above doesn't show.
  posters: { dark: tourPosterDark, light: tourPosterLight },
  start: 51.8,
  /** After the first pass, loop from Today (past the login). */
  loopFrom: 5,
};

/** The case study's swap: the sheet opened with the page unscrolled, so the screen's top is intact. */
export const swapSheet = { dark: swapSheetDark, light: swapSheetLight };

/** Ascend's loop: holding the habits until the Summit card (habit-tracker 2901fa6). */
export const ascendLoop = {
  sources: { dark: "/media/ascend-loop-dark.mp4", light: "/media/ascend-loop-light.mp4" },
  posters: { dark: ascendPosterDark, light: ascendPosterLight },
  /** The poster frame: Today, just past the recording's fade-in. */
  start: 1,
  /** Each loop replays the fade-in after the fade-out. */
  loopFrom: 0,
};

/** Orbit's loop: the 3D map turning and growing (network-crm ce70efc). */
export const orbitLoop = {
  sources: { dark: "/media/orbit-loop-dark.mp4", light: "/media/orbit-loop-light.mp4" },
  posters: { dark: orbitPosterDark, light: orbitPosterLight },
  /** The poster frame: the whole map, with no touch marker on screen (the first seconds have one). */
  start: 10,
  loopFrom: 0,
};
