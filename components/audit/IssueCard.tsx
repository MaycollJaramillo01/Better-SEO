import { AlertCircle, AlertOctagon, AlertTriangle, Info } from "lucide-react";

import type { AuditIssue } from "@/lib/audit/types";

const severityConfig = {
  critical: {
    icon: AlertOctagon,
    label: "Critical",
    dot: "var(--coral)",
    text: "var(--coral-dark)"
  },
  high: {
    icon: AlertTriangle,
    label: "High",
    dot: "#f59e0b",
    text: "#b45309"
  },
  medium: {
    icon: AlertCircle,
    label: "Medium",
    dot: "#f5a623",
    text: "#86868b"
  },
  low: {
    icon: Info,
    label: "Low",
    dot: "var(--primary-teal)",
    text: "#86868b"
  }
} as const;

type IssueCardProps = {
  issue: AuditIssue;
};

export function IssueCard({ issue }: IssueCardProps) {
  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  return (
    <article className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-text-main">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
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
            <span className="text-[12px] text-text-muted">{issue.category}</span>
          </div>

          <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.01em] text-text-main">
            {issue.title}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">{issue.message}</p>

          <div className="mt-4 rounded-xl bg-[#f5f5f7] px-4 py-3">
            <p className="text-[12px] font-medium text-text-muted">Recommended action</p>
            <p className="mt-1 text-[14px] leading-[1.55] text-text-main">
              {issue.recommendation}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
