import Link from "next/link";
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
        <Link href="/#top" className="press -ml-1 inline-flex min-h-11 items-center px-1 text-[0.9375rem] font-semibold tracking-[-0.01em] whitespace-nowrap">
          Dani Kainikkara
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Link href="/#work" className={linkClass}>
            Work
          </Link>
          <Link href="/#how" className={wideLinkClass}>
            How I build
          </Link>
          <Link href="/#about" className={linkClass}>
            About
          </Link>
          {flags.resumePdf ? (
            <a href={resumeHref} className={wideLinkClass}>
              Resume
            </a>
          ) : (
            <span
              className="t-data mx-1 hidden rounded-md border border-dashed border-line-strong px-1.5 py-0.5 text-ink-muted md:inline-block"
              data-placeholder
              title="Resume PDF without the phone number, still to come"
            >
              [Resume]
            </span>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
