import type { MetadataRoute } from "next";
import { clinicConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/doctors",
    "/reviews",
    "/book",
    "/contact",
    "/blogs",
    ...clinicConfig.blogPosts.map((post) => `/blogs/${post.slug}`),
  ];

  return routes.map((route) => ({
    url: `${clinicConfig.site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blogs/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
