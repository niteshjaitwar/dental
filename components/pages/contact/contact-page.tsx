import { MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactDetailsSection } from "@/components/pages/contact/contact-details-section";
import { ContactHeroSection } from "@/components/pages/contact/contact-hero-section";
import { clinicConfig } from "@/lib/config";

export function ContactPageView() {
  return (
    <>
      <ContactHeroSection />
      <section className="section-shell pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <ContactForm />
          <ContactDetailsSection />
        </div>
        <a
          href={`https://wa.me/${clinicConfig.contact.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-24 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          <MessageCircle className="h-4 w-4" />
          {clinicConfig.ui.whatsappLabel}
        </a>
      </section>
    </>
  );
}
