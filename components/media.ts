// Static imports give next/image the real sizes. Provenance is embedded in each file and
// listed in public/media/SOURCES.md.
import ascendClimbDark from "@/public/media/ascend-climb-dark.png";
import ascendClimbLight from "@/public/media/ascend-climb-light.png";
import ascendPosterDark from "@/public/media/ascend-loop-poster-dark.png";
import ascendPosterLight from "@/public/media/ascend-loop-poster-light.png";
import loopPosterDark from "@/public/media/bitewise-loop-poster-dark.png";
import loopPosterLight from "@/public/media/bitewise-loop-poster-light.png";
import swapSheetDark from "@/public/media/bitewise-swap-sheet-dark.png";
import swapSheetLight from "@/public/media/bitewise-swap-sheet-light.png";
import todayDark from "@/public/media/bitewise-today-dark.png";
import todayLight from "@/public/media/bitewise-today-light.png";
import orbitPersonDark from "@/public/media/orbit-person-dark.png";
import orbitPersonLight from "@/public/media/orbit-person-light.png";
import orbitPosterDark from "@/public/media/orbit-loop-poster-dark.png";
import orbitPosterLight from "@/public/media/orbit-loop-poster-light.png";

export type Loop = {
  sources: { dark: string; light: string };
  posters: { dark: typeof loopPosterDark; light: typeof loopPosterLight };
  /** The poster frame, where playback starts. */
  start: number;
  /** Where each loop restarts (default: `start`). */
  loopFrom?: number;
};

/** The case study's Today screen. */
export const screens = {
  today: { dark: todayDark, light: todayLight },
} as const;

/** Bitewise's loop: Today's rings, then a swap and Undo (meal-cost-tracker record-demo shots 1 + 4). */
export const bitewiseLoop: Loop = {
  sources: { dark: "/media/bitewise-loop-dark.mp4", light: "/media/bitewise-loop-light.mp4" },
  posters: { dark: loopPosterDark, light: loopPosterLight },
  /** The poster frame: Today, settled, past the login screen and its crossfade. */
  start: 4.6,
};

/** Ascend's loop: holding the habits until the Summit card (habit-tracker 2901fa6). */
export const ascendLoop: Loop = {
  sources: { dark: "/media/ascend-loop-dark.mp4", light: "/media/ascend-loop-light.mp4" },
  posters: { dark: ascendPosterDark, light: ascendPosterLight },
  /** The poster frame: Today, just past the recording's fade-in. */
  start: 1,
  /** Each loop replays the fade-in after the fade-out. */
  loopFrom: 0,
};

/** Orbit's loop: the 3D map turning and growing (network-crm ce70efc). */
export const orbitLoop: Loop = {
  sources: { dark: "/media/orbit-loop-dark.mp4", light: "/media/orbit-loop-light.mp4" },
  posters: { dark: orbitPosterDark, light: orbitPosterLight },
  /** The poster frame: the whole map, with no touch marker on screen (the first seconds have one). */
  start: 10,
  loopFrom: 0,
};

/** Each tile's still: a screen its hero loop doesn't feature. */
export const stills = {
  bitewise: { dark: swapSheetDark, light: swapSheetLight },
  ascend: { dark: ascendClimbDark, light: ascendClimbLight },
  orbit: { dark: orbitPersonDark, light: orbitPersonLight },
} as const;

/** The full demo tours, played in the Demo video dialog and loaded only when it opens. */
export const demos = {
  bitewise: { dark: "/media/bitewise-demo-dark.mp4", light: "/media/bitewise-demo-light.mp4" },
  ascend: { dark: "/media/ascend-demo-dark.mp4", light: "/media/ascend-demo-light.mp4" },
  orbit: { dark: "/media/orbit-demo-dark.mp4", light: "/media/orbit-demo-light.mp4" },
} as const;

/** The case study's swap: the sheet opened with the page unscrolled, so the screen's top is intact. */
export const swapSheet = { dark: swapSheetDark, light: swapSheetLight };
