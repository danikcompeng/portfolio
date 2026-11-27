"use client";

// A muted, looping product video with one play rule (plans/portfolio.md, logic-checker #7).
// It plays only while ALL of these hold:
//   1. it is on screen;
//   2. the page is visible and no Demo video dialog covers it;
//   3. the visitor wants it: they pressed play, or they didn't press pause and don't ask
//      for reduced motion.
// It loads only once it is near the viewport and, inside a <VideoRow>, at least 60% inside
// the row's scroll box (so on a phone only the snapped one loads, plans/portfolio.md round 10).
// No autoPlay attribute; the source is set after mount for the current theme and swapped
// (keeping the position) when the theme changes. The element stays mounted.

import Image, { type StaticImageData } from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { REDUCED_MOTION_QUERY, useDialogOpen, useMediaQuery, useTheme } from "@/lib/client-state";
import { Pause, Play } from "./icons";

type Intent = "auto" | "play" | "pause";

type VideoState = {
  setVideo: (el: HTMLVideoElement | null) => void;
  setFrame: (el: HTMLDivElement | null) => void;
  src: string | undefined;
  playing: boolean;
  ready: boolean;
  toggle: () => void;
  onPlaying: () => void;
  onPause: () => void;
  onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onSeeked: () => void;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onEnded: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
};

const VideoContext = createContext<VideoState | null>(null);

/** A horizontal scroll row of videos: the element whose box decides which ones load. */
const RowContext = createContext<HTMLElement | null | undefined>(undefined);

/** A swipeable row (an <ul>): videos inside load only once mostly inside it. */
export function VideoRow({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  const [row, setRow] = useState<HTMLUListElement | null>(null);
  return (
    <RowContext.Provider value={row}>
      <ul ref={setRow} className={className} aria-label={label}>
        {children}
      </ul>
    </RowContext.Provider>
  );
}

function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("VideoLayer and PauseButton must sit inside <VideoProvider>");
  return ctx;
}

