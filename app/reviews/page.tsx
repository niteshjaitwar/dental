import type { Metadata } from "next";
import { ReviewsPageView } from "@/components/pages/reviews/reviews-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "Reviews",
  description: `Read patient reviews for ${clinicConfig.brand.clinicName}.`,
  path: "/reviews",
});

export default function ReviewsPage() {
  return <ReviewsPageView />;
}
