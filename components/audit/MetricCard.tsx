import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type MetricTone = "success" | "warning" | "error" | "info";

const toneStyles: Record<MetricTone, string> = {
  success: "bg-[linear-gradient(180deg,rgba(var(--success-rgb),0.08),rgba(255,255,255,0.92))]",
  warning: "bg-[linear-gradient(180deg,rgba(var(--accent-rgb),0.16),rgba(255,255,255,0.92))]",
  error: "bg-[linear-gradient(180deg,rgba(var(--error-rgb),0.10),rgba(255,255,255,0.92))]",
  info: "bg-[linear-gradient(180deg,rgba(var(--sky-rgb),0.10),rgba(255,255,255,0.92))]"
};

const toneLabels: Record<MetricTone, string> = {
  success: "Healthy",
  warning: "Review",
  error: "Attention",
  info: "Info"
};

type MetricCardProps = {
  title: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: MetricTone;
  badgeText?: string;
  status?: string;
};

export function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "info",
  badgeText,
  status
}: MetricCardProps) {
  const hasLongValue = typeof value === "string" && value.length > 8;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border-soft/80 p-5 transition duration-200 ease-out hover:-translate-y-px",
        "apple-shadow",
        toneStyles[tone]
      )}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/82 text-primary-dark">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <Badge
          variant={
            tone === "success"
              ? "success"
              : tone === "warning"
                ? "warning"
                : tone === "error"
                  ? "error"
                  : "info"
          }
        >
          {status ?? badgeText ?? toneLabels[tone]}
        </Badge>
      </div>
      <p className="mt-5 text-sm font-medium text-text-muted">{title}</p>
      <p
        className={cn(
          "mt-2 font-semibold leading-none text-text-main",
          hasLongValue ? "break-words text-[22px] leading-tight" : "text-[34px]"
        )}
      >
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-text-muted">{helper}</p>
    </article>
  );
}
