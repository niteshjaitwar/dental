"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useEffect, useState } from "react";

export function Typewriter({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const longestWord = useMemo(
    () =>
      words.reduce(
        (longest, word) => (word.length > longest.length ? word : longest),
        words[0] || "",
      ),
    [words],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [words]);

  return (
    <span
      className="relative inline-flex min-h-[1.2em] align-middle text-[color:var(--primary)]"
      style={{ minWidth: `${Math.max(longestWord.length + 1, 12)}ch` }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="absolute top-0 left-0"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      <span className="opacity-0">{longestWord}</span>
    </span>
  );
}
