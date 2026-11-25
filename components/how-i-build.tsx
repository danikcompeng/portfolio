import { build, ascend, fmt, type Stat } from "@/content/site";
import { Reveal } from "./reveal";

type Figure = { value: string; label: string };
type Station = {
  name: string;
  agent: boolean;
  body: string;
  figures?: Figure[];
};

const fig = (s: Stat, label: string): Figure => ({ value: fmt(s), label });

// The workflow as practised on Ascend and Orbit. No "every", and the phone check is a
// checklist with no claim it ran (plans/portfolio.md, logic-checker #1).
const before: Station[] = [
  { name: "Plan", agent: false, body: "Written up in plans/*.md before any code." },
  {
    name: "logic-checker",
    agent: true,
    body: "Walks the plan step by step, hunting edge cases.",
    figures: [fig(build.stats.logicChecker, "findings"), fig(build.stats.planReviews, "plan reviews")],
  },
  {
    name: "Build",
    agent: false,
    body: "I build it with Claude Code, with tests.",
    figures: [fig(ascend.stats.unitTests, "unit tests"), fig(ascend.stats.browserTests, "browser tests")],
  },
];
// The two reviewers run in parallel on the finished build.
const parallel: Station[] = [
  {
    name: "code-reviewer",
    agent: true,
    body: "Reads the diff for bugs, security and accessibility.",
    figures: [fig(build.stats.codeReviewer, "findings")],
  },
  {
    name: "design-critic",
    agent: true,
    body: "Judges phone screenshots, light and dark.",
    figures: [fig(build.stats.designCritic, "findings")],
  },
];
const after: Station[] = [
  { name: "Phone check", agent: false, body: "A written checklist for a real phone." },
  {
    name: "Ship",
    agent: false,
    body: "Every finding is logged with what was done.",
    figures: [fig(build.stats.fixed, "fixed"), fig(build.stats.findings, "findings")],
  },
];

function StationBody({ s }: { s: Station }) {
  return (
    <div className="min-w-0">
      <h3 className={`font-semibold tracking-[-0.01em] ${s.agent ? "font-mono text-[0.9375rem]" : ""}`}>
        {s.name}
        <span className="sr-only">{s.agent ? " (read-only AI agent)" : ""}</span>
      </h3>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">{s.body}</p>
      {s.figures ? (
        <ul className="mt-2.5 grid gap-1">
          {s.figures.map((f) => (
            <li key={f.label} className="flex items-baseline gap-2 text-[0.9375rem] text-ink-muted">
              <span className="t-data text-[0.9375rem] font-medium whitespace-nowrap text-ink">{f.value}</span>
              {f.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function StationItem({ s, delay }: { s: Station; delay: number }) {
  return (
    <Reveal as="li" delay={delay} className="station">
      <span className={`node ${s.agent ? "node-agent" : ""}`} aria-hidden="true" />
      <StationBody s={s} />
    </Reveal>
  );
}

export function HowIBuild() {
  return (
    <section id="how" className="border-t border-line bg-bg-sunk" aria-labelledby="how-title">
      <div className="mx-auto max-w-[var(--max)] px-[var(--gutter)] py-[clamp(96px,12vw,160px)]">
        <h2 id="how-title" className="t-section">
          {build.title}
        </h2>
        <p className="t-lead mt-5 max-w-[44rem] text-ink-muted">{build.intro}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ink-muted" aria-hidden="true">
          <span className="inline-flex items-center gap-2">
            <span className="node !mt-0 !size-3.5" /> Me
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="node node-agent !mt-0 !size-3.5 !rounded-[4px]" /> Read-only AI agent
          </span>
        </div>

        <ol className="pipeline mt-12" aria-label="How a feature ships">
          {before.map((s, i) => (
            <StationItem key={s.name} s={s} delay={i * 60} />
          ))}
          {/* The fork: code-reviewer and design-critic review the same build in parallel. */}
          <Reveal as="li" delay={before.length * 60} className="station fork-station">
            <ol className="fork" aria-label="In parallel">
              {parallel.map((s) => (
                <li key={s.name} className="fork-item">
                  <span className="node node-agent" aria-hidden="true" />
                  <StationBody s={s} />
                </li>
              ))}
            </ol>
          </Reveal>
          {after.map((s, i) => (
            <StationItem key={s.name} s={s} delay={(before.length + 1 + i) * 60} />
          ))}
        </ol>

        <h3 className="t-title mt-24">Caught before it shipped</h3>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {build.catches.map((c, i) => (
            <Reveal as="figure" key={c.quote} delay={i * 80} className="m-0">
              <blockquote className="catch t-lead">{c.quote}</blockquote>
              <figcaption className="t-data mt-4 text-ink-muted">
                {c.agent} · {c.app} · {c.severity}
              </figcaption>
            </Reveal>
          ))}
        </div>
        <p className="mt-14 text-[0.875rem] text-ink-muted">{build.footnote}</p>
      </div>
    </section>
  );
}
