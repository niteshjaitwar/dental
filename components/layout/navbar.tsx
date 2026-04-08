"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/lib/config";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all ${
          scrolled
            ? "glass-card"
            : "border-transparent bg-white/45 dark:bg-slate-950/20"
        }`}
      >
        <Link href="/" className="flex h-10 w-[180px] shrink-0 items-center sm:w-[200px]">
          <Image
            src={clinicConfig.brand.logoUrl}
            alt={clinicConfig.brand.clinicName}
            width={520}
            height={140}
            priority
            className="h-full w-full object-contain object-left"
          />
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          {clinicConfig.navLinks.map((item) =>
            item.children?.length ? (
              <div
                key={item.href}
                className="group relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition-colors hover:bg-white/70 hover:text-[color:var(--foreground)] dark:hover:bg-slate-900/60"
                  onClick={() => setAboutOpen((value) => !value)}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {aboutOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="absolute top-full left-0 mt-3 min-w-56 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3 shadow-2xl"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--background)] hover:text-[color:var(--foreground)]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition-colors hover:bg-white/70 hover:text-[color:var(--foreground)] dark:hover:bg-slate-900/60"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            href={clinicConfig.contact.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium dark:bg-slate-900/60"
          >
            <Phone className="h-4 w-4 text-[color:var(--primary)]" />
            {clinicConfig.contact.phone}
          </a>
          <ButtonLink href="/book">{clinicConfig.ui.bookNowLabel}</ButtonLink>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={clinicConfig.ui.menuOpenLabel}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="section-shell mt-3 lg:hidden"
          >
            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex flex-col gap-2">
                {clinicConfig.navLinks.map((item) =>
                  item.children?.length ? (
                    <div
                      key={item.href}
                      className="rounded-[1.5rem] border border-[color:var(--border)] p-2"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-base font-medium"
                        onClick={() => setAboutOpen((value) => !value)}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {aboutOpen ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 px-1 pb-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="rounded-2xl px-3 py-3 text-sm font-medium text-[color:var(--muted)]"
                                  onClick={() => setOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl px-3 py-3 text-base font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <div className="mt-3 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
                  <ThemeToggle />
                  <ButtonLink href="/book" onClick={() => setOpen(false)}>
                    {clinicConfig.ui.bookNowLabel}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
