"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import { clinicConfig } from "@/lib/config";

export function CookieConsent() {
  const [dismissed, setDismissed] = useState(false);
  const visible = useSyncExternalStore(
    () => () => undefined,
    () => !window.localStorage.getItem("dental-cookie-consent"),
    () => false,
  );

  if (!visible || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="fixed bottom-4 left-4 z-40 max-w-sm rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5 shadow-2xl"
      >
        <p className="text-sm font-semibold">{clinicConfig.ui.cookieTitle}</p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          {clinicConfig.ui.cookieDescription}
        </p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => {
            window.localStorage.setItem("dental-cookie-consent", "accepted");
            setDismissed(true);
          }}
        >
          {clinicConfig.ui.cookieAcceptLabel}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
