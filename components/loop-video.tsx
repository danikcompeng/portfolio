"use client";

// A muted, looping product video with one play rule (plans/portfolio.md, logic-checker #7).
// It plays only while ALL of these hold:
//   1. its layout is the one on screen (pinned vs stacked), so a hidden copy never loads;
//   2. it is on screen;
//   3. its layer is the active one (not covered by a still);
//   4. the page is visible;
//   5. the visitor wants it: they pressed play, or they didn't press pause and don't ask
//      for reduced motion.
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
import { PINNED_QUERY, REDUCED_MOTION_QUERY, useMediaQuery, useTheme } from "@/lib/client-state";
import { Pause, Play } from "./icons";

type Intent = "auto" | "play" | "pause";

type VideoState = {
  setVideo: (el: HTMLVideoElement | null) => void;
  setFrame: (el: HTMLDivElement | null) => void;
  src: string | undefined;
  playing: boolean;
  ready: boolean;
  active: boolean;
  toggle: () => void;
  onPlaying: () => void;
  onPause: () => void;
  onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onSeeked: () => void;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
};

const VideoContext = createContext<VideoState | null>(null);

function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("VideoLayer and PauseButton must sit inside <VideoProvider>");
  return ctx;
}

export function VideoProvider({
  children,
  sources,
  start = 0,
  active = true,
  layout = "any",
  lazy = false,
}: {
  children: ReactNode;
  sources: { dark: string; light: string };
  /** Seconds to start from (the poster frame), past the login screen. */
  start?: number;
  /** False while a still covers the video. */
  active?: boolean;
  layout?: "any" | "pinned" | "stacked";
  /** Set the source only once the video is within ~600 px of the viewport. */
  lazy?: boolean;
}) {
  // Elements as state (callback refs), so nothing reads a ref during render.
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const theme = useTheme();
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const pinned = useMediaQuery(PINNED_QUERY);
  const [near, setNear] = useState(!lazy);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [intent, setIntent] = useState<Intent>("auto");
  const [playing, setPlaying] = useState(false);
  // The source whose first frame is showing; until it matches `src`, the poster shows.
  const [shownSrc, setShownSrc] = useState<string | undefined>();

  const layoutOk = layout === "any" || (layout === "pinned" ? pinned : !pinned);
  // Reduced motion and no choice yet: poster only, nothing downloads until they press play.
  const optedOut = reduced && intent === "auto";
  const src = layoutOk && near && theme && !optedOut ? sources[theme] : undefined;
  const wants = intent === "play" || (intent === "auto" && !reduced);
  const shouldPlay = Boolean(src) && inView && active && pageVisible && wants;

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
    return () => {
      view.disconnect();
      nearby?.disconnect();
    };
  }, [frame, lazy]);

  useEffect(() => {
    const onChange = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    const v = video;
    if (!v) return;
    if (!src) {
      // Withdrawn (layout switched, Reduce Motion turned on): removing the attribute alone
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
    active,
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
  dataActive = true,
  priority = false,
}: {
  posters: { dark: StaticImageData; light: StaticImageData };
  sizes: string;
  dataActive?: boolean;
  priority?: boolean;
}) {
  // Destructured: a context object with a callback ref inside reads as a ref to the linter.
  const { setFrame, setVideo, src, ready, onPlaying, onPause, onLoadedMetadata, onSeeked, onTimeUpdate } =
    useVideo();
  return (
    <div className="layer" data-active={dataActive} ref={setFrame} aria-hidden="true">
      {/* Lazy, so the other theme's copy (display: none) never downloads; high priority when
          it may be the largest paint (the hero), so the visible one loads right after layout. */}
      <Image src={posters.dark} alt="" sizes={sizes} fetchPriority={priority ? "high" : "auto"} className="only-dark" />
      <Image src={posters.light} alt="" sizes={sizes} fetchPriority={priority ? "high" : "auto"} className="only-light" />
      <video
        ref={setVideo}
        src={src}
        muted
        loop
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
      />
    </div>
  );
}

/** Pause/play for the nearest video (WCAG 2.2.2). Hidden while a still covers the video. */
export function PauseButton({ label }: { label: string }) {
  const v = useVideo();
  return (
    <button
      type="button"
      className="media-button press"
      aria-label={label}
      aria-pressed={!v.playing}
      style={{ visibility: v.active ? "visible" : "hidden" }}
      onClick={v.toggle}
    >
      {v.playing ? <Pause /> : <Play />}
    </button>
  );
}
