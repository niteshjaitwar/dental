import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { Reveal } from "@/components/ui/reveal";
import { ReviewStatCard } from "@/components/ui/review-stat-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function ReviewsPageView() {
  return (
    <>
      <section className="section-shell section-space">
        <Reveal>
          <SectionHeading
            eyebrow="Patient Reviews"
            title="Proof that calm, premium care translates into real patient loyalty."
            description="A dedicated reviews page helps clinics separate social proof from the homepage while still keeping credibility easy to access."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {clinicConfig.reviewStats.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08}>
              <ReviewStatCard
                label={item.label}
                value={item.value}
                className="glass-card rounded-[2rem] p-6"
              />
            </Reveal>
          ))}
        </div>
      </section>
      <TestimonialsSection compact={false} />
      <FinalCtaSection />
    </>
  );
}
