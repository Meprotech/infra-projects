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
      <Hero />
      <About />
      <Presence />
      <Services />
      <Projects />
      <WhyChooseUs />
      <ScrollJourney />
      <Clients />
      <CTABanner />
    </>
  );
}
