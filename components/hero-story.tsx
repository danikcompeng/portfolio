import { hero, story } from "@/content/site";
import { ArrowUpRight } from "./icons";
import { loop, screens } from "./media";
import { Phone, ScreenLayer } from "./phone";
import { PauseButton, VideoLayer, VideoProvider } from "./loop-video";
import { StoryStage } from "./story-stage";
import { STACKED_SIZES } from "@/lib/client-state";

const INLINE_SIZES = STACKED_SIZES;

// One section, one DOM for both layouts (plans/portfolio.md D2/D3). Pinned: the stage column
// holds a sticky phone for the hero and the four steps. Stacked: the hero gets its own
// phone and each step its own screen.
export function HeroStory() {
  return (
    <section id="top" className="story" aria-labelledby="hero-title">
      <div className="story-grid">
        <div className="story-hero">
          <h1 id="hero-title" className="t-display max-w-[16ch]">
            {hero.title}
          </h1>
          <p className="t-lead mt-6 max-w-[37rem] text-ink-muted">{hero.subline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={hero.primary.href} className="btn btn-primary press">
              {hero.primary.label}
            </a>
            <a
              href={hero.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary press"
              aria-label={`${hero.secondary.label} (opens in a new tab)`}
            >
              {hero.secondary.label}
              <ArrowUpRight />
            </a>
          </div>

          <div className="story-inline-phone">
            <VideoProvider sources={loop.sources} start={loop.start} layout="stacked">
              <figure className="flex flex-col items-center gap-4">
                <div className="tilt-static" aria-hidden="true">
                  <Phone>
                    <VideoLayer posters={loop.posters} sizes={INLINE_SIZES} priority />
                  </Phone>
                </div>
                <figcaption className="t-data flex items-center gap-3 text-ink-muted">
                  <PauseButton label="Pause the Bitewise video" />
                  {hero.phoneCaption}
                </figcaption>
              </figure>
            </VideoProvider>
          </div>
        </div>

        <div className="story-body">
          <h2 id="story-title" className="t-section">
            {story.name}
          </h2>
          <p className="t-lead mt-4 max-w-[30rem] text-ink-muted">{story.oneLiner}</p>

          <ol className="story-steps mt-4">
            {story.steps.map((step) => (
              <li key={step.id} className="story-step" data-story-step>
                <h3 className="t-step">{step.title}</h3>
                <p className="t-lead mt-4 max-w-[30rem] text-ink-muted">{step.body}</p>
                <div className="step-inline-phone">
                  <Phone>
                    <ScreenLayer image={screens[step.screen]} alt={step.alt} sizes={INLINE_SIZES} />
                  </Phone>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="story-stage">
          <StoryStage />
        </div>
      </div>
    </section>
  );
}
