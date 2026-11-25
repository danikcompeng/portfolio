import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero } from "@/content/site";

// The link preview: the headline on the dark stage, with the three products' own colours.
export const alt = "Dani Kainikkara: From idea to live app, end to end.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [regular, semibold] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-400.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist-600.ttf")),
]);

// sRGB equivalents of the dark-theme tokens in app/globals.css (Satori has no OKLCH).
const bg = "#0e0f11";
const ink = "#f2f3f5";
const muted = "#b3b6bc";
const products = [
  { name: "Bitewise", color: "#8fc77a" },
  { name: "Ascend", color: "#ff8f57" },
  { name: "Orbit", color: "#8aa8ff" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: bg,
          color: ink,
          fontFamily: "Geist",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em" }}>Dani Kainikkara</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.04em", maxWidth: 820 }}>
            {hero.title}
          </div>
          <div style={{ display: "flex", gap: 28, fontSize: 30, color: muted }}>
            {products.map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, background: p.color }} />
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, style: "normal", weight: 400 },
        { name: "Geist", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
