import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { ScrollJourney } from "@/components/sections/ScrollJourney";
import { Projects } from "@/components/sections/Projects";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Presence } from "@/components/sections/Presence";
import { Clients } from "@/components/sections/Clients";
import { CTABanner } from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      {/* Hero shows immediately; ScrollJourney is sticky (a transform wrapper
          would break position:sticky) — so AOS is applied to the rest. */}
      <Hero />
      <div data-aos="fade-up">
        <About />
      </div>
      <div data-aos="fade-up">
        <Presence />
      </div>
      <div data-aos="fade-up">
        <Services />
      </div>
      <div data-aos="fade-up">
        <Projects />
      </div>
      <div data-aos="fade-up">
        <WhyChooseUs />
      </div>
      <ScrollJourney />
      <div data-aos="fade-up">
        <Clients />
      </div>
      <div data-aos="fade-up">
        <CTABanner />
      </div>
    </>
  );
}
