import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { HeroStory } from "@/components/hero-story";
import { HowIBuild } from "@/components/how-i-build";
import { Nav } from "@/components/nav";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroStory />
        <Work />
        <HowIBuild />
        <About />
      </main>
      <Footer onHome />
    </>
  );
}
