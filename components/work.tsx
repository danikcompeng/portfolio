import { PageLink } from "./page-link";
import type { StaticImageData } from "next/image";
import { ascend, bitewise, fmt, flags, links, orbit, type Stat } from "@/content/site";
import { DemoVideo } from "./demo-video";
import { ArrowUpRight } from "./icons";
import { demos, stills } from "./media";
import { Phone, ScreenLayer } from "./phone";
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
    <ul className="mt-6 flex flex-wrap content-start gap-x-6 gap-y-2">
      {items.map(({ stat, label }) => (
        <li key={label} className="flex items-baseline gap-2 text-[0.9375rem] text-ink-muted">
          <span className="t-data text-[0.9375rem] font-medium text-ink">{fmt(stat)}</span>
          {label}
        </li>
      ))}
    </ul>
  );
}

/** A tile's still: a phone cropped by the tile's bottom edge, showing a screen in the theme on screen. */
function TileStill({ image, alt }: { image: { dark: StaticImageData; light: StaticImageData }; alt: string }) {
  return (
    <div className="tile-media screen-crop mt-auto pt-10">
      <Phone>
        <ScreenLayer image={image} alt={alt} sizes="(min-width: 1100px) 260px, 280px" />
      </Phone>
    </div>
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


// Three tiles of the same size and layout (plans/portfolio.md, round 10). From 1100 px they
// sit side by side and share their rows (subgrid), so headings, facts, decisions, links and
// phones line up across all three.
const tileClass = "tile flex flex-col min-[1100px]:row-span-6 min-[1100px]:grid min-[1100px]:grid-rows-subgrid min-[1100px]:gap-y-0";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[var(--max)] px-[var(--gutter)] py-[clamp(96px,12vw,160px)]" aria-labelledby="work-title">
      <h2 id="work-title" className="t-section">
        Work
      </h2>
      <p className="t-lead mt-4 max-w-[36rem] text-ink-muted">
        Three apps you can open right now.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-5 min-[1100px]:grid-cols-3">
        {/* Bitewise */}
        <Reveal as="article" className={`${tileClass} tile-bw`} aria-labelledby="bw-title">
          <h3 id="bw-title" className="t-title">
            {bitewise.name}
          </h3>
          <div>
            <p className="t-lead mt-3 text-balance">{bitewise.tileLine}</p>
          </div>
          <Facts
            items={[
              { stat: bitewise.stats.unitTests, label: "unit tests" },
              { stat: bitewise.stats.e2eTests, label: "end-to-end tests" },
              { stat: bitewise.stats.codeReviews, label: "code reviews" },
            ]}
          />
          <div className="mt-6 grid gap-6 sm:max-[1099px]:grid-cols-2">
            {bitewise.decisions.map((d) => (
              <Decision key={d.title} {...d} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <OutLink href={links.bitewise}>Try the live demo</OutLink>
            <DemoVideo name={bitewise.name} sources={demos.bitewise} />
            {flags.caseStudy ? (
              <PageLink href="/work/bitewise" className="text-link press">
                Read the case study
              </PageLink>
            ) : null}
            <OutLink href={links.bitewiseCode}>Code on GitHub</OutLink>
          </div>
          <TileStill image={stills.bitewise} alt={bitewise.still.alt} />
        </Reveal>

        {/* Ascend */}
        <Reveal as="article" delay={80} className={`${tileClass} tile-as`} aria-labelledby="as-title">
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
            <DemoVideo name={ascend.name} sources={demos.ascend} />
          </div>
          <TileStill image={stills.ascend} alt={ascend.still.alt} />
        </Reveal>

        {/* Orbit */}
        <Reveal as="article" delay={160} className={`${tileClass} tile-or`} aria-labelledby="or-title">
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
            <DemoVideo name={orbit.name} sources={demos.orbit} />
          </div>
          <TileStill image={stills.orbit} alt={orbit.still.alt} />
        </Reveal>
      </div>
    </section>
  );
}
