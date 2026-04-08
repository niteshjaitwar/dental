"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqAccordion({
  items,
}: {
  items: readonly { question: string; answer: string }[];
}) {
  const [openItem, setOpenItem] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = openItem === index;

        return (
          <div key={item.question} className="glass-card rounded-[1.75rem] p-5">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 text-left"
              onClick={() => setOpenItem(open ? -1 : index)}
              aria-expanded={open}
            >
              <span className="text-lg font-semibold">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-4 text-sm leading-7 text-[color:var(--muted)]"
                >
                  {item.answer}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
