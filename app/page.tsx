import type { Metadata } from "next";
import { HomePageView } from "@/components/pages/home/home-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  description: clinicConfig.seo.defaultDescription,
  path: "/",
});

export default function HomePage() {
  return <HomePageView />;
}
