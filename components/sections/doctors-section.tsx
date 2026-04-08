import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function DoctorsSection({ full = false }: { full?: boolean }) {
  const doctors = full
    ? clinicConfig.doctors
    : clinicConfig.doctors.slice(0, 3);

  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.sections.doctors.eyebrow}
          title={clinicConfig.sections.doctors.title}
          description={clinicConfig.sections.doctors.description}
        />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {doctors.map((doctor, index) => (
          <Reveal key={doctor.id} delay={index * 0.08}>
            <article className="glass-card flex h-full flex-col overflow-hidden rounded-[2rem]">
              <div className="relative aspect-[4/4.1] overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-medium text-[color:var(--primary)]">
                  {doctor.specialty}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{doctor.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {doctor.experience}
                </p>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-[color:var(--muted)]">
                  {doctor.bio}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
