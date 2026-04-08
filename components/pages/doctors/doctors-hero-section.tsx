import { clinicConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function DoctorsHeroSection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.pages.doctors.eyebrow}
          title={clinicConfig.pages.doctors.title}
          description={clinicConfig.pages.doctors.description}
        />
      </Reveal>
    </section>
  );
}
