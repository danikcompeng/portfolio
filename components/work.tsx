import { PageLink } from "./page-link";
import { ascend, bitewise, fmt, flags, links, orbit, type Stat } from "@/content/site";
import { ArrowUpRight } from "./icons";
import { ascendLoop, orbitLoop, tour } from "./media";
import { Phone } from "./phone";
import { PauseButton, VideoLayer, VideoProvider } from "./loop-video";
import { Reveal } from "./reveal";

export function OutLink({
  href,
  children,
  className = "",
  label,
}: {
  href: string;
  children: string;
  className?: string;
  /** A fuller accessible name, when the visible text repeats elsewhere on the page. */
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-link press ${className}`}
      aria-label={`${label ?? children} (opens in a new tab)`}
    >
      {children}
      <ArrowUpRight />
    </a>
  );
}

/** Numbers as data: the floor in mono, the label in text. Sources live in content/site.ts. */
export function Facts({ items }: { items: { stat: Stat; label: string }[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {items.map(({ stat, label }) => (
        <li key={label} className="flex items-baseline gap-2 text-[0.9375rem] text-ink-muted">
          <span className="t-data text-[0.9375rem] font-medium text-ink">{fmt(stat)}</span>
          {label}
        </li>
      ))}
    </ul>
  );
}

/** One link per theme, each shown only in its theme: the tour the visitor opens matches the page. */
function ThemedOutLink({
  hrefs,
  children,
  label,
}: {
  hrefs: { dark: string; light: string };
  children: string;
  label?: string;
}) {
  return (
    <>
      <OutLink href={hrefs.dark} className="only-dark" label={label}>{children}</OutLink>
      <OutLink href={hrefs.light} className="only-light" label={label}>{children}</OutLink>
    </>
  );
}

/**
 * A half tile's phone, cropped by the tile's bottom edge, playing the app's loop. The
 * caption (with its pause button) sits above the phone, since the phone runs off the tile.
 */
function TileVideo({
  loop,
  name,
  video,
  id,
}: {
  loop: typeof ascendLoop;
  name: string;
  video: { caption: string; alt: string };
  /** Prefix for the caption's id, which names the figure (the pause button's label doesn't). */
  id: string;
}) {
  return (
    <VideoProvider sources={loop.sources} start={loop.start} loopFrom={loop.loopFrom} lazy>
      <figure className="tile-media screen-crop mt-auto w-[var(--phone-w)] pt-12" aria-labelledby={`${id}-caption`}>
        <figcaption className="mb-4 flex items-center justify-center gap-3 text-[0.9375rem] text-ink-muted">
          <PauseButton label={`Pause the ${name} video`} />
          <span id={`${id}-caption`}>{video.caption}</span>
        </figcaption>
        <div role="img" aria-label={video.alt}>
          <Phone>
            <VideoLayer posters={loop.posters} sizes="300px" />
          </Phone>
        </div>
      </figure>
    </VideoProvider>
  );
}

function Decision({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="font-semibold tracking-[-0.01em]">{title}</h4>
      <p className="mt-1 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}


export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[var(--max)] px-[var(--gutter)] py-[clamp(96px,12vw,160px)]" aria-labelledby="work-title">
      <h2 id="work-title" className="t-section">
        Work
      </h2>
      <p className="t-lead mt-4 max-w-[36rem] text-ink-muted">
        Three apps you can open right now.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Bitewise: the full tour, its decisions and its numbers. */}
        <Reveal as="article" className="tile tile-bw lg:col-span-12" aria-labelledby="bw-title">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div>
              <h3 id="bw-title" className="t-title">
                {bitewise.name}
              </h3>
              <p className="t-lead mt-3 max-w-[34rem] text-balance">{bitewise.tileLine}</p>
              <Facts
                items={[
                  { stat: bitewise.stats.unitTests, label: "unit tests" },
                  { stat: bitewise.stats.e2eTests, label: "end-to-end tests" },
                  { stat: bitewise.stats.codeReviews, label: "code reviews" },
                ]}
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {bitewise.decisions.map((d) => (
                  <Decision key={d.title} {...d} />
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6">
                <OutLink href={links.bitewise}>Try the live demo</OutLink>
                <OutLink href={links.bitewiseCode}>Code on GitHub</OutLink>
                {flags.caseStudy ? (
                  <PageLink href="/work/bitewise" className="text-link press">
                    Read the case study
                  </PageLink>
                ) : null}
              </div>
            </div>
            <VideoProvider sources={tour.sources} start={tour.start} loopFrom={tour.loopFrom} lazy>
              <figure className="tile-media flex flex-col items-center gap-3 justify-self-center" aria-labelledby="bw-video-caption">
                <Phone style={{ "--phone-w": "min(68vw, 290px)" } as React.CSSProperties}>
                  <VideoLayer posters={tour.posters} sizes="290px" />
                </Phone>
                <figcaption className="flex items-center gap-3 text-[0.9375rem] text-ink-muted">
                  <PauseButton label="Pause the Bitewise tour" />
                  <span id="bw-video-caption">The full demo tour</span>
                </figcaption>
              </figure>
            </VideoProvider>
          </div>
        </Reveal>

        {/* Ascend */}
        <Reveal as="article" className="tile tile-as flex flex-col lg:col-span-6 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-y-0" aria-labelledby="as-title">
          <h3 id="as-title" className="t-title">
            {ascend.name}
          </h3>
          <div>
            <p className="t-lead mt-3 text-balance">{ascend.oneLiner}</p>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">{ascend.detail}</p>
          </div>
          <Facts
            items={[
              { stat: ascend.stats.unitTests, label: "unit and database tests" },
              { stat: ascend.stats.browserTests, label: "browser tests" },
              { stat: ascend.stats.findings, label: "review findings" },
            ]}
          />
          <div className="mt-6">
            <Decision {...ascend.decision} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <OutLink href={links.ascend}>Open Ascend</OutLink>
            <ThemedOutLink hrefs={links.ascendTour} label="Watch the tour of Ascend, a video on GitHub">Watch the tour</ThemedOutLink>
          </div>
          <TileVideo loop={ascendLoop} name={ascend.name} video={ascend.video} id="as-video" />
        </Reveal>

        {/* Orbit */}
        <Reveal as="article" delay={80} className="tile tile-or flex flex-col lg:col-span-6 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-y-0" aria-labelledby="or-title">
          <h3 id="or-title" className="t-title">
            {orbit.name}
          </h3>
          <div>
            <p className="t-lead mt-3 text-balance">{orbit.oneLiner}</p>
          </div>
          <Facts
            items={[
              { stat: orbit.stats.unitTests, label: "unit tests" },
              { stat: orbit.stats.findings, label: "review findings" },
            ]}
          />
          <div className="mt-6">
            <Decision {...orbit.decision} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <OutLink href={links.orbit}>Open Orbit</OutLink>
            <ThemedOutLink hrefs={links.orbitTour} label="Watch the tour of Orbit, a video on GitHub">Watch the tour</ThemedOutLink>
          </div>
          <TileVideo loop={orbitLoop} name={orbit.name} video={orbit.video} id="or-video" />
        </Reveal>

      </div>
    </section>
  );
}
