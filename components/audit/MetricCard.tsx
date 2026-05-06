import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MetricTone = "success" | "warning" | "error" | "info";

const dotColor: Record<MetricTone, string> = {
  success: "bg-[var(--success)]",
  warning: "bg-[var(--accent-gold)]",
  error:   "bg-[var(--coral-dark)]",
  info:    "bg-[var(--primary-teal)]"
};

type MetricCardProps = {
  title: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: MetricTone;
  status?: string;
};

export function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "info",
  status
}: MetricCardProps) {
  const hasLongValue = typeof value === "string" && value.length > 9;

  return (
    <article className="flex flex-col rounded-[22px] border border-[var(--border-soft)] bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.07)]">
      {/* Top row: icon + status dot */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f7] text-text-muted">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        {status ? (
          <span className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor[tone])} />
            <span className="text-[12px] text-text-muted">{status}</span>
          </span>
        ) : null}
      </div>

      {/* Label */}
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
        {title}
      </p>

      {/* Value */}
      <p
        className={cn(
          "mt-1 font-semibold leading-none text-text-main",
          hasLongValue ? "break-words text-[20px] leading-snug" : "text-[30px]"
        )}
      >
        {value}
      </p>

      {/* Helper */}
      <p className="mt-2.5 text-[12px] leading-[1.55] text-text-muted">{helper}</p>
    </article>
  );
}
