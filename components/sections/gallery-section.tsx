import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function GallerySection() {
  return (
    <section className="section-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow={clinicConfig.sections.gallery.eyebrow}
          title={clinicConfig.sections.gallery.title}
          description={clinicConfig.sections.gallery.description}
        />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {clinicConfig.gallery.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08}>
            <article className="glass-card rounded-[2rem] p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[color:var(--muted)] uppercase">
                    {clinicConfig.sections.gallery.beforeLabel}
                  </p>
                  <Image
                    src={item.before}
                    alt={`${item.title} before`}
                    width={640}
                    height={480}
                    className="rounded-[1.5rem]"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[color:var(--muted)] uppercase">
                    {clinicConfig.sections.gallery.afterLabel}
                  </p>
                  <Image
                    src={item.after}
                    alt={`${item.title} after`}
                    width={640}
                    height={480}
                    className="rounded-[1.5rem]"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
