// WCAG contrast for the colours this site uses: oklch(...) and #hex, with alpha composited
// over a background. OKLCH → OKLab → linear sRGB follows Björn Ottosson's reference matrices.

export type RGB = { r: number; g: number; b: number; a: number }; // linear-light 0..1, alpha 0..1

function num(token: string): number {
  return token.endsWith("%") ? parseFloat(token) / 100 : parseFloat(token);
}

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function parseColor(input: string): RGB {
  const s = input.trim().toLowerCase();
  const hex = s.match(/^#([0-9a-f]{6})$/);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return {
      r: srgbToLinear(((n >> 16) & 255) / 255),
      g: srgbToLinear(((n >> 8) & 255) / 255),
      b: srgbToLinear((n & 255) / 255),
      a: 1,
    };
  }
  const ok = s.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/);
  if (ok) {
    const L = num(ok[1]);
    const C = parseFloat(ok[2]);
    const h = (parseFloat(ok[3]) * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);
    const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    return {
      r: clamp(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
      g: clamp(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
      b: clamp(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
      a: ok[4] === undefined ? 1 : num(ok[4]),
    };
  }
  throw new Error(`Unsupported colour: ${input}`);
}

/** Composite `top` over an opaque `bottom`, in linear light (close enough for contrast). */
export function over(top: RGB, bottom: RGB): RGB {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

export function luminance(c: RGB) {
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

/** WCAG 2 contrast ratio of `fg` on `bg` (fg composited over bg when translucent). */
export function contrast(fg: string, bg: string): number {
  const back = parseColor(bg);
  const front = over(parseColor(fg), back);
  const [hi, lo] = [luminance(front), luminance(back)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
