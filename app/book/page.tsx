import type { Metadata } from "next";
import { BookPageView } from "@/components/pages/book/book-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "Book Appointment",
  description: `Book an appointment online with ${clinicConfig.brand.clinicName}.`,
  path: "/book",
});

export default function BookPage() {
  return <BookPageView />;
}
