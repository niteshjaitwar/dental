import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function AboutIntroSection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.pages.about.eyebrow}
          title={clinicConfig.pages.about.title}
          description={clinicConfig.pages.about.description}
        />
      </Reveal>
      <Reveal className="glass-card mt-10 rounded-[2rem] p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-serif text-2xl font-semibold">
              {clinicConfig.pages.about.philosophyTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              {clinicConfig.pages.about.philosophyBody}
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold">
              {clinicConfig.pages.about.patientsNoticeTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              {clinicConfig.pages.about.patientsNoticeBody}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
