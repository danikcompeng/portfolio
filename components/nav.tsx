import { PageLink } from "./page-link";
import { flags, resumeHref } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

const linkBase = "press min-h-11 items-center rounded-lg px-2.5 text-[0.9375rem] whitespace-nowrap text-ink-muted hover:text-ink";
const linkClass = `${linkBase} inline-flex`;
// Wide screens only: "How I build" and Resume are also in the footer.
const wideLinkClass = `${linkBase} hidden md:inline-flex`;

export function Nav() {
  return (
    <header className="nav">
      <nav
        aria-label="Main"
        className="mx-auto flex h-full max-w-[var(--max)] items-center justify-between gap-2 px-[var(--gutter)]"
      >
        <PageLink href="/#top" className="press -ml-1 inline-flex min-h-11 items-center px-1 text-[0.9375rem] font-semibold tracking-[-0.01em] whitespace-nowrap">
          Dani Kainikkara
        </PageLink>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <PageLink href="/#work" className={linkClass}>
            Work
          </PageLink>
          <PageLink href="/#how" className={wideLinkClass}>
            How I build
          </PageLink>
          <PageLink href="/#about" className={linkClass}>
            About
          </PageLink>
          {flags.resumePdf ? (
            <a href={resumeHref} className={wideLinkClass}>
              Resume
            </a>
          ) : null}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
