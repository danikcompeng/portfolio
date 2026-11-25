import { About } from "@/components/about";
import { HeroStory } from "@/components/hero-story";
import { HowIBuild } from "@/components/how-i-build";
import { Nav } from "@/components/nav";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroStory />
        <Work />
        <HowIBuild />
        <About />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[var(--max)] flex-wrap items-center justify-between gap-4 px-[var(--gutter)] py-8 text-[0.875rem] text-ink-muted">
          <p>© 2026 Dani Kainikkara · Built with Next.js and Claude Code</p>
          <nav aria-label="Footer" className="flex gap-1">
            <a href="#work" className="press inline-flex min-h-11 items-center px-2 hover:text-ink">
              Work
            </a>
            <a href="#how" className="press inline-flex min-h-11 items-center px-2 hover:text-ink">
              How I build
            </a>
            <a href="#about" className="press inline-flex min-h-11 items-center px-2 hover:text-ink">
              About
            </a>
            <a href="#top" className="press inline-flex min-h-11 items-center px-2 hover:text-ink">
              Back to top
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
