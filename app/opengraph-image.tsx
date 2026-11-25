import { hero } from "@/content/site";
import { ogImage, ogSize, products } from "@/lib/og-image";

// The link preview: the headline on the dark stage, with the three products' own colours.
export const alt = "Dani Kainikkara: From idea to live app, end to end.";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage(hero.title, [products.bitewise, products.ascend, products.orbit]);
}
