import HeroSection from "@/components/HeroSection";
import WhoWeAre from "@/components/WhoWeAre";
import Mentorship from "@/components/Mentorship";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
    <ScrollReveal>
      <HeroSection />
    </ScrollReveal>
    <ScrollReveal>
      <WhoWeAre />
    </ScrollReveal>
    <ScrollReveal>
      <Mentorship />
    </ScrollReveal>
    <ScrollReveal>
      <Pricing />
    </ScrollReveal>
    <ScrollReveal>
      <Testimonials />
    </ScrollReveal>
    <ScrollReveal>
      <BlogSection />
    </ScrollReveal>
    </>
  );
}
