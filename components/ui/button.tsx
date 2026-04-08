import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-300 disabled:opacity-60",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants[variant], className)}
        style={
          variant === "primary"
            ? {
                background:
                  "linear-gradient(135deg, var(--primary), var(--secondary))",
              }
            : {
                borderColor: "var(--border)",
                background: "var(--surface)",
              }
        }
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
