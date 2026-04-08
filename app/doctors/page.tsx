import type { Metadata } from "next";
import { DoctorsPageView } from "@/components/pages/doctors/doctors-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "Doctors",
  description: `Meet the doctors at ${clinicConfig.brand.clinicName}.`,
  path: "/doctors",
});

export default function DoctorsPage() {
  return <DoctorsPageView />;
}
