import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "coral" | "gold";

const badgeClasses: Record<BadgeVariant, string> = {
  success: "border-[rgba(var(--success-rgb),0.22)] bg-[rgba(var(--success-rgb),0.12)] text-success",
  warning: "border-[rgba(var(--accent-rgb),0.5)] bg-[rgba(var(--accent-rgb),0.2)] text-text-main",
  error: "border-[rgba(var(--error-rgb),0.22)] bg-[rgba(var(--error-rgb),0.12)] text-error",
  info: "border-[rgba(var(--sky-rgb),0.28)] bg-[rgba(var(--sky-rgb),0.14)] text-primary-dark",
  neutral: "border-border-soft/80 bg-white/72 text-text-muted",
  coral: "border-[rgba(var(--coral-rgb),0.28)] bg-[rgba(var(--coral-rgb),0.13)] text-coral-dark",
  gold: "border-[rgba(var(--accent-rgb),0.62)] bg-[rgba(var(--accent-rgb),0.28)] text-text-main"
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        "border backdrop-blur-sm",
        badgeClasses[variant],
        className
      )}
      {...props}
    />
  );
}
