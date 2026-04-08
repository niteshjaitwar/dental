import { cn } from "@/lib/utils";

export function FormMessage({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "success" | "muted";
}) {
  return (
    <p
      className={cn("mt-2 text-sm", {
        "text-rose-500": tone === "error",
        "text-emerald-600": tone === "success",
        "text-[color:var(--muted)]": tone === "muted",
      })}
    >
      {children}
    </p>
  );
}
