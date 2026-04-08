import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    variant?: "primary" | "secondary";
  };

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        variant === "primary" ? "btn-primary" : "btn-secondary",
        className,
      )}
      {...props}
    />
  );
}
