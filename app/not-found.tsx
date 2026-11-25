import Link from "next/link";
import { Nav } from "@/components/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto flex min-h-[70svh] max-w-[var(--max)] flex-col justify-center px-[var(--gutter)] py-24">
        <h1 className="t-display max-w-[14ch]">That page doesn&apos;t exist.</h1>
        <p className="t-lead mt-6 max-w-[34rem] text-ink-muted">
          It may have moved, or the link has a typo. Everything I&apos;ve built is on the home page.
        </p>
        <div className="mt-9">
          <Link href="/" className="btn btn-primary press">
            Go to the home page
          </Link>
        </div>
      </main>
    </>
  );
}
