import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Stethoscope,
} from "lucide-react";
import { clinicConfig } from "@/lib/config";

const utilityCards = [
  {
    title: "Book a visit",
    description: "Choose a doctor, treatment, or preferred time in a few taps.",
    href: "/book",
    icon: CalendarDays,
  },
  {
    title: "Send an enquiry",
    description: "Ask about pricing, treatment options, or appointment support.",
    href: "/contact",
    icon: Stethoscope,
  },
  {
    title: "Find the clinic",
    description: "Open directions, parking context, and nearby location details.",
    href: "/contact",
    icon: Building2,
  },
];

export function Footer() {
  const quickLinks = Array.from(
    new Map(
      clinicConfig.navLinks.flatMap((item) =>
        item.children?.length ? item.children : [item],
      ).map((item) => [item.href, item]),
    ).values(),
  );

  const addressLine = `${clinicConfig.contact.address}, ${clinicConfig.contact.city}, ${clinicConfig.contact.region} ${clinicConfig.contact.postalCode}`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 overflow-hidden bg-[#0f5f79] text-white">
      <div className="border-y border-white/10 bg-[#18485a]">
        <div className="section-shell grid gap-px py-2 md:grid-cols-3">
          {utilityCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 hover:bg-white/6 lg:px-4 ${
                  index < utilityCards.length - 1 ? "md:border-r md:border-white/10" : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-lg font-semibold leading-tight">
                    {card.title}
                  </p>
                  <p className="mt-0.5 max-w-xs text-sm leading-5 text-white/68">
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="section-shell py-6 lg:py-7">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_0.85fr_1.05fr]">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="font-mono text-xs tracking-[0.28em] text-[#ffcc32] uppercase">
              Address
            </p>
            <div className="mt-3 space-y-3 text-sm leading-7 text-white/90">
              <p className="max-w-xs">{addressLine}</p>
            </div>

            <p className="mt-5 font-mono text-xs tracking-[0.28em] text-[#ffcc32] uppercase">
              Contact
            </p>
            <div className="mt-3 space-y-2.5 text-sm leading-6 text-white/90">
              <a
                href={clinicConfig.contact.phoneHref}
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#ffcc32]" />
                <span>{clinicConfig.contact.phone}</span>
              </a>
              <a
                href={`tel:${clinicConfig.contact.emergencyPhone.replace(/[^\d+]/g, "")}`}
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <MessageCircleMore className="mt-1 h-4 w-4 shrink-0 text-[#ffcc32]" />
                <span>{clinicConfig.contact.emergencyPhone}</span>
              </a>
              <a
                href={`mailto:${clinicConfig.contact.email}`}
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#ffcc32]" />
                <span>{clinicConfig.contact.email}</span>
              </a>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="font-mono text-xs tracking-[0.28em] text-[#ffcc32] uppercase">
              Important Links
            </p>
            <div className="mt-3 grid gap-1.5 text-sm text-white/90 sm:grid-cols-2 lg:grid-cols-1">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-[#ffcc32]" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="font-mono text-xs tracking-[0.28em] text-[#ffcc32] uppercase">
                  Our Location
                </p>
                <p className="mt-1 text-xs leading-5 text-white/72">
                  Visit the clinic or open directions instantly.
                </p>
              </div>
              <a
                href={clinicConfig.contact.googleMapsEmbedUrl.replace("&output=embed", "")}
                target="_blank"
                rel="noreferrer"
                className="hidden shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/12 sm:inline-flex"
              >
                <MapPin className="h-3.5 w-3.5 text-[#ffcc32]" />
                <span>Open Maps</span>
              </a>
            </div>
            <div className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 text-xs font-medium text-sky-700">
                <MapPin className="h-3.5 w-3.5" />
                <span>Open in Maps</span>
              </div>
              <div className="aspect-[16/6.6]">
                <iframe
                  src={clinicConfig.contact.googleMapsEmbedUrl}
                  title={`${clinicConfig.brand.clinicName} map`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-white/10 pt-3 text-xs leading-6 text-white/72 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} {clinicConfig.brand.legalName}.</p>
          <p>Built for clear enquiries, fast booking, and trust-led browsing.</p>
        </div>
      </div>
    </footer>
  );
}
