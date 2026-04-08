"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { clinicConfig } from "@/lib/config";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <section className="section-shell flex min-h-screen flex-col items-center justify-center py-20 text-center">
          <span className="eyebrow">{clinicConfig.ui.globalErrorEyebrow}</span>
          <h1 className="mt-6 font-serif text-5xl font-semibold">
            {clinicConfig.ui.globalErrorTitle}
          </h1>
          <p className="mt-4 max-w-lg text-[color:var(--muted)]">
            {clinicConfig.ui.globalErrorDescription}
          </p>
          <Button className="mt-8" onClick={() => reset()}>
            {clinicConfig.ui.globalErrorRetryLabel}
          </Button>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            {clinicConfig.brand.clinicName}
          </p>
        </section>
      </body>
    </html>
  );
}
