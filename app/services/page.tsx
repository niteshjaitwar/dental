import type { Metadata } from "next";
import { ServicesPageView } from "@/components/pages/services/services-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "Services",
  description: `Explore dental services offered by ${clinicConfig.brand.clinicName}, from implants and braces to cosmetic and pediatric care.`,
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageView />;
}
