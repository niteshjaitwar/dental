"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { ReviewStatCard } from "@/components/ui/review-stat-card";
import { clinicConfig } from "@/lib/config";

export function HeroSection() {
  const heroSlides = [
    {
      word: "Implants",
      image: "/dental_implants_600.jpg",
      alt: "Dental implants treatment setup",
      objectPosition: "center center",
    },
    {
      word: "Aligners",
      image: "/Aligner-Invisalign.jpg",
      alt: "Clear aligner dental treatment",
      objectPosition: "center center",
    },
    {
      word: "Root Canal",
      image: "/Stages-of-Root-Canal-Treatment-Steps.jpg",
      alt: "Root canal treatment illustration",
      objectPosition: "center center",
    },
    {
      word: "Cosmetic Dentistry",
      image: "/cosmetic_dentistry_img.jpg",
      alt: "Cosmetic dentistry smile treatment",
      objectPosition: "center center",
    },
  ] as const;

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[activeSlideIndex];
  return (
    <section className="section-shell relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24">
      <div className="mesh-bg absolute inset-0 -z-20 rounded-[3rem]" />
      <motion.div
        className="absolute top-10 left-[-10%] -z-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "color-mix(in srgb, var(--primary) 28%, transparent)",
        }}
        animate={{ x: [0, 50, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-12 right-[-8%] -z-10 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: "color-mix(in srgb, var(--secondary) 24%, transparent)",
        }}
        animate={{ x: [0, -30, 0], y: [0, -16, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] xl:gap-14">
        <Reveal>
          <span className="eyebrow relative -top-[96px]">{clinicConfig.home.badge}</span>
          <h1 className="-mt-16 max-w-[21ch] font-serif text-[clamp(2.5rem,3.6vw,4rem)] font-semibold leading-[0.96] tracking-tight">
            <span className="block lg:whitespace-nowrap">
              Confident smiles begin with thoughtful dental
            </span>
            <span className="mt-1 block min-h-[1.05em] lg:whitespace-nowrap">
              care Focused on{" "}
              <motion.span
                key={activeSlide.word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="inline-block text-[color:var(--primary)]"
              >
                {activeSlide.word}
              </motion.span>
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] md:text-lg">
            {clinicConfig.hero.subheading}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/book" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              {clinicConfig.hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              {clinicConfig.hero.servicesCta}
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" className="gap-2">
              {clinicConfig.hero.ctaSecondary}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {clinicConfig.reviewStats.map((item) => (
              <ReviewStatCard
                key={item.label}
                label={item.label}
                value={item.value}
                className="rounded-[1.75rem] border border-white/60 bg-white/65 p-4 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/55"
                valueClassName="mt-3 text-2xl font-semibold"
              />
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative mt-8 ml-auto w-full max-w-[280px] translate-x-[44px] translate-y-3 sm:max-w-[320px] lg:mt-12 lg:translate-x-[84px] lg:translate-y-6 xl:mt-16 xl:max-w-[360px]">
            <motion.div
              className="absolute inset-0 rounded-[2.5rem] blur-3xl"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--primary) 24%, transparent), color-mix(in srgb, var(--secondary) 22%, transparent))",
              }}
              animate={{ rotate: [0, 5, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="glass-card relative overflow-hidden rounded-[2.25rem] p-2.5">
              <div className="relative overflow-hidden rounded-[2rem]">
                <Image
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  width={720}
                  height={900}
                  priority
                  className="h-[390px] w-full object-cover transition-all duration-500 sm:h-[430px] xl:h-[470px]"
                  style={{ objectPosition: activeSlide.objectPosition }}
                  sizes="(max-width: 1024px) 320px, 360px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/65 via-slate-900/10 to-transparent p-6 text-white">
                  <p className="text-sm tracking-[0.22em] text-white/70 uppercase">
                    {clinicConfig.hero.imageEyebrow}
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/90">
                    {clinicConfig.hero.imageCaption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
