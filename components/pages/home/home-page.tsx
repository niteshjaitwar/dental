import dynamic from "next/dynamic";
import { DoctorsSection } from "@/components/sections/doctors-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { HomeAboutPreviewSection } from "@/components/pages/home/home-about-preview-section";

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/testimonials-section").then(
      (mod) => mod.TestimonialsSection,
    ),
  {
    loading: () => <div className="section-shell section-space" />,
  },
);

export function HomePageView() {
  return (
    <>
      <HeroSection />
      <HomeAboutPreviewSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <DoctorsSection />
      <TestimonialsSection compact />
      <FinalCtaSection />
    </>
  );
}
