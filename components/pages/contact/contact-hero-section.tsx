import { clinicConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function ContactHeroSection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.pages.contact.eyebrow}
          title={clinicConfig.pages.contact.title}
          description={clinicConfig.pages.contact.description}
        />
      </Reveal>
    </section>
  );
}
