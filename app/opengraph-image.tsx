/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { clinicConfig } from "@/lib/config";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #F7FBFF 0%, #E8F3FF 55%, #EEF9F1 100%)",
          color: "#0F172A",
          padding: 64,
          fontFamily: "sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#0A61C9" }}>
          {clinicConfig.home.badge}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 10,
            }}
          >
            <img
              src={`${clinicConfig.site.url}${clinicConfig.brand.favicon}`}
              width="88"
              height="88"
              alt={clinicConfig.brand.clinicName}
            />
            <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, color: "#0A56AF" }}>
              {clinicConfig.brand.clinicName}
            </div>
          </div>
          <div style={{ fontSize: 32, lineHeight: 1.3, maxWidth: 900, color: "#35516C" }}>
            {clinicConfig.seo.defaultDescription}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(10, 97, 201, 0.16)",
            paddingTop: 22,
            color: "#47657E",
            fontSize: 24,
          }}
        >
          <div>{clinicConfig.contact.city}</div>
          <div style={{ color: "#1F9C63", fontWeight: 600 }}>
            Healthcare Brand System
          </div>
        </div>
      </div>
    ),
    size,
  );
}
