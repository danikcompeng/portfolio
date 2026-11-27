"use client";

// "Demo video": a button that plays an app's full tour in a modal dialog on the page
// (plans/portfolio.md, rounds 10 to 12). Native <dialog> + showModal(): the page behind is
// inert, focus stays inside, Esc closes and focus goes back to the button. State follows the
// dialog's own close event, so every way out (Esc, back, the button, the backdrop) ends in the
// same cleanup. The <video> exists only while the dialog is open: nothing downloads before,
// and closing releases it. Muted, inline, with controls, in the theme it opened in.
//
// Round 12: the dialog's phone grows out of the tile's phone and shrinks back into it. While
// it moves it shows the tile's own picture (a still layer); once it lands, the same picture is
// the video's poster (so the native controls are never covered), and it comes back as it closes, so it reads as one object. Transform, opacity and clip-path
// only, --dur-ui, ease-out both ways. Closing never waits on the animation: the dialog closes
// in a `finally`, and a second Esc closes it at once. Reduce Motion: no movement at all.

import { useEffect, useRef, useState } from "react";
import type { Theme } from "@/lib/client-state";
import { REDUCED_MOTION_QUERY, useTheme } from "@/lib/client-state";
import { Close, Play } from "./icons";
import type { Demo } from "./media";
import { Phone } from "./phone";

const DURATION = 240; // --dur-ui
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // --ease-out
const SHADOW = 96; // px of room around the phone, so the clip keeps its shadow
const MIN_VISIBLE = 40; // px of the tile's phone on screen to grow from it; else a plain fade

type Geometry = { transform: string; clip: string | null } | null;

/** Where the dialog's phone must sit to cover the tile's phone, clipped to what the tile shows. */
function fromTile(tilePhone: Element | null, dialogPhone: HTMLElement): Geometry {
  if (!tilePhone) return null;
  const t = tilePhone.getBoundingClientRect();
  const crop = tilePhone.closest("article")?.getBoundingClientRect();
  const f = dialogPhone.getBoundingClientRect();
  // What the visitor sees of the tile's phone: under the sticky nav, above the tile's edge.
  const navBottom = document.querySelector(".nav")?.getBoundingClientRect().bottom ?? 0;
  const visibleTop = Math.max(t.top, navBottom, 0);
  const visibleBottom = Math.min(t.bottom, crop?.bottom ?? t.bottom, window.innerHeight);
  if (!f.width || !t.width || visibleBottom - visibleTop < MIN_VISIBLE) return null;
  const scale = t.width / f.width;
  // The parts of the dialog's phone hidden at the start, in its own (unscaled) pixels.
  const top = Math.max(0, (visibleTop - t.top) / scale);
  const bottom = Math.max(0, f.height - (visibleBottom - t.top) / scale);
  return {
    transform: `translate(${t.left - f.left}px, ${t.top - f.top}px) scale(${scale})`,
    // Nothing hidden: no clip animation at all (it runs on the main thread).
    clip: top || bottom ? `inset(${top || -SHADOW}px ${-SHADOW}px ${bottom || -SHADOW}px ${-SHADOW}px)` : null,
  };
}
const OPEN_CLIP = `inset(${-SHADOW}px)`;

/** The phone between the tile's place and the centre: transform and clip as two animations. */
function move(phone: HTMLElement, tile: NonNullable<Geometry>, way: "open" | "close"): Animation[] {
  // Forward keyframes and ease-out both ways (never a reversed ease-in). A close has only its
  // end keyframe, so it starts from wherever the phone is (even mid-expand), and holds that
  // end until the dialog is gone.
  const timing: KeyframeAnimationOptions = { duration: DURATION, easing: EASE, fill: way === "close" ? "forwards" : "none" };
  const at = { transform: tile.transform, transformOrigin: "0 0" };
  const centre = { transform: "none", transformOrigin: "0 0" };
  const out = [phone.animate(way === "open" ? [at, centre] : [at], timing)];
  if (tile.clip) {
    out.push(phone.animate(way === "open" ? [{ clipPath: tile.clip }, { clipPath: OPEN_CLIP }] : [{ clipPath: tile.clip }], timing));
  }
  return out;
}

