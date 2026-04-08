import type { Metadata } from "next";
import { BlogsPageView } from "@/components/pages/blogs/blogs-page";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSiteMetadata({
  title: "Blogs",
  description: `Read patient education articles from ${clinicConfig.brand.clinicName}.`,
  path: "/blogs",
});

export default function BlogsPage() {
  return <BlogsPageView />;
}
