import type { Metadata } from "next";
import { ContactPageView } from "@/components/pages/contact/contact-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "Contact",
  description: `Send an enquiry to ${clinicConfig.brand.clinicName}.`,
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageView />;
}
