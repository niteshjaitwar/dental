import type { Metadata } from "next";
import { clinicConfig } from "@/lib/config";

export function getSiteMetadata({
  title,
  description,
  keywords,
  path = "",
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${clinicConfig.brand.clinicName}`
    : clinicConfig.seo.defaultTitle;
  const pageDescription = description || clinicConfig.seo.defaultDescription;
  const url = `${clinicConfig.site.url}${path}`;
  const ogImageUrl = `${clinicConfig.site.url}/opengraph-image`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || clinicConfig.seo.keywords,
    metadataBase: new URL(clinicConfig.site.url),
    category: clinicConfig.seo.category,
    alternates: {
      canonical: path || "/",
    },
    applicationName: clinicConfig.brand.clinicName,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      type: "website",
      locale: clinicConfig.site.locale,
      siteName: clinicConfig.brand.clinicName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: clinicConfig.brand.clinicName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    icons: {
      icon: clinicConfig.brand.favicon,
      shortcut: clinicConfig.brand.favicon,
      apple: clinicConfig.brand.favicon,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
