"use client";

import {
  BookOpenText,
  Clock3,
  FileText,
  FileCode,
  Heading1,
  Images,
  Languages,
  Link2,
  ListTree,
  Network,
  Route,
  ScanSearch,
  Server,
  ShieldCheck,
  Share2,
  Sigma
} from "lucide-react";

import { AuditScore } from "@/components/audit/AuditScore";
import { IssueCard } from "@/components/audit/IssueCard";
import { MetricCard } from "@/components/audit/MetricCard";
import { RecommendationCard } from "@/components/audit/RecommendationCard";
import { SeoPreview } from "@/components/audit/SeoPreview";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import type { AuditData, AuditIssue } from "@/lib/audit/types";
import { formatPercent } from "@/lib/utils";

const severityOrder = ["critical", "high", "medium", "low"] as const;

function groupIssues(issues: AuditIssue[]) {
  return severityOrder
    .map((severity) => ({
      severity,
      issues: issues.filter((issue) => issue.severity === severity)
    }))
    .filter((group) => group.issues.length > 0);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type AuditResultsProps = {
  data: AuditData;
  onReset: () => void;
};

export function AuditResults({ data, onReset }: AuditResultsProps) {
  const issueGroups = groupIssues(data.issues);
  const summary = data.summary;

  return (
    <section id="results" className="section-shell fade-up py-16 sm:py-20" aria-live="polite">
      <div className="glass-card rounded-[34px] p-6 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
              Audit completed for
            </p>
            <h2 className="mt-3 break-all text-2xl font-semibold text-text-main sm:text-3xl">
              {data.finalUrl}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={data.grade === "Excellent" ? "success" : data.grade === "Good" ? "info" : data.grade === "Needs Work" ? "warning" : "error"}>
                {data.grade}
              </Badge>
              <Badge variant={summary.indexability === "Indexable" ? "success" : summary.indexability === "Potential Issues" ? "warning" : "error"}>
                {summary.indexability}
              </Badge>
              <Badge variant="neutral">HTTP {data.statusCode}</Badge>
              <Badge variant="neutral">{summary.responseTimeMs}ms response</Badge>
              <Badge variant={summary.discovery.sitemapXmlExists ? "success" : "warning"}>
                Sitemap {summary.discovery.sitemapXmlExists ? "found" : "missing"}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onReset}
              className={buttonStyles({ variant: "secondary" })}
            >
              Run another audit
            </button>
            <button
              type="button"
              disabled
              className={buttonStyles({ variant: "outline", className: "justify-between gap-3" })}
            >
              <span>Download PDF</span>
              <Badge variant="neutral">Coming soon</Badge>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <AuditScore
            score={data.score}
            grade={data.grade}
            indexability={summary.indexability}
          />

          <section className="premium-panel p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Indexability overview</p>
                <h3 className="mt-2 text-lg font-semibold text-text-main">
                  Technical access signals
                </h3>
              </div>
              <Badge
                variant={
                  summary.indexability === "Indexable"
                    ? "success"
                    : summary.indexability === "Potential Issues"
                      ? "warning"
                      : "error"
                }
              >
                {summary.indexability}
              </Badge>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border-soft/80 bg-white/76 p-4">
                <p className="text-sm text-text-muted">Status code</p>
                <p className="mt-2 text-2xl font-semibold text-text-main">{data.statusCode}</p>
              </div>
              <div className="rounded-[24px] border border-border-soft/80 bg-white/76 p-4">
                <p className="text-sm text-text-muted">HTTPS</p>
                <p className="mt-2 text-2xl font-semibold text-text-main">
                  {summary.isHttps ? "Enabled" : "Missing"}
                </p>
              </div>
              <div className="rounded-[24px] border border-border-soft/80 bg-white/76 p-4">
                <p className="text-sm text-text-muted">Canonical URL</p>
                <p className="mt-2 text-sm font-medium text-text-main">
                  {summary.hasCanonical ? "Detected" : "Missing"}
                </p>
              </div>
              <div className="rounded-[24px] border border-border-soft/80 bg-white/76 p-4">
                <p className="text-sm text-text-muted">Robots meta</p>
                <p className="mt-2 text-sm font-medium text-text-main">
                  {summary.robotsContent || "Not declared"}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <SeoPreview
            title={summary.title}
            description={summary.metaDescription}
            url={data.finalUrl}
          />

          <section className="premium-panel p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text-muted">Page structure snapshot</p>
                <h3 className="mt-2 text-lg font-semibold text-text-main">
                  Core on-page signals
                </h3>
              </div>
              <Badge variant="info">{summary.headings.length} headings captured</Badge>
            </div>
            <div className="mt-6 grid gap-3">
              {summary.headings.length > 0 ? (
                summary.headings.map((heading, index) => (
                  <div
                    key={`${heading.level}-${index}-${heading.text}`}
                    className="flex items-start gap-4 rounded-[22px] border border-border-soft/80 bg-white/76 px-4 py-3"
                  >
                    <Badge variant="neutral" className="uppercase">
                      {heading.level}
                    </Badge>
                    <p className="min-w-0 flex-1 text-left text-sm leading-6 text-text-main">
                      {heading.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-border-soft bg-white/70 px-4 py-5 text-sm text-text-muted">
                  No H1, H2 or H3 headings were detected in the first pass.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="premium-panel mt-10 p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
              Metrics
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-text-main">
              Page-level technical snapshot
            </h3>
          </div>
          <Badge variant="info">Single page analysis</Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            title="Title Length"
            value={summary.titleLength || 0}
            helper="Recommended range: 30 to 60 characters."
            icon={FileText}
            status={
              summary.titleLength >= 30 && summary.titleLength <= 60
                ? "Optimal"
                : summary.titleLength === 0
                  ? "Missing"
                  : "Review"
            }
            tone={
              summary.titleLength >= 30 && summary.titleLength <= 60
                ? "success"
                : summary.titleLength === 0
                  ? "error"
                  : "warning"
            }
          />
          <MetricCard
            title="Meta Description"
            value={summary.metaDescriptionLength || 0}
            helper="Recommended range: 120 to 160 characters."
            icon={ScanSearch}
            status={
              summary.metaDescriptionLength >= 120 && summary.metaDescriptionLength <= 160
                ? "Optimal"
                : summary.metaDescriptionLength === 0
                  ? "Missing"
                  : "Review"
            }
            tone={
              summary.metaDescriptionLength >= 120 && summary.metaDescriptionLength <= 160
                ? "success"
                : summary.metaDescriptionLength === 0
                  ? "error"
                  : "warning"
            }
          />
          <MetricCard
            title="H1 Count"
            value={summary.h1Count}
            helper="Pages usually work best with a single clear H1."
            icon={Heading1}
            status={summary.h1Count === 1 ? "Clean" : summary.h1Count === 0 ? "Missing" : "Multiple"}
            tone={summary.h1Count === 1 ? "success" : summary.h1Count === 0 ? "error" : "warning"}
          />
          <MetricCard
            title="H2/H3 Structure"
            value={`${summary.h2Count}/${summary.h3Count}`}
            helper="Supporting headings help organize the page for users and crawlers."
            icon={ListTree}
            status={summary.h2Count > 0 ? "Structured" : "Thin"}
            tone={summary.h2Count > 0 ? "success" : "warning"}
          />
          <MetricCard
            title="Images Missing ALT"
            value={`${summary.imagesWithoutAlt} / ${summary.imageCount}`}
            helper={`Missing alt ratio: ${formatPercent(summary.imagesWithoutAltPercentage)}.`}
            icon={Images}
            status={
              summary.imagesWithoutAltPercentage > 50
                ? "High"
                : summary.imagesWithoutAltPercentage > 20
                  ? "Review"
                  : "Clean"
            }
            tone={
              summary.imagesWithoutAltPercentage > 50
                ? "error"
                : summary.imagesWithoutAltPercentage > 20
                  ? "warning"
                  : "success"
            }
          />
          <MetricCard
            title="Internal Links"
            value={summary.internalLinks}
            helper="Counted from the audited page only."
            icon={Link2}
            status={summary.internalLinks > 0 ? "Mapped" : "Sparse"}
            tone={summary.internalLinks > 0 ? "success" : "warning"}
          />
          <MetricCard
            title="External Links"
            value={summary.externalLinks}
            helper="Outbound links detected on the page."
            icon={Network}
            status="Detected"
            tone="info"
          />
          <MetricCard
            title="Word Count"
            value={summary.wordCount}
            helper="Approximate visible word count from rendered text."
            icon={BookOpenText}
            status={summary.wordCount >= 250 ? "Enough" : "Thin"}
            tone={summary.wordCount >= 250 ? "success" : "warning"}
          />
          <MetricCard
            title="Schema Types"
            value={summary.schemaCount}
            helper={
              summary.schemaTypes.length > 0
                ? summary.schemaTypes.slice(0, 3).join(", ")
                : "No JSON-LD schema types detected."
            }
            icon={Sigma}
            status={summary.hasSchema ? "Present" : "Missing"}
            tone={summary.hasSchema ? "success" : "warning"}
          />
          <MetricCard
            title="Indexability"
            value={summary.indexability}
            helper="Combines HTTP status, robots directives, HTTPS and canonical signals."
            icon={ShieldCheck}
            status={
              summary.indexability === "Indexable"
                ? "Open"
                : summary.indexability === "Potential Issues"
                  ? "Review"
                  : "Blocked"
            }
            tone={
              summary.indexability === "Indexable"
                ? "success"
                : summary.indexability === "Potential Issues"
                  ? "warning"
                  : "error"
            }
          />
          <MetricCard
            title="Response Time"
            value={`${summary.responseTimeMs}ms`}
            helper="Initial HTML response measured by the audit request."
            icon={Clock3}
            status={
              summary.responseTimeMs <= 1200
                ? "Fast"
                : summary.responseTimeMs <= 2500
                  ? "Review"
                  : "Slow"
            }
            tone={
              summary.responseTimeMs <= 1200
                ? "success"
                : summary.responseTimeMs <= 2500
                  ? "warning"
                  : "error"
            }
          />
          <MetricCard
            title="HTML Size"
            value={formatBytes(summary.pageSizeBytes)}
            helper={`Content type: ${summary.contentType || "unknown"}.`}
            icon={FileCode}
            status={
              summary.pageSizeBytes <= 700_000
                ? "Lean"
                : summary.pageSizeBytes <= 1_500_000
                  ? "Review"
                  : "Heavy"
            }
            tone={
              summary.pageSizeBytes <= 700_000
                ? "success"
                : summary.pageSizeBytes <= 1_500_000
                  ? "warning"
                  : "error"
            }
          />
          <MetricCard
            title="Robots.txt"
            value={summary.discovery.robotsTxtExists ? "Found" : "Missing"}
            helper={
              summary.discovery.robotsTxtExists
                ? summary.discovery.robotsTxtHasSitemap
                  ? "Robots file includes a sitemap directive."
                  : "Robots file found without a sitemap directive."
                : "No robots.txt file was detected at the site root."
            }
            icon={Server}
            status={summary.discovery.robotsTxtBlocksAll ? "Blocking" : "Checked"}
            tone={
              summary.discovery.robotsTxtBlocksAll
                ? "error"
                : summary.discovery.robotsTxtExists
                  ? "success"
                  : "warning"
            }
          />
          <MetricCard
            title="XML Sitemap"
            value={summary.discovery.sitemapXmlExists ? "Found" : "Missing"}
            helper="Checks /sitemap.xml plus sitemap references from HTML or robots.txt."
            icon={Route}
            status={summary.discovery.sitemapXmlExists ? "Present" : "Review"}
            tone={summary.discovery.sitemapXmlExists ? "success" : "warning"}
          />
          <MetricCard
            title="Twitter Card"
            value={summary.hasTwitterCard ? summary.twitterCard.type || "Present" : "Missing"}
            helper={
              summary.twitterCard.missingFields.length > 0
                ? `Missing: ${summary.twitterCard.missingFields.slice(0, 3).join(", ")}.`
                : "Social metadata for Twitter/X preview is complete."
            }
            icon={Share2}
            status={summary.twitterCard.missingFields.length === 0 ? "Complete" : "Review"}
            tone={summary.twitterCard.missingFields.length === 0 ? "success" : "warning"}
          />
          <MetricCard
            title="URL Health"
            value={summary.urlIsClean ? "Clean" : "Review"}
            helper={`Length ${summary.urlLength}, depth ${summary.urlDepth}. ${
              summary.urlHasQueryParams ? "Query parameters detected." : "No query parameters."
            }`}
            icon={Route}
            status={summary.urlIsClean ? "Readable" : "Optimize"}
            tone={summary.urlIsClean ? "success" : "warning"}
          />
          <MetricCard
            title="Charset"
            value={summary.charset || "Missing"}
            helper="Checks whether the document declares a text encoding."
            icon={FileCode}
            status={summary.hasCharset ? "Declared" : "Missing"}
            tone={summary.hasCharset ? "success" : "warning"}
          />
          <MetricCard
            title="Hreflang"
            value={summary.hreflangCount}
            helper="Alternate language annotations found in the page head."
            icon={Languages}
            status={summary.hasHreflang ? "Present" : "None"}
            tone={summary.hasHreflang ? "success" : "info"}
          />
          <MetricCard
            title="Image Dimensions"
            value={summary.imagesWithoutDimensions}
            helper="Images missing width or height attributes."
            icon={Images}
            status={summary.imagesWithoutDimensions === 0 ? "Stable" : "Review"}
            tone={summary.imagesWithoutDimensions === 0 ? "success" : "warning"}
          />
          <MetricCard
            title="Script Load"
            value={summary.externalScriptCount + summary.inlineScriptCount}
            helper={`${summary.externalScriptCount} external and ${summary.inlineScriptCount} inline scripts detected.`}
            icon={FileCode}
            status={summary.externalScriptCount <= 25 ? "Reasonable" : "Heavy"}
            tone={summary.externalScriptCount <= 25 ? "success" : "warning"}
          />
          <MetricCard
            title="X-Robots-Tag"
            value={summary.xRobotsTag || "Clear"}
            helper="HTTP-level robots directive from the server response."
            icon={ShieldCheck}
            status={summary.xRobotsNoindex ? "Blocks index" : "No block"}
            tone={summary.xRobotsNoindex ? "error" : "success"}
          />
        </div>
      </section>

      <div className="mt-14 grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="apple-eyebrow">Issues</p>
              <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-text-main">
                Prioritized technical findings
              </h3>
            </div>
            <span className="text-[13px] text-text-muted">
              {data.issues.length} {data.issues.length === 1 ? "finding" : "findings"}
            </span>
          </div>

          <div className="mt-6 space-y-8">
            {issueGroups.length > 0 ? (
              issueGroups.map((group) => (
                <div key={group.severity}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                      {group.severity}
                    </span>
                    <span className="h-px flex-1 bg-[var(--border-soft)]" />
                    <span className="text-[12px] text-text-muted">
                      {group.issues.length} item{group.issues.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {group.issues.map((issue) => (
                      <IssueCard
                        key={`${issue.severity}-${issue.category}-${issue.title}`}
                        issue={issue}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
                <p className="text-[17px] font-semibold text-text-main">
                  No major issues detected
                </p>
                <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">
                  This single-page audit did not find critical technical blockers. Keep the
                  templates and metadata under review as the site evolves.
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="apple-eyebrow">Recommendations</p>
              <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-text-main">
                Next actions for the page
              </h3>
            </div>
            <span className="text-[13px] text-text-muted">
              {data.recommendations.length} actions
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {data.recommendations.map((recommendation) => (
              <RecommendationCard
                key={`${recommendation.priority}-${recommendation.title}`}
                recommendation={recommendation}
              />
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-[#f5f5f7] p-8">
            <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-text-main">
              Need a deeper SEO audit?
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-text-muted">
              Get a professional review with technical SEO priorities, implementation guidance
              and next-step recommendations.
            </p>
            <a
              href="#contact"
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "mt-6 w-full sm:w-fit"
              })}
            >
              Request Professional Review
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
