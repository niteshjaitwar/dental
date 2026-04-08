import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-[color:var(--border)] bg-transparent px-4 py-3 transition outline-none focus:border-[color:var(--primary)]",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
