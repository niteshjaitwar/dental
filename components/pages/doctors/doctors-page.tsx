import { DoctorsHeroSection } from "@/components/pages/doctors/doctors-hero-section";
import { DoctorsSection } from "@/components/sections/doctors-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

export function DoctorsPageView() {
  return (
    <>
      <DoctorsHeroSection />
      <DoctorsSection full />
      <FinalCtaSection />
    </>
  );
}
