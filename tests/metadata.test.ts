import { describe, expect, it } from "vitest";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

describe("getSiteMetadata", () => {
  it("uses clinic config defaults", () => {
    const metadata = getSiteMetadata();

    expect(metadata.title).toBe(clinicConfig.seo.defaultTitle);
    expect(metadata.description).toBe(clinicConfig.seo.defaultDescription);
    expect(metadata.applicationName).toBe(clinicConfig.brand.clinicName);
  });

  it("builds canonical and page title correctly", () => {
    const metadata = getSiteMetadata({
      title: "Services",
      description: "Custom description",
      path: "/services",
    });

    expect(metadata.title).toBe(`Services | ${clinicConfig.brand.clinicName}`);
    expect(metadata.description).toBe("Custom description");
    expect(metadata.alternates?.canonical).toBe("/services");
  });
});
