"use client";

// Scroll reveal: 0.97 scale + fade, once (the brief's motion rule). Content is visible by
// default; only an element that starts below the fold is hidden, after mount, so nothing
// on screen blinks and nothing is lost without JS. Reduced motion: never hidden.

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  style,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
} & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      {...rest}
      ref={ref}
      style={{ ...style, ...(delay ? { "--reveal-delay": `${delay}ms` } : null) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
