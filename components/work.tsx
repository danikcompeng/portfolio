import { ascend, bitewise, fmt, flags, links, orbit, type Stat } from "@/content/site";
import { ArrowUpRight } from "./icons";
import { ascendScreen, orbitScreen, tour } from "./media";
import { Phone, ScreenLayer } from "./phone";
import { PauseButton, VideoLayer, VideoProvider } from "./loop-video";
import { Reveal } from "./reveal";

function OutLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link press"
      aria-label={`${children} (opens in a new tab)`}
    >
      {children}
      <ArrowUpRight />
    </a>
  );
}

/** Numbers as data: the floor in mono, the label in text. Sources live in content/site.ts. */
function Facts({ items }: { items: { stat: Stat; label: string }[] }) {
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
                  <a href="/work/bitewise" className="text-link press">
                    Read the case study
                  </a>
                ) : null}
              </div>
            </div>
            <VideoProvider sources={tour.sources} start={tour.start} loopFrom={tour.loopFrom} lazy>
              <figure className="tile-media flex flex-col items-center gap-3 justify-self-center">
                <Phone style={{ "--phone-w": "min(68vw, 290px)" } as React.CSSProperties}>
                  <VideoLayer posters={tour.posters} sizes="290px" />
                </Phone>
                <figcaption className="flex items-center gap-3 text-[0.9375rem] text-ink-muted">
                  <PauseButton label="Pause the Bitewise tour" />
                  The full demo tour
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
          <div className="mt-4">
            <OutLink href={links.ascend}>Open Ascend</OutLink>
          </div>
          <div className="tile-media screen-crop mt-auto pt-8">
            <Phone>
              <ScreenLayer
                image={ascendScreen}
                alt="Ascend's Today screen: the pixel-art Climb strip, Altitude 7,113 m · Above the clouds, above the habit keys."
                sizes="300px"
              />
            </Phone>
          </div>
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
          <div className="mt-4">
            <OutLink href={links.orbit}>Open Orbit</OutLink>
          </div>
          <div className="tile-media screen-crop mt-auto pt-8">
            <Phone>
              <ScreenLayer
                image={orbitScreen}
                alt="Orbit's 3D map: me as a planet in the centre, with people on tilted rings by introduction depth."
                sizes="300px"
              />
            </Phone>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
