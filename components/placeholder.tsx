import type { CSSProperties } from "react";

/**
 * Something Dani still has to supply, shown in [BRACKETS] so it can't ship unnoticed
 * (plans/portfolio.md section 4). Never filled with made-up material.
 */
export function Placeholder({
  label,
  ratio,
  className = "",
  style,
}: {
  label: string;
  ratio?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`placeholder ${className}`} style={{ aspectRatio: ratio, ...style }} data-placeholder>
      <span className="t-data">[{label}]</span>
    </div>
  );
}

/** An inline placeholder for text (a one-liner, a link). */
export function InlinePlaceholder({ label }: { label: string }) {
  return (
    <span
      className="t-data inline-block rounded-md border border-dashed border-line-strong px-1.5 py-0.5 text-ink-muted"
      data-placeholder
    >
      [{label}]
    </span>
  );
}
