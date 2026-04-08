import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClientShell } from "@/components/layout/client-shell";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SiteProviders } from "@/components/providers/site-providers";
import { LocalBusinessJsonLd } from "@/components/schema/local-business-jsonld";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = getSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        style={
          {
            ["--primary" as string]: clinicConfig.brand.primaryColor,
            ["--secondary" as string]: clinicConfig.brand.secondaryColor,
            ["--accent" as string]: clinicConfig.brand.accentColor,
            fontFamily: "var(--font-sans)",
          } as React.CSSProperties
        }
      >
        <SiteProviders>
          <div className="min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
          <ClientShell />
        </SiteProviders>
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
