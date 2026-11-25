"use client";

// Browser state read through useSyncExternalStore, so the server render and the first
// client render agree (the server snapshot) and the real value arrives right after.
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** Pinned story layout (plans/portfolio.md D3). Keep in sync with app/globals.css. */
export const PINNED_QUERY = "(min-width: 1024px) and (min-height: 540px)";
/** `sizes` for images that only show in one layout: the other layout asks for 1px. */
export const PINNED_SIZES = `${PINNED_QUERY} 360px, 1px`;
export const STACKED_SIZES = `${PINNED_QUERY} 1px, 300px`;
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // With no stored choice, follow the system when it changes mid-visit (e.g. macOS Auto).
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (!storedTheme()) document.documentElement.setAttribute("data-theme", mql.matches ? "dark" : "light");
  };
  mql.addEventListener("change", onSystem);
  return () => {
    observer.disconnect();
    mql.removeEventListener("change", onSystem);
  };
}

/** The theme in use, or null during server render and hydration. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribeTheme, readTheme, () => null);
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies to this page.
  }
}
