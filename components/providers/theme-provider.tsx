"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { clinicConfig } from "@/lib/config";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={clinicConfig.brand.defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
