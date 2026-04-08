import { clinicConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function BookHeroSection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.pages.book.eyebrow}
          title={clinicConfig.pages.book.title}
          description={clinicConfig.pages.book.description}
        />
      </Reveal>
    </section>
  );
}
