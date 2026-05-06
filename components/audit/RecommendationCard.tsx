import { ArrowUpRight } from "lucide-react";

import type { AuditRecommendation } from "@/lib/audit/types";

const priorityConfig = {
  high: { label: "High priority", dot: "var(--coral)", text: "var(--coral-dark)" },
  medium: { label: "Medium", dot: "#f5a623", text: "#86868b" },
  low: { label: "Low", dot: "var(--primary-teal)", text: "#86868b" }
} as const;

const priorityAction = {
  high: "Address this before lower-impact refinements.",
  medium: "Schedule this after critical blockers are stable.",
  low: "Keep this in the optimization backlog."
} as const;

type RecommendationCardProps = {
  recommendation: AuditRecommendation;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const config = priorityConfig[recommendation.priority];

  return (
    <article className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-medium"
          style={{ color: config.text }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: config.dot }}
            aria-hidden="true"
          />
          {config.label}
        </span>
        <ArrowUpRight className="h-4 w-4 text-text-muted" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-text-main">
        {recommendation.title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">
        {recommendation.description}
      </p>

      <div className="mt-4 rounded-xl bg-[#f5f5f7] px-4 py-3">
        <p className="text-[12px] font-medium text-text-muted">Suggested action</p>
        <p className="mt-1 text-[14px] leading-[1.55] text-text-main">
          {priorityAction[recommendation.priority]}
        </p>
      </div>
    </article>
  );
}
