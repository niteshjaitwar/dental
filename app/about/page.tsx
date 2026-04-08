import type { Metadata } from "next";
import { AboutPageView } from "@/components/pages/about/about-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "About",
  description: `Learn about ${clinicConfig.brand.clinicName}, its philosophy, and the premium patient experience behind the clinic.`,
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageView />;
}
