import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Apple-style button variants.
 * - primary: filled Apple Blue pill (Buy / Get / Try CTAs)
 * - secondary: light gray pill (Learn / Compare CTAs)
 * - outline: bordered pill on dark backgrounds
 * - danger: red pill for destructive actions
 * - ghost: transparent, used inside dense UI
 * - link: "Learn more ›" inline link
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--primary-teal)] text-white",
    "hover:bg-[var(--primary-light)]",
    "active:bg-[var(--primary-dark)]"
  ].join(" "),
  secondary: [
    "bg-black/[0.06] text-text-main",
    "hover:bg-black/[0.1]",
    "active:bg-black/[0.14]"
  ].join(" "),
  outline: [
    "border border-[var(--border-soft)] bg-transparent text-text-main",
    "hover:bg-black/[0.04]"
  ].join(" "),
  danger: [
    "bg-[var(--coral)] text-white",
    "hover:bg-[var(--coral-light)]"
  ].join(" "),
  ghost: [
    "bg-transparent text-text-muted",
    "hover:bg-black/[0.04] hover:text-text-main"
  ].join(" "),
  link: [
    "bg-transparent px-0 text-[var(--primary-teal)]",
    "hover:underline underline-offset-2"
  ].join(" ")
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-[17px]"
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-1.5 rounded-full font-normal",
    "transition-colors duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    variant !== "link" && sizeClasses[size],
    variantClasses[variant],
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse [animation-delay:240ms]" />
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
