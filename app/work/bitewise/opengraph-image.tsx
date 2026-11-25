import { caseStudy } from "@/content/site";
import { ogImage, ogSize, products } from "@/lib/og-image";

// The case study's link preview: its title, in Bitewise's colour only.
export const alt = "Dani Kainikkara: Bitewise case study. Cheap meals that hit your macros.";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage(caseStudy.title, [products.bitewise]);
}
