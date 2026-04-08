import { CheckCircle2 } from "lucide-react";
import { CounterCard } from "@/components/ui/counter-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function WhyChooseUsSection() {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <SectionHeading
            eyebrow={clinicConfig.sections.whyChooseUs.eyebrow}
            title={clinicConfig.sections.whyChooseUs.title}
            description={clinicConfig.sections.whyChooseUs.description}
          />
          <div className="mt-8 space-y-4">
            {clinicConfig.differentiators.map((item) => (
              <div
                key={item}
                className="glass-card flex items-start gap-3 rounded-[1.5rem] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[color:var(--secondary)]" />
                <p className="text-sm leading-7">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {clinicConfig.stats.map((stat) => (
            <CounterCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
