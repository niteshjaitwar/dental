import { clinicConfig } from "@/lib/config";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinicConfig.brand.legalName,
    image: `${clinicConfig.site.url}${clinicConfig.brand.logoUrl}`,
    telephone: clinicConfig.contact.phone,
    email: clinicConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicConfig.contact.address,
      addressLocality: clinicConfig.contact.city,
      addressRegion: clinicConfig.contact.region,
      postalCode: clinicConfig.contact.postalCode,
      addressCountry: clinicConfig.contact.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinicConfig.contact.latitude,
      longitude: clinicConfig.contact.longitude,
    },
    url: clinicConfig.site.url,
    sameAs: Object.values(clinicConfig.social),
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
