import { ascend, bitewise, hero, orbit } from "@/content/site";
import { ascendLoop, bitewiseLoop, orbitLoop, type Loop } from "./media";
import { Phone } from "./phone";
import { PauseButton, VideoLayer, VideoProvider, VideoRow } from "./loop-video";

// The three apps as equals (plans/portfolio.md, round 10): the same phone for each, in Work's
// order. A swipeable row below 1100 px, Work's three columns from there.
const apps: { id: string; name: string; loop: Loop; video: { caption: string; alt: string } }[] = [
  { id: "bw", name: bitewise.name, loop: bitewiseLoop, video: bitewise.video },
  { id: "as", name: ascend.name, loop: ascendLoop, video: ascend.video },
  { id: "or", name: orbit.name, loop: orbitLoop, video: orbit.video },
];

// The phone's width per layout (keep in sync with .hero-phones in app/globals.css).
const SIZES = "(min-width: 1100px) 280px, min(64vw, 300px)";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="mx-auto max-w-[var(--max)] px-[var(--gutter)]">
        <div className="hero-text">
          <h1 id="hero-title" className="hero-title t-display max-w-[16ch]">
            {hero.title}
          </h1>
          <div>
            <p className="t-lead hero-subline max-w-[37rem] text-ink-muted">{hero.subline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={hero.primary.href} className="btn btn-primary press">
                {hero.primary.label}
              </a>
            </div>
          </div>
        </div>

        <VideoRow className="hero-phones" label="Bitewise, Ascend and Orbit, recorded on their live demos">
          {apps.map(({ id, name, loop, video }) => (
            <li key={id}>
              {/* Bitewise leads: the others load once it plays (round 11). */}
              <VideoProvider sources={loop.sources} start={loop.start} loopFrom={loop.loopFrom} lazy lead={id === "bw"}>
                <figure className="hero-phone" aria-labelledby={`${id}-hero-caption`}>
                  <div className="tilt" role="img" aria-label={video.alt}>
                    <Phone>
                      <VideoLayer posters={loop.posters} sizes={SIZES} priority />
                    </Phone>
                  </div>
                  <figcaption className="flex w-full items-center gap-3 text-[0.9375rem] leading-snug text-ink-muted">
                    <PauseButton label={`Pause the ${name} video`} />
                    {/* The name, then what the loop shows; the dot is for screen readers' pause. */}
                    <span id={`${id}-hero-caption`}>
                      <span className="block font-semibold text-ink">
                        {name}
                        <span className="sr-only"> ·</span>
                      </span>{" "}
                      {video.caption}
                    </span>
                  </figcaption>
                </figure>
              </VideoProvider>
            </li>
          ))}
        </VideoRow>
      </div>
    </section>
  );
}
