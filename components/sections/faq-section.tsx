import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function FaqSection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.sections.faq.eyebrow}
          title={clinicConfig.sections.faq.title}
          description={clinicConfig.sections.faq.description}
          align="center"
        />
      </Reveal>
      <Reveal className="mx-auto mt-12 max-w-4xl">
        <FaqAccordion items={clinicConfig.faqs} />
      </Reveal>
    </section>
  );
}
