import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";

/** A flat phone with concentric corners. Children are the stacked screen layers. */
export function Phone({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`phone ${className}`} style={style}>
      <div className="phone-screen">{children}</div>
    </div>
  );
}

/**
 * The same picture in both themes, each copy shown only in its theme. Lazy, so the hidden
 * copy (display: none) never downloads; `priority` raises the fetch priority of the visible
 * one (the first viewport's picture) without preloading both, as VideoLayer's posters do.
 */
export function ThemedImage({
  dark,
  light,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  dark: StaticImageData;
  light: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const fetchPriority = priority ? "high" : "auto";
  return (
    <>
      <Image src={dark} alt={alt} sizes={sizes} fetchPriority={fetchPriority} className={`only-dark ${className}`} />
      <Image src={light} alt={alt} sizes={sizes} fetchPriority={fetchPriority} className={`only-light ${className}`} />
    </>
  );
}

/** A screen layer for a phone: one picture, or a theme pair. */
export function ScreenLayer({
  image,
  alt,
  sizes,
  active = true,
  priority = false,
}: {
  image: StaticImageData | { dark: StaticImageData; light: StaticImageData };
  alt: string;
  sizes: string;
  active?: boolean;
  priority?: boolean;
}) {
  return (
    <div className="layer" data-active={active}>
      {"src" in image ? (
        <Image src={image} alt={alt} sizes={sizes} fetchPriority={priority ? "high" : "auto"} />
      ) : (
        <ThemedImage dark={image.dark} light={image.light} alt={alt} sizes={sizes} priority={priority} />
      )}
    </div>
  );
}
