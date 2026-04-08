import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clinicConfig } from "@/lib/config";

export function ContactDetailsSection() {
  return (
    <Reveal className="space-y-6">
      <div className="glass-card rounded-[2rem] p-6">
        <h3 className="mb-4 font-serif text-2xl font-semibold">
          {clinicConfig.ui.visitClinicTitle}
        </h3>
        <div className="space-y-4 text-sm">
          <p className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-[color:var(--primary)]" />
            {`${clinicConfig.contact.address}, ${clinicConfig.contact.city}, ${clinicConfig.contact.region} ${clinicConfig.contact.postalCode}`}
          </p>
          <a href={clinicConfig.contact.phoneHref} className="flex gap-3">
            <Phone className="h-4 w-4 text-[color:var(--primary)]" />
            {clinicConfig.contact.phone}
          </a>
          <a
            href={`mailto:${clinicConfig.contact.email}`}
            className="flex gap-3"
          >
            <Mail className="h-4 w-4 text-[color:var(--primary)]" />
            {clinicConfig.contact.email}
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)]">
        <iframe
          src={clinicConfig.contact.googleMapsEmbedUrl}
          width="100%"
          height="360"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Clinic map"
        />
      </div>
    </Reveal>
  );
}
