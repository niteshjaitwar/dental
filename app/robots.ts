import type { MetadataRoute } from "next";
import { clinicConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${clinicConfig.site.url}/sitemap.xml`,
    host: clinicConfig.site.url,
  };
}
