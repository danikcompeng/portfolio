import { about, flags, links, resumeHref } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { ArrowUpRight } from "./icons";
import { InlinePlaceholder, Placeholder } from "./placeholder";
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

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[var(--max)] px-[var(--gutter)] py-[clamp(96px,12vw,160px)]" aria-labelledby="about-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="order-last lg:order-none lg:col-span-4">
          <Placeholder label={about.photo} ratio="4 / 5" className="max-w-[360px]" />
        </Reveal>
        <div className="lg:col-span-8">
          <h2 id="about-title" className="t-section">
            {about.title}
          </h2>
          <p className="t-lead mt-5 max-w-[38rem]">{about.body}</p>
          <dl className="mt-10 grid max-w-[44rem] gap-x-8 gap-y-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
            {about.facts.map((f) => (
              <div key={f.label} className="contents">
                <dt className="pt-0.5 text-[0.9375rem] text-ink-muted">{f.label}</dt>
                <dd className="-mt-4 sm:mt-0">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div id="contact" className="mt-[clamp(96px,12vw,160px)] border-t border-line pt-[clamp(56px,8vw,96px)]">
        <h2 className="t-section">Say hello</h2>
        <p className="t-lead mt-4 max-w-[34rem] text-ink-muted">
          The quickest way to reach me is email.
        </p>
        <a
          href={`mailto:${links.email}`}
          className="press mt-8 inline-block break-all text-[clamp(1.5rem,0.9rem+3vw,3.25rem)] font-semibold tracking-[-0.03em] underline decoration-line-strong decoration-1 underline-offset-[0.18em] hover:decoration-current"
        >
          {links.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="w-full sm:w-auto">
            <CopyEmail email={links.email} />
          </div>
          <OutLink href={links.github}>GitHub</OutLink>
          <OutLink href={links.linkedin}>LinkedIn</OutLink>
          {flags.resumePdf ? (
            <a href={resumeHref} className="text-link press">
              Resume (PDF)
            </a>
          ) : (
            <InlinePlaceholder label={about.resume} />
          )}
        </div>
      </div>
    </section>
  );
}