export function VideoProvider({
  children,
  sources,
  start = 0,
  loopFrom,
  lazy = false,
}: {
  children: ReactNode;
  sources: { dark: string; light: string };
  /** Seconds to start from (the poster frame), past the login screen. */
  start?: number;
  /** Where each loop restarts (default: `start`), so it never replays the demo's login. */
  loopFrom?: number;
  /** Set the source only once the video is within ~600 px of the viewport. */
  lazy?: boolean;
}) {
  // Elements as state (callback refs), so nothing reads a ref during render.
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const theme = useTheme();
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const covered = useDialogOpen();
  // Inside a <VideoRow>: null until the row mounts, then the row's element.
  const row = useContext(RowContext);
  const [near, setNear] = useState(!lazy);
  const [inRow, setInRow] = useState(row === undefined);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [intent, setIntent] = useState<Intent>("auto");
  const [playing, setPlaying] = useState(false);
  // The source whose first frame is showing; until it matches `src`, the poster shows.
  const [shownSrc, setShownSrc] = useState<string | undefined>();

  // Reduced motion and no choice yet: poster only, nothing downloads until they press play.
  const optedOut = reduced && intent === "auto";
  // Pressing play counts as asking for it, wherever it sits in the row.
  const src = near && (inRow || intent === "play") && theme && !optedOut ? sources[theme] : undefined;
  const wants = intent === "play" || (intent === "auto" && !reduced);
  const shouldPlay = Boolean(src) && inView && pageVisible && !covered && wants;

  useEffect(() => {
    const el = frame;
    if (!el) return;
    const view = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    view.observe(el);
    let nearby: IntersectionObserver | undefined;
    if (lazy) {
      nearby = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setNear(true);
            nearby?.disconnect();
          }
        },
        { rootMargin: "600px 0px" },
      );
      nearby.observe(el);
    }
    // Mostly inside the row's scroll box (once is enough: a loaded video stays loaded).
    let inside: IntersectionObserver | undefined;
    if (row) {
      inside = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setInRow(true);
            inside?.disconnect();
          }
        },
        { root: row, threshold: 0.6 },
      );
      inside.observe(el);
    }
    return () => {
      view.disconnect();
      nearby?.disconnect();
      inside?.disconnect();
    };
  }, [frame, lazy, row]);

  useEffect(() => {
    const onChange = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    const v = video;
    if (!v) return;
    if (!src) {
      // Withdrawn (Reduce Motion turned on): removing the attribute alone
      // doesn't stop a playing video, so pause it and release the file.
      if (v.currentSrc) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
      return;
    }
    if (shouldPlay) {
      v.play().catch((err: unknown) => {
        // Refused (e.g. iOS Low Power Mode): show the paused state; a tap can start it.
        if (err instanceof DOMException && err.name === "NotAllowedError") setIntent("pause");
      });
    } else {
      v.pause();
    }
  }, [shouldPlay, src, video]);

  // Pause on unmount, and when the page is hidden behind another route.
  useEffect(() => () => video?.pause(), [video]);

  const toggle = useCallback(() => {
    setIntent(playing ? "pause" : "play");
  }, [playing]);

  const value: VideoState = {
    setVideo,
    setFrame,
    src,
    playing,
    ready: Boolean(src) && shownSrc === src,
    toggle,
    onPlaying: () => {
      setPlaying(true);
      setShownSrc(src);
    },
    onPause: () => setPlaying(false),
    // The position survives a theme swap on the element itself (data-t), so the new
    // source resumes where the old one was; the first load starts at the poster frame.
    onLoadedMetadata: (e) => {
      const el = e.currentTarget;
      const from = Number(el.dataset.t ?? start);
      el.currentTime = Math.min(from, Math.max(0, el.duration - 0.5));
    },
    onSeeked: () => setShownSrc(src),
    // No native `loop`: it would restart at 0, the demo's login screen and loading skeleton.
    onEnded: (e) => {
      const el = e.currentTarget;
      el.currentTime = loopFrom ?? start;
      el.play().catch(() => {});
    },
    onTimeUpdate: (e) => {
      // A new source resets the position to 0 and fires timeupdate before it has any data;
      // ignore that one, or the swap would restart the video (code-reviewer, review 1).
      if (e.currentTarget.readyState === 0) return;
      e.currentTarget.dataset.t = String(e.currentTarget.currentTime);
    },
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

/** The video and its theme-matched poster, as one stacked layer of a phone screen. */
export function VideoLayer({
  posters,
  sizes,
  priority = false,
}: {
  posters: { dark: StaticImageData; light: StaticImageData };
  sizes: string;
  priority?: boolean;
}) {
  // Destructured: a context object with a callback ref inside reads as a ref to the linter.
  const { setFrame, setVideo, src, ready, onPlaying, onPause, onLoadedMetadata, onSeeked, onTimeUpdate, onEnded } =
    useVideo();
  return (
    <div className="layer" data-active="true" ref={setFrame} aria-hidden="true">
      {/* Lazy, so the other theme's copy (display: none) never downloads; high priority when
          it may be the largest paint (the hero), so the visible one loads right after layout. */}
      <Image src={posters.dark} alt="" sizes={sizes} fetchPriority={priority ? "high" : "auto"} className="only-dark" />
      <Image src={posters.light} alt="" sizes={sizes} fetchPriority={priority ? "high" : "auto"} className="only-light" />
      <video
        ref={setVideo}
        src={src}
        muted
        playsInline
        preload={src ? "auto" : "none"}
        disablePictureInPicture
        tabIndex={-1}
        style={{ opacity: ready ? 1 : 0 }}
        onPlaying={onPlaying}
        onPause={onPause}
        onLoadedMetadata={onLoadedMetadata}
        onSeeked={onSeeked}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    </div>
  );
}

/** Pause/play for the nearest video (WCAG 2.2.2). */
export function PauseButton({ label }: { label: string }) {
  const v = useVideo();
  return (
    <button
      type="button"
      className="media-button press"
      aria-label={label}
      aria-pressed={!v.playing}
      onClick={v.toggle}
    >
      {v.playing ? <Pause /> : <Play />}
    </button>
  );
}
