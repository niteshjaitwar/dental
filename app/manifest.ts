import type { MetadataRoute } from "next";
import { clinicConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: clinicConfig.manifest.name,
    short_name: clinicConfig.manifest.shortName,
    description: clinicConfig.manifest.description,
    start_url: "/",
    display: "standalone",
    background_color: clinicConfig.manifest.backgroundColor,
    theme_color: clinicConfig.manifest.themeColor,
    icons: [
      {
        src: clinicConfig.brand.favicon,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
