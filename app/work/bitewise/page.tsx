import type { Metadata } from "next";
import { PageLink } from "@/components/page-link";
import { Footer } from "@/components/footer";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
import { screens, swapSheet } from "@/components/media";
import { Nav } from "@/components/nav";
import { Phone, ScreenLayer } from "@/components/phone";
import { Facts, OutLink } from "@/components/work";
import { bitewise, caseStudy, links, story, type Part } from "@/content/site";

export const metadata: Metadata = {
  title: caseStudy.metaTitle,
  description: caseStudy.metaDescription,
  // Set in full: a page's openGraph replaces the layout's rather than merging with it.
  openGraph: {
    title: caseStudy.metaTitle,
    description: caseStudy.metaDescription,
    type: "article",
    url: "/work/bitewise",
  },
};

/** A story step's alt text; throws rather than ship an unlabelled screen if an id changes. */
function altFor(id: string) {
  const alt = story.steps.find((s) => s.id === id)?.alt;
  if (!alt) throw new Error(`No story step "${id}" for an alt text`);
  return alt;
}

/** One paragraph: plain text, an emphasised word, or a link that opens in a new tab. */
function Paragraph({ parts }: { parts: Part[] }) {
  return (
    <p className="cs-prose">
      {parts.map((part, i) => {
        if (typeof part === "string") return part;
        if ("em" in part) return <em key={i}>{part.em}</em>;
        // The last word and the arrow never part, so the arrow can't start a line.
        const cut = part.text.lastIndexOf(" ") + 1;
        return (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${part.text} (opens in a new tab)`}
            className="cs-link"
          >
            {part.text.slice(0, cut)}
            <span className="whitespace-nowrap">
              {part.text.slice(cut)}
              <ArrowUpRight />
            </span>
          </a>
        );
      })}
    </p>
  );
}

export default function BitewiseCaseStudy() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <article aria-labelledby="cs-title">
          <header id="top" className="mx-auto max-w-[var(--max)] px-[var(--gutter)] pt-[clamp(20px,3vw,40px)]">
            <div className="tile tile-bw">
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
                <div className="lg:py-8">
                  <h1 id="cs-title" className="t-section max-w-[15ch] text-balance">
                    {caseStudy.title}
                  </h1>
                  <Facts
                    items={[
                      { stat: bitewise.stats.unitTests, label: "unit tests" },
                      { stat: bitewise.stats.e2eTests, label: "end-to-end tests" },
                      { stat: bitewise.stats.codeReviews, label: "code reviews" },
                    ]}
                  />
                  <div className="mt-8 flex flex-wrap gap-x-6">
                    <OutLink href={links.bitewise}>Try the live demo</OutLink>
                    <OutLink href={links.bitewiseCode}>Code on GitHub</OutLink>
                    <OutLink href={links.bitewiseTour}>Full tour video</OutLink>
                  </div>
                </div>
                <figure className="justify-self-center">
                  <Phone style={{ "--phone-w": "min(68vw, 290px)" } as React.CSSProperties}>
                    <ScreenLayer image={screens.today} alt={altFor("problem")} sizes="290px" priority />
                  </Phone>
                </figure>
              </div>
            </div>
          </header>

          {/* One reading column; the swap screen sits beside the ranking and the sections after it. */}
          <div className="cs-body mx-auto max-w-[var(--max)] px-[var(--gutter)]">
            {caseStudy.sections.map((section) => (
              <SectionWithFigure key={section.id} section={section} />
            ))}
          </div>

          <div className="mx-auto max-w-[var(--max)] px-[var(--gutter)] pb-[clamp(72px,9vw,128px)]">
            <div className="cs-end flex max-w-[38rem] flex-wrap gap-x-6 border-t border-line pt-8">
              <PageLink href="/#work" className="text-link press">
                <ArrowLeft />
                Back to the work
              </PageLink>
              <OutLink href={links.bitewise}>Try the live demo</OutLink>
              <OutLink href={links.bitewiseCode}>Code on GitHub</OutLink>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function SectionWithFigure({ section }: { section: (typeof caseStudy.sections)[number] }) {
  return (
    <>
      <section id={`cs-${section.id}`} aria-labelledby={`cs-${section.id}-title`} className="cs-section">
        <h2 id={`cs-${section.id}-title`} className="t-title text-balance">
          {section.title}
        </h2>
        {section.body.map((parts, i) => (
          <Paragraph key={i} parts={parts} />
        ))}
        {"list" in section && section.list ? (
          <ul className="cs-list">
            {section.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>
      {section.id === "ranking" ? (
        <figure className="cs-figure">
          <Phone>
            <ScreenLayer image={swapSheet} alt={caseStudy.swapFigure.alt} sizes="340px" />
          </Phone>
          <figcaption className="t-data mt-4 text-center text-ink-muted">{caseStudy.swapFigure.caption}</figcaption>
        </figure>
      ) : null}
    </>
  );
}
