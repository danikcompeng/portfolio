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
 * copy (display: none) never downloads.
 */
export function ThemedImage({
  dark,
  light,
  alt,
  sizes,
  className = "",
}: {
  dark: StaticImageData;
  light: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <>
      <Image src={dark} alt={alt} sizes={sizes} className={`only-dark ${className}`} />
      <Image src={light} alt={alt} sizes={sizes} className={`only-light ${className}`} />
    </>
  );
}

/** A screen layer for a phone: one picture, or a theme pair. */
export function ScreenLayer({
  image,
  alt,
  sizes,
  active = true,
}: {
  image: StaticImageData | { dark: StaticImageData; light: StaticImageData };
  alt: string;
  sizes: string;
  active?: boolean;
}) {
  return (
    <div className="layer" data-active={active}>
      {"src" in image ? (
        <Image src={image} alt={alt} sizes={sizes} />
      ) : (
        <ThemedImage dark={image.dark} light={image.light} alt={alt} sizes={sizes} />
      )}
    </div>
  );
}
