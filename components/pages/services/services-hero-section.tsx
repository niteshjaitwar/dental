import { clinicConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function ServicesHeroSection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.pages.services.eyebrow}
          title={clinicConfig.pages.services.title}
          description={clinicConfig.pages.services.description}
        />
      </Reveal>
    </section>
  );
}
