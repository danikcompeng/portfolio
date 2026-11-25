"use client";

// The pinned phone (plans/portfolio.md D2/D3): it plays the Bitewise loop above step 1 and
// shows each step's screen as the steps cross the viewport's centre line.

import { useEffect, useState } from "react";
import { activeStep } from "@/lib/active-step";
import { PINNED_QUERY, PINNED_SIZES, useMediaQuery } from "@/lib/client-state";
import { hero, story } from "@/content/site";
import { loop, screens } from "./media";
import { Phone, ScreenLayer } from "./phone";
import { PauseButton, VideoLayer, VideoProvider } from "./loop-video";

const SIZES = PINNED_SIZES;

export function StoryStage() {
  const pinned = useMediaQuery(PINNED_QUERY);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!pinned) return;
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-story-step]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = steps.map((s) => s.getBoundingClientRect().top);
      setActive(activeStep(tops, window.innerHeight / 2));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [pinned]);

  return (
    <VideoProvider sources={loop.sources} start={loop.start} active={active === -1} layout="pinned">
      <div className="story-sticky">
        <div className="tilt" aria-hidden="true">
          <Phone>
            <VideoLayer posters={loop.posters} sizes={SIZES} dataActive={active === -1} priority />
            {story.steps.map((step, i) => (
              <ScreenLayer key={step.id} image={screens[step.screen]} alt="" sizes={SIZES} active={active === i} />
            ))}
          </Phone>
        </div>
        <div className="rail" aria-hidden="true" data-started={active !== -1}>
          {story.steps.map((step, i) => (
            <span key={step.id} data-active={active === i} />
          ))}
        </div>
        <div className="stage-caption">
          <PauseButton label="Pause the Bitewise video" />
          <p className="t-data text-ink-muted">{hero.phoneCaption}</p>
        </div>
      </div>
    </VideoProvider>
  );
}
