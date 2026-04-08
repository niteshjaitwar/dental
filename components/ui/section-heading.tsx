import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[color:var(--muted)] md:text-lg">
        {description}
      </p>
    </div>
  );
}
