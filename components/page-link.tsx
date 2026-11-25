import type { AnchorHTMLAttributes } from "react";

/**
 * A plain link between the site's pages (and to their sections), on purpose not next/link.
 * Both pages are static, so a full load is quick, and it keeps the browser's own behaviour:
 * the page left behind doesn't stay mounted but hidden (cacheComponents keeps visited routes
 * alive, which duplicated ids and stranded focus in it), and "#work" moves the keyboard's
 * starting point to the section, which next/link's scroll doesn't (code-reviewer, round 5).
 */
export function PageLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} />;
}
