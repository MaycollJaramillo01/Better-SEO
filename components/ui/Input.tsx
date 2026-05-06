import { forwardRef, useId, type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  /** Hide the visible label but keep it accessible. */
  hideLabel?: boolean;
};

/**
 * Apple-style input: thin border, generous padding, focus ring tinted
 * with Apple Blue. Used in the hero search-style form.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, helperText, id, icon: Icon, hideLabel, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={cn(
          "mb-1.5 inline-flex text-[12px] font-medium text-text-muted",
          hideLabel && "sr-only"
        )}
      >
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "focus-ring h-12 w-full rounded-full border bg-white px-4 text-[15px] text-text-main",
            "placeholder:text-text-muted",
            Icon ? "pl-10" : "",
            error
              ? "border-[var(--coral)]"
              : "border-[var(--border-soft)]",
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper-text` : undefined
          }
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-[var(--coral-dark)]">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper-text`} className="mt-1.5 text-[13px] text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
