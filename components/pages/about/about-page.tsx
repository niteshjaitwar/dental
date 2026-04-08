import { FaqSection } from "@/components/sections/faq-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { AboutIntroSection } from "@/components/pages/about/about-intro-section";

export function AboutPageView() {
  return (
    <>
      <AboutIntroSection />
      <WhyChooseUsSection />
      <GallerySection />
      <FaqSection />
    </>
  );
}
