"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function parseReviewValue(value: string) {
  if (value.includes("/")) {
    const [rawCurrent, rawMax] = value.split("/");
    const current = Number.parseFloat(rawCurrent.replace(/[^\d.]/g, ""));
    const max = rawMax?.trim() ?? "";

    return {
      type: "fraction" as const,
      target: Number.isFinite(current) ? current : 0,
      max,
      decimals: current % 1 !== 0 ? 1 : 0,
    };
  }

  const hasPlus = value.includes("+");
  const hasPercent = value.includes("%");
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""));

  return {
    type: "plain" as const,
    target: Number.isFinite(numeric) ? numeric : 0,
    suffix: hasPlus ? "+" : hasPercent ? "%" : "",
    decimals: numeric % 1 !== 0 ? 1 : 0,
    useGrouping: value.includes(","),
  };
}

export function ReviewStatCard({
  label,
  value,
  className = "",
  valueClassName = "mt-4 font-serif text-4xl font-semibold",
}: {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const parsed = useMemo(() => parseReviewValue(value), [value]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, parsed.target, {
      duration: 1.4,
      onUpdate(latest) {
        setCount(latest);
      },
    });

    return () => controls.stop();
  }, [inView, parsed.target]);

  const formattedValue =
    parsed.type === "fraction"
      ? `${count.toFixed(parsed.decimals)}/${parsed.max}`
      : `${new Intl.NumberFormat("en-US", {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
          useGrouping: parsed.useGrouping,
        }).format(count)}${parsed.suffix}`;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <p className="text-sm tracking-[0.2em] text-[color:var(--muted)] uppercase">
        {label}
      </p>
      <p className={valueClassName}>{formattedValue}</p>
    </motion.div>
  );
}
