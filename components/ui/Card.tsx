import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "glass" | "premium" | "soft";
  padding?: "none" | "sm" | "md" | "lg";
  title?: string;
  description?: string;
  children?: ReactNode;
};

const variantClasses = {
  default: "rounded-[28px] border border-border-soft/80 bg-white/86 apple-shadow",
  glass: "glass-card rounded-[32px]",
  premium: "premium-panel",
  soft: "soft-gradient rounded-[32px] border border-border-soft/80 apple-shadow"
};

const paddingClasses = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-7",
  lg: "p-7 sm:p-8 lg:p-10"
};

export function Card({
  className,
  variant = "premium",
  padding = "md",
  title,
  description,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(variantClasses[variant], paddingClasses[padding], className)} {...props}>
      {title ? <h3 className="text-lg font-semibold text-text-main">{title}</h3> : null}
      {description ? (
        <p className={cn("mt-2 text-sm leading-6 text-text-muted", title ? "" : "mt-0")}>
          {description}
        </p>
      ) : null}
      <div className={cn(title || description ? "mt-6" : "")}>{children}</div>
    </div>
  );
}
