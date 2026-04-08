import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ServicesHeroSection } from "@/components/pages/services/services-hero-section";

export function ServicesPageView() {
  return (
    <>
      <ServicesHeroSection />
      <ServicesSection full />
      <FinalCtaSection />
    </>
  );
}
