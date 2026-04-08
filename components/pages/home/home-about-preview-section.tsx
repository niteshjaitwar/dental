import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { ReviewStatCard } from "@/components/ui/review-stat-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function HomeAboutPreviewSection() {
  return (
    <section className="section-shell section-space -mt-16 md:-mt-20">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="About The Clinic"
            title={clinicConfig.home.aboutTitle}
            description={clinicConfig.home.aboutDescription}
          />
          <div className="mt-8 space-y-4">
            {clinicConfig.home.aboutHighlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-3xl border border-[color:var(--border)] bg-white/60 p-4 dark:bg-slate-900/60"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[color:var(--secondary)]" />
                <p className="text-sm leading-7">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/about" variant="secondary">
              Learn More About Us
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-5 sm:grid-cols-2">
            {clinicConfig.reviewStats.map((item, index) => (
              <ReviewStatCard
                key={item.label}
                label={item.label}
                value={item.value}
                className={`glass-card rounded-[2rem] p-6 ${index === 0 ? "sm:col-span-2" : ""}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
