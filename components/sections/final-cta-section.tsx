import { ArrowRight, PhoneCall } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { clinicConfig } from "@/lib/config";

export function FinalCtaSection() {
  return (
    <section className="section-shell pb-24">
      <Reveal>
        <div
          className="overflow-hidden rounded-[2.5rem] px-6 py-10 text-white md:px-10 md:py-12"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), var(--secondary))",
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-white/75 uppercase">
                {clinicConfig.sections.finalCta.eyebrow}
              </p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold md:text-5xl">
                {clinicConfig.sections.finalCta.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                {clinicConfig.sections.finalCta.description}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <ButtonLink
                href="/book"
                className="gap-2 bg-white !text-slate-900 hover:bg-slate-100"
              >
                {clinicConfig.sections.finalCta.primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <a
                href={clinicConfig.contact.phoneHref}
                className="btn-secondary gap-2 border-white/30 bg-white/10 text-white"
              >
                <PhoneCall className="h-4 w-4" />
                {clinicConfig.sections.finalCta.secondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
