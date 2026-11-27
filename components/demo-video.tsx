"use client";

// "Demo video": a button that plays an app's full tour in a modal dialog on the page
// (plans/portfolio.md, round 10). Native <dialog> + showModal(): the page behind is inert,
// focus stays inside, Esc closes and focus goes back to the button. State follows the
// dialog's own close event, so Esc, the button and the backdrop all end the same way. The
// <video> exists only while the dialog is open: nothing downloads before, and closing
// releases it. Muted, inline, with controls, in the theme on screen.

import { useEffect, useRef, useState } from "react";
import type { Theme } from "@/lib/client-state";
import { useTheme } from "@/lib/client-state";
import { Close, Play } from "./icons";
import type { Demo } from "./media";
import { Phone } from "./phone";

export function DemoVideo({ name, demo }: { name: string; demo: Demo }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pressedOnBackdrop = useRef(false);
  const openedAt = useRef(0);
  // The theme the dialog opened in: a system theme change mid-tour doesn't restart it.
  const [openTheme, setOpenTheme] = useState<Theme | null>(null);
  const theme = useTheme();
  const id = `demo-${name.toLowerCase()}`;

  const show = () => {
    const d = dialog.current;
    if (!d || d.open || !theme) return;
    d.showModal();
    // Only once it's open: a failed showModal must not leave the page locked.
    document.documentElement.setAttribute("data-dialog", "");
    openedAt.current = performance.now();
    setOpenTheme(theme);
  };

  const onClose = () => {
    setOpenTheme(null);
    document.documentElement.removeAttribute("data-dialog");
    trigger.current?.focus();
  };

  // Unmounted while open (a client navigation): release the page.
  useEffect(() => () => document.documentElement.removeAttribute("data-dialog"), []);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="text-link press"
        aria-haspopup="dialog"
        aria-label={`Demo video of ${name}`}
        onClick={show}
      >
        Demo video
        <Play />
      </button>
      <dialog
        ref={dialog}
        className="demo-dialog"
        aria-labelledby={`${id}-title`}
        onClose={onClose}
        // A click closes only when it both started and ended on the backdrop, so a drag on
        // the video's seek bar that ends outside it doesn't.
        // The second click of a double-click on "Demo video" lands on the fresh backdrop: ignore
        // presses in the first 400 ms.
        onPointerDown={(e) => {
          pressedOnBackdrop.current = e.target === e.currentTarget && performance.now() - openedAt.current > 400;
        }}
        onClick={(e) => {
          if (pressedOnBackdrop.current && e.target === e.currentTarget) dialog.current?.close();
          pressedOnBackdrop.current = false;
        }}
      >
        <div className="demo-phone">
          <button type="button" className="media-button press demo-close" aria-label="Close the video" autoFocus onClick={() => dialog.current?.close()}>
            <Close />
          </button>
          <Phone>
            {openTheme ? (
              <video
                className="demo-video"
                // A media fragment starts it past the login, at the first app screen: the
                // browser does it natively, nothing is hidden, and the controls can still go
                // back to 0. (A browser without fragments just starts at 0.)
                src={`${demo.sources[openTheme]}#t=${demo.start[openTheme]}`}
                muted
                playsInline
                controls
                autoPlay
                preload="auto"
                disablePictureInPicture
              />
            ) : null}
          </Phone>
          <h2 id={`${id}-title`} className="demo-caption">
            {name} demo video
          </h2>
        </div>
      </dialog>
    </>
  );
}
