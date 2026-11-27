"use client";

import { setTheme, useTheme } from "@/lib/client-state";
import { Moon, Sun } from "./icons";

// A toggle button: constant label, state in aria-pressed (known only after mount, so the
// server renders it without one). The icon follows data-theme through CSS.
export function ThemeToggle() {
  const theme = useTheme();
  return (
    <button
      type="button"
      className="press icon-swap size-11 place-items-center rounded-full text-ink-muted hover:bg-line hover:text-ink"
      aria-label="Dark theme"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Moon className="icon icon-when-dark" />
      <Sun className="icon icon-when-light" />
    </button>
  );
}