export function DemoVideo({ name, demo }: { name: string; demo: Demo }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const phoneBox = useRef<HTMLDivElement>(null);
  const pressedOnBackdrop = useRef(false);
  const openedAt = useRef(0);
  const closing = useRef(false);
  // Transform and clip run as two animations, so the transform can stay on the compositor.
  const motion = useRef<Animation[]>([]);
  // The theme the dialog opened in: a system theme change mid-tour doesn't restart it.
  const [openTheme, setOpenTheme] = useState<Theme | null>(null);
  // The tile's picture, shown in the dialog's phone while it moves (opening, and closing).
  const [still, setStill] = useState<string | null>(null);
  const [stillShown, setStillShown] = useState(false); // true while closing
  // The tour mounts once the phone has landed, so the expand runs without the video's start-up.
  // From then on the still is the video's poster, so the native controls always show.
  const [videoOn, setVideoOn] = useState(false);
  const theme = useTheme();
  const id = `demo-${name.toLowerCase()}`;

  const tilePhone = () => trigger.current?.closest("article")?.querySelector(".screen-crop .phone") ?? null;
  const dialogPhone = () => phoneBox.current?.querySelector<HTMLElement>(".phone") ?? null;
  const reduced = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

  const show = () => {
    const d = dialog.current;
    if (!d || d.open || !theme) return;
    const tile = tilePhone();
    setStill(tile?.querySelector<HTMLImageElement>(`img.only-${theme}`)?.currentSrc || null);
    setStillShown(false);
    setVideoOn(false);
    d.showModal();
    // Only once it's open: a failed showModal must not leave the page locked.
    document.documentElement.setAttribute("data-dialog", "");
    openedAt.current = performance.now();
    closing.current = false;
    setOpenTheme(theme);

    const phone = dialogPhone();
    if (!phone || reduced()) {
      setVideoOn(true);
      return;
    }
    const from = fromTile(tile, phone);
    motion.current = from ? move(phone, from, "open") : [phone.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DURATION, easing: EASE })];
    // The tile's phone is "in" the dialog now (hidden behind the backdrop, so it can't double up).
    if (from) tile?.closest(".screen-crop")?.setAttribute("data-away", "");
    // The tour mounts once the phone has landed, unless it's already closing (no download).
    Promise.all(motion.current.map((a) => a.finished))
      .catch(() => {})
      .finally(() => {
        if (!closing.current && d.open) setVideoOn(true);
      });
  };

  /** Shrink back into the tile, then close. The close always happens, animation or not. */
  const requestClose = async () => {
    const d = dialog.current;
    if (!d?.open || closing.current) return;
    closing.current = true;
    const phone = dialogPhone();
    try {
      if (phone && !reduced()) {
        setStillShown(true);
        d.setAttribute("data-closing", "");
        // Keep where the phone is now (closing mid-expand doesn't snap it to full size first).
        motion.current.forEach((a) => {
          try {
            a.commitStyles();
          } catch {
            // Not in effect: nothing to keep.
          }
          a.cancel();
        });
        const to = fromTile(tilePhone(), phone);
        motion.current = to
          ? move(phone, to, "close")
          : [phone.animate([{ opacity: 0 }], { duration: DURATION, easing: EASE, fill: "forwards" })];
        await Promise.all(motion.current.map((a) => a.finished));
      }
    } catch {
      // Cancelled (a second Esc closed it first): nothing to wait for.
    } finally {
      // Put the tile's phone back in the same frame the dialog goes, so neither is missing.
      tilePhone()?.closest(".screen-crop")?.removeAttribute("data-away");
      if (d.open) d.close();
    }
  };

  // Every way out ends here (and on unmount): put the tile's phone back, release the page.
  const cleanUp = () => {
    motion.current.forEach((a) => a.cancel());
    motion.current = [];
    const phone = dialogPhone();
    if (phone) for (const p of ["transform", "transform-origin", "clip-path", "opacity"]) phone.style.removeProperty(p);
    closing.current = false;
    dialog.current?.removeAttribute("data-closing");
    trigger.current?.closest("article")?.querySelector(".screen-crop")?.removeAttribute("data-away");
    document.documentElement.removeAttribute("data-dialog");
  };

  const onClose = () => {
    cleanUp();
    setOpenTheme(null);
    // The page couldn't scroll while open, so the button is where it was: no jump.
    trigger.current?.focus({ preventScroll: true });
  };

  // Unmounted while open (a client navigation): release the page.
  useEffect(() => {
    const button = trigger.current;
    return () => {
      button?.closest("article")?.querySelector(".screen-crop")?.removeAttribute("data-away");
      document.documentElement.removeAttribute("data-dialog");
    };
  }, []);

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
        // Esc: shrink first when the browser lets us; a second Esc (not cancellable) closes at once.
        onCancel={(e) => {
          if (e.cancelable && !closing.current) {
            e.preventDefault();
            void requestClose();
          }
        }}
        // A click closes only when it both started and ended on the backdrop, so a drag on
        // the video's seek bar that ends outside it doesn't. The second click of a
        // double-click on "Demo video" lands on the fresh backdrop: ignore presses in the
        // first 400 ms.
        onPointerDown={(e) => {
          pressedOnBackdrop.current = e.target === e.currentTarget && performance.now() - openedAt.current > 400;
        }}
        onClick={(e) => {
          if (pressedOnBackdrop.current && e.target === e.currentTarget) void requestClose();
          pressedOnBackdrop.current = false;
        }}
      >
        <div className="demo-phone" ref={phoneBox}>
          <button type="button" className="media-button press demo-close" aria-label="Close the video" autoFocus onClick={() => void requestClose()}>
            <Close />
          </button>
          <Phone>
            {openTheme && videoOn ? (
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
                // The same picture as the still, so the hand-over can't be seen; the controls
                // show over it even if autoplay is refused or the tour never buffers.
                poster={still ?? undefined}
              />
            ) : null}
            {openTheme && still ? (
              // eslint-disable-next-line @next/next/no-img-element -- the tile's already-loaded image, reused as is
              <img className="demo-still" src={still} alt="" data-shown={!videoOn || stillShown} />
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
