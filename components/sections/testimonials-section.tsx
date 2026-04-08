"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";

export function TestimonialsSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const cards = compact
    ? [...clinicConfig.testimonials, ...clinicConfig.testimonials]
    : clinicConfig.testimonials;

  return (
    <section className="section-shell section-space overflow-hidden">
      <SectionHeading
        eyebrow={clinicConfig.sections.testimonials.eyebrow}
        title={clinicConfig.sections.testimonials.title}
        description={clinicConfig.sections.testimonials.description}
      />
      {compact ? (
        <div className="mt-12 overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {cards.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="glass-card min-h-64 max-w-sm min-w-[320px] rounded-[2rem] p-6"
              >
                <Quote className="h-8 w-8 text-[color:var(--primary)]" />
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map(
                    (_, ratingIndex) => (
                      <Star
                        key={`${testimonial.name}-${ratingIndex}`}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ),
                  )}
                </div>
                <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
                  {testimonial.quote}
                </p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    {testimonial.treatment}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {cards.map((testimonial, index) => (
            <article
              key={`${testimonial.name}-${index}`}
              className="glass-card rounded-[2rem] p-6"
            >
              <Quote className="h-8 w-8 text-[color:var(--primary)]" />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map(
                  (_, ratingIndex) => (
                    <Star
                      key={`${testimonial.name}-${ratingIndex}`}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ),
                )}
              </div>
              <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
                {testimonial.quote}
              </p>
              <div className="mt-6">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-[color:var(--muted)]">
                  {testimonial.treatment}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
