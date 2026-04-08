import Link from "next/link";
import { clinicConfig } from "@/lib/config";

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-6 font-serif text-5xl font-semibold">
        {clinicConfig.ui.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-md text-[color:var(--muted)]">
        {clinicConfig.ui.notFoundDescription}
      </p>
      <Link href="/" className="btn-primary mt-8">
        {clinicConfig.ui.backHomeLabel}
      </Link>
    </section>
  );
}
