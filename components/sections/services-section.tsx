import * as Icons from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function ServicesSection({ full = false }: { full?: boolean }) {
  const items = full
    ? clinicConfig.services
    : clinicConfig.services.slice(0, 6);

  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.sections.services.eyebrow}
          title={clinicConfig.sections.services.title}
          description={clinicConfig.sections.services.description}
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((service, index) => {
          const Icon = Icons[
            service.icon as keyof typeof Icons
          ] as React.ComponentType<{ className?: string }>;
          return (
            <Reveal key={service.title} delay={index * 0.08}>
              <div className="glass-card group h-full rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10">
                  <Icon className="h-6 w-6 text-[color:var(--primary)]" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {service.description}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
      {!full ? (
        <Reveal className="mt-10">
          <ButtonLink href="/services" variant="secondary">
            {clinicConfig.sections.services.allServicesLabel}
          </ButtonLink>
        </Reveal>
      ) : null}
    </section>
  );
}
