import { PageLink } from "./page-link";
import { flags, resumeHref } from "@/content/site";

const linkClass = "press inline-flex min-h-11 items-center px-2 hover:text-ink";

/**
 * The footer on every page. Off the home page its section links go home ("/#work"); "Back to
 * top" always targets the page's own #top. Resume shows here too once its flag is on, since
 * the nav hides it on phones.
 */
export function Footer({ onHome = false }: { onHome?: boolean }) {
  const home = onHome ? "" : "/";
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[var(--max)] flex-wrap items-center justify-between gap-4 px-[var(--gutter)] py-8 text-[0.875rem] text-ink-muted">
        <p>© 2026 Dani Kainikkara · Built with Next.js and Claude Code</p>
        <nav aria-label="Footer" className="-mx-2 flex flex-wrap gap-1">
          <PageLink href={`${home}#work`} className={linkClass}>
            Work
          </PageLink>
          <PageLink href={`${home}#about`} className={linkClass}>
            About
          </PageLink>
          {flags.resumePdf ? (
            <a href={resumeHref} className={linkClass}>
              Resume
            </a>
          ) : null}
          <a href="#top" className={linkClass}>
            Back to top
          </a>
        </nav>
      </div>
    </footer>
  );
}
