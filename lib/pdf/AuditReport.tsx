import {
  Document,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";

import type { AuditData } from "@/lib/audit/types";

// Use Helvetica — built into @react-pdf/renderer, no external fetch needed

/* ── Palette ─────────────────────────────────────────────────────────────────── */
const C = {
  black:    "#1d1d1f",
  gray:     "#86868b",
  lightGray:"#f5f5f7",
  border:   "#e5e5ea",
  white:    "#ffffff",
  blue:     "#0071e3",
  teal:     "#00b5ad",
  green:    "#30d158",
  gold:     "#f5a623",
  red:      "#ff3b30"
};

/* ── Severity helpers ────────────────────────────────────────────────────────── */
function severityColor(s: string) {
  if (s === "critical") return C.red;
  if (s === "high")     return "#ff6b35";
  if (s === "medium")   return C.gold;
  return C.gray;
}

function gradeColor(g: string) {
  if (g === "Excellent") return C.green;
  if (g === "Good")      return C.teal;
  if (g === "Needs Work") return C.gold;
  return C.red;
}

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.black,
    backgroundColor: C.white,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48
  },

  // — Header bar
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.teal,
    marginRight: 6
  },
  brandText: {
    fontSize: 11,
    fontWeight: 600,
    color: C.black
  },
  headerDate: {
    fontSize: 9,
    color: C.gray
  },

  // — Cover hero
  coverHero: {
    backgroundColor: C.lightGray,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 24
  },
  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  scoreNumber: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1
  },
  scoreLabel: {
    fontSize: 8,
    color: C.gray,
    marginTop: 2
  },
  coverInfo: {
    flex: 1
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: 600,
    color: C.teal,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6
  },
  coverUrl: {
    fontSize: 16,
    fontWeight: 700,
    color: C.black,
    marginBottom: 8
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 8,
    fontWeight: 600
  },

  // — Section heading
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: C.black,
    marginBottom: 12
  },
  sectionEyebrow: {
    fontSize: 8,
    fontWeight: 600,
    color: C.teal,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4
  },

  // — Metrics grid
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 28
  },
  metricBox: {
    width: "22%",
    backgroundColor: C.lightGray,
    borderRadius: 10,
    padding: 10
  },
  metricLabel: {
    fontSize: 7,
    fontWeight: 600,
    color: C.gray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 700,
    color: C.black,
    lineHeight: 1
  },
  metricValueSm: {
    fontSize: 12,
    fontWeight: 700,
    color: C.black,
    lineHeight: 1
  },
  metricHelper: {
    fontSize: 7,
    color: C.gray,
    marginTop: 4,
    lineHeight: 1.4
  },
  metricDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginBottom: 6
  },

  // — Issues
  issueCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: C.lightGray
  },
  issueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4
  },
  severityDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  issueSeverity: {
    fontSize: 7,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  issueCategory: {
    fontSize: 7,
    color: C.gray,
    marginLeft: "auto"
  },
  issueTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: C.black,
    marginBottom: 3
  },
  issueMessage: {
    fontSize: 8,
    color: C.gray,
    lineHeight: 1.5,
    marginBottom: 6
  },
  issueRec: {
    fontSize: 8,
    color: C.black,
    backgroundColor: C.white,
    padding: 6,
    borderRadius: 6,
    lineHeight: 1.5
  },

  // — Recommendations
  recCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: C.lightGray,
    borderRadius: 10
  },
  recPriority: {
    fontSize: 7,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  recTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: C.black,
    marginBottom: 3
  },
  recDesc: {
    fontSize: 8,
    color: C.gray,
    lineHeight: 1.5
  },

  // — Divider
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 20
  },

  // — Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  footerText: {
    fontSize: 8,
    color: C.gray
  },

  // — Two-column layout
  cols: {
    flexDirection: "row",
    gap: 16
  },
  col: {
    flex: 1
  }
});

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/* ── Sub-components ──────────────────────────────────────────────────────────── */
function PageHeader({ label }: { label: string }) {
  return (
    <View style={s.header}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={s.brandDot} />
        <Text style={s.brandText}>SEO Audit Report</Text>
      </View>
      <Text style={s.headerDate}>{label}</Text>
    </View>
  );
}

function PageFooter({ page, total }: { page: number; total: number }) {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>Confidential — SEO Audit Report</Text>
      <Text style={s.footerText}>{page} / {total}</Text>
    </View>
  );
}

function MetricBox({
  label,
  value,
  helper,
  dot
}: {
  label: string;
  value: string | number;
  helper?: string;
  dot?: string;
}) {
  const isLong = String(value).length > 7;
  return (
    <View style={s.metricBox}>
      {dot ? <View style={[s.metricDot, { backgroundColor: dot }]} /> : null}
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={isLong ? s.metricValueSm : s.metricValue}>{String(value)}</Text>
      {helper ? <Text style={s.metricHelper}>{helper}</Text> : null}
    </View>
  );
}

/* ── Document ────────────────────────────────────────────────────────────────── */
export function AuditReportDocument({ data }: { data: AuditData }) {
  const { summary } = data;
  const date = formatDate();
  const gc = gradeColor(data.grade);
  const issues = data.issues;
  const critical = issues.filter((i) => i.severity === "critical");
  const high = issues.filter((i) => i.severity === "high");
  const medium = issues.filter((i) => i.severity === "medium");
  const low = issues.filter((i) => i.severity === "low");

  return (
    <Document
      title={`SEO Audit — ${data.finalUrl}`}
      author="SEO Audit Tool"
      subject="Technical SEO Report"
    >
      {/* ── Page 1: Cover + Key Metrics ─────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader label={date} />

        {/* Score hero */}
        <View style={s.coverHero}>
          <View style={[s.scoreCircle, { borderColor: gc }]}>
            <Text style={[s.scoreNumber, { color: gc }]}>{data.score}</Text>
            <Text style={s.scoreLabel}>/ 100</Text>
          </View>
          <View style={s.coverInfo}>
            <Text style={s.eyebrow}>SEO Audit completed</Text>
            <Text style={s.coverUrl}>{data.finalUrl}</Text>
            <View style={s.badgeRow}>
              <View style={[s.badge, { backgroundColor: gc, color: "#fff" }]}>
                <Text style={{ color: "#fff", fontSize: 8, fontWeight: 600 }}>{data.grade}</Text>
              </View>
              <View
                style={[
                  s.badge,
                  {
                    backgroundColor:
                      summary.indexability === "Indexable" ? C.green : C.gold,
                    color: "#fff"
                  }
                ]}
              >
                <Text style={{ color: "#fff", fontSize: 8, fontWeight: 600 }}>
                  {summary.indexability}
                </Text>
              </View>
              <View style={[s.badge, { backgroundColor: C.border }]}>
                <Text style={{ color: C.black, fontSize: 8 }}>HTTP {data.statusCode}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: C.border }]}>
                <Text style={{ color: C.black, fontSize: 8 }}>{summary.responseTimeMs}ms</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Issue summary counts */}
        <View style={[s.cols, { marginBottom: 24 }]}>
          {[
            { label: "Critical", count: critical.length, color: C.red },
            { label: "High",     count: high.length,     color: "#ff6b35" },
            { label: "Medium",   count: medium.length,   color: C.gold },
            { label: "Low",      count: low.length,      color: C.gray }
          ].map(({ label, count, color }) => (
            <View
              key={label}
              style={{
                flex: 1,
                backgroundColor: C.lightGray,
                borderRadius: 10,
                padding: 12,
                alignItems: "center",
                marginHorizontal: 3
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: 700, color }}>{count}</Text>
              <Text style={{ fontSize: 8, color: C.gray, marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Metadata metrics */}
        <Text style={s.sectionEyebrow}>Metadata & Content</Text>
        <Text style={s.sectionTitle}>On-page signals</Text>
        <View style={s.metricsGrid}>
          <MetricBox
            label="Title"
            value={summary.titleLength ? `${summary.titleLength} chars` : "Missing"}
            helper={summary.title ? summary.title.slice(0, 40) + (summary.title.length > 40 ? "…" : "") : "No title tag found"}
            dot={summary.titleLength >= 30 && summary.titleLength <= 60 ? C.green : C.gold}
          />
          <MetricBox
            label="Meta Description"
            value={summary.metaDescriptionLength ? `${summary.metaDescriptionLength} chars` : "Missing"}
            helper={summary.metaDescription ? summary.metaDescription.slice(0, 40) + "…" : "No meta description"}
            dot={summary.metaDescriptionLength >= 120 && summary.metaDescriptionLength <= 160 ? C.green : C.gold}
          />
          <MetricBox
            label="H1 Count"
            value={summary.h1Count}
            helper={summary.h1Count === 1 ? "Optimal — single H1" : summary.h1Count === 0 ? "Missing H1 tag" : "Multiple H1 tags"}
            dot={summary.h1Count === 1 ? C.green : C.red}
          />
          <MetricBox
            label="H2 / H3"
            value={`${summary.h2Count} / ${summary.h3Count}`}
            helper="Supporting heading structure"
            dot={summary.h2Count > 0 ? C.green : C.gold}
          />
          <MetricBox
            label="Word Count"
            value={summary.wordCount}
            helper={summary.wordCount >= 250 ? "Sufficient content" : "Content may be thin"}
            dot={summary.wordCount >= 250 ? C.green : C.gold}
          />
          <MetricBox
            label="Images"
            value={summary.imageCount}
            helper={`${summary.imagesWithoutAlt} missing ALT (${Math.round(summary.imagesWithoutAltPercentage)}%)`}
            dot={summary.imagesWithoutAltPercentage <= 20 ? C.green : C.red}
          />
          <MetricBox
            label="Internal Links"
            value={summary.internalLinks}
            helper="Links to same domain"
            dot={summary.internalLinks > 0 ? C.green : C.gold}
          />
          <MetricBox
            label="External Links"
            value={summary.externalLinks}
            helper="Outbound links"
            dot={C.teal}
          />
        </View>

        <PageFooter page={1} total={3} />
      </Page>

      {/* ── Page 2: Technical Signals ────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader label={data.finalUrl} />

        <Text style={s.sectionEyebrow}>Technical SEO</Text>
        <Text style={s.sectionTitle}>Performance & crawlability</Text>

        <View style={s.metricsGrid}>
          <MetricBox
            label="HTTPS"
            value={summary.isHttps ? "Enabled" : "Missing"}
            dot={summary.isHttps ? C.green : C.red}
          />
          <MetricBox
            label="Response Time"
            value={`${summary.responseTimeMs}ms`}
            helper={summary.responseTimeMs <= 1200 ? "Fast" : summary.responseTimeMs <= 2500 ? "Moderate" : "Slow — needs work"}
            dot={summary.responseTimeMs <= 1200 ? C.green : summary.responseTimeMs <= 2500 ? C.gold : C.red}
          />
          <MetricBox
            label="HTML Size"
            value={formatBytes(summary.pageSizeBytes)}
            helper={summary.pageSizeBytes <= 700_000 ? "Lean payload" : "Heavy — consider optimizing"}
            dot={summary.pageSizeBytes <= 700_000 ? C.green : C.gold}
          />
          <MetricBox
            label="Canonical"
            value={summary.hasCanonical ? "Set" : "Missing"}
            helper={summary.canonicalUrl ? summary.canonicalUrl.slice(0, 35) + "…" : "No canonical tag"}
            dot={summary.hasCanonical ? C.green : C.gold}
          />
          <MetricBox
            label="Viewport"
            value={summary.hasViewport ? "Set" : "Missing"}
            helper="Mobile-friendly signal"
            dot={summary.hasViewport ? C.green : C.red}
          />
          <MetricBox
            label="Schema"
            value={summary.schemaCount || "None"}
            helper={summary.schemaTypes.length > 0 ? summary.schemaTypes.slice(0, 2).join(", ") : "No structured data"}
            dot={summary.hasSchema ? C.green : C.gold}
          />
          <MetricBox
            label="Robots.txt"
            value={summary.discovery.robotsTxtExists ? "Found" : "Missing"}
            helper={summary.discovery.robotsTxtBlocksAll ? "⚠ Blocks all crawlers!" : summary.discovery.robotsTxtHasSitemap ? "Has sitemap ref" : "No sitemap ref"}
            dot={summary.discovery.robotsTxtBlocksAll ? C.red : summary.discovery.robotsTxtExists ? C.green : C.gold}
          />
          <MetricBox
            label="XML Sitemap"
            value={summary.discovery.sitemapXmlExists ? "Found" : "Missing"}
            helper="Checked /sitemap.xml"
            dot={summary.discovery.sitemapXmlExists ? C.green : C.gold}
          />
          <MetricBox
            label="Open Graph"
            value={summary.hasOpenGraph ? `${4 - summary.openGraph.missingFields.length}/4` : "Missing"}
            helper={summary.openGraph.missingFields.length > 0 ? `Missing: ${summary.openGraph.missingFields.join(", ")}` : "All OG fields present"}
            dot={summary.hasOpenGraph && summary.openGraph.missingFields.length === 0 ? C.green : C.gold}
          />
          <MetricBox
            label="Twitter Card"
            value={summary.hasTwitterCard ? summary.twitterCard.type || "Set" : "Missing"}
            helper={summary.twitterCard.missingFields.length > 0 ? `Missing: ${summary.twitterCard.missingFields.slice(0,2).join(", ")}` : "Complete"}
            dot={summary.twitterCard.missingFields.length === 0 ? C.green : C.gold}
          />
          <MetricBox
            label="Charset"
            value={summary.charset || "Missing"}
            helper="Document text encoding"
            dot={summary.hasCharset ? C.green : C.gold}
          />
          <MetricBox
            label="URL Health"
            value={summary.urlIsClean ? "Clean" : "Review"}
            helper={`Length ${summary.urlLength}, depth ${summary.urlDepth}`}
            dot={summary.urlIsClean ? C.green : C.gold}
          />
          <MetricBox
            label="Noindex"
            value={summary.isNoindex || summary.xRobotsNoindex ? "Blocked" : "Indexable"}
            helper={summary.robotsContent || summary.xRobotsTag || "No noindex directive"}
            dot={summary.isNoindex || summary.xRobotsNoindex ? C.red : C.green}
          />
          <MetricBox
            label="Scripts"
            value={summary.externalScriptCount + summary.inlineScriptCount}
            helper={`${summary.externalScriptCount} external / ${summary.inlineScriptCount} inline`}
            dot={summary.externalScriptCount <= 25 ? C.green : C.gold}
          />
          <MetricBox
            label="Img Dimensions"
            value={summary.imagesWithoutDimensions}
            helper="Images missing width/height"
            dot={summary.imagesWithoutDimensions === 0 ? C.green : C.gold}
          />
          <MetricBox
            label="Hreflang"
            value={summary.hreflangCount || "None"}
            helper="Language alternate tags"
            dot={C.teal}
          />
        </View>

        <PageFooter page={2} total={3} />
      </Page>

      {/* ── Page 3: Issues + Recommendations ────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader label={data.finalUrl} />

        <View style={s.cols}>
          {/* Issues column */}
          <View style={s.col}>
            <Text style={s.sectionEyebrow}>Issues</Text>
            <Text style={[s.sectionTitle, { marginBottom: 10 }]}>
              {issues.length} finding{issues.length !== 1 ? "s" : ""}
            </Text>

            {issues.slice(0, 12).map((issue, i) => (
              <View key={i} style={s.issueCard} wrap={false}>
                <View style={s.issueHeader}>
                  <View
                    style={[s.severityDot, { backgroundColor: severityColor(issue.severity) }]}
                  />
                  <Text style={[s.issueSeverity, { color: severityColor(issue.severity) }]}>
                    {issue.severity}
                  </Text>
                  <Text style={s.issueCategory}>{issue.category}</Text>
                </View>
                <Text style={s.issueTitle}>{issue.title}</Text>
                <Text style={s.issueMessage}>{issue.message}</Text>
                <Text style={s.issueRec}>→ {issue.recommendation}</Text>
              </View>
            ))}
            {issues.length > 12 ? (
              <Text style={{ fontSize: 8, color: C.gray, marginTop: 4 }}>
                +{issues.length - 12} more findings not shown
              </Text>
            ) : null}
          </View>

          {/* Recommendations column */}
          <View style={s.col}>
            <Text style={s.sectionEyebrow}>Recommendations</Text>
            <Text style={[s.sectionTitle, { marginBottom: 10 }]}>Next actions</Text>

            {data.recommendations.map((rec, i) => (
              <View key={i} style={s.recCard} wrap={false}>
                <View>
                  <Text
                    style={[
                      s.recPriority,
                      {
                        color:
                          rec.priority === "high"
                            ? C.red
                            : rec.priority === "medium"
                              ? C.gold
                              : C.gray
                      }
                    ]}
                  >
                    {rec.priority}
                  </Text>
                  <Text style={s.recTitle}>{rec.title}</Text>
                  <Text style={s.recDesc}>{rec.description}</Text>
                </View>
              </View>
            ))}

            {/* CTA box */}
            <View
              style={{
                marginTop: 16,
                backgroundColor: C.black,
                borderRadius: 12,
                padding: 16
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 600,
                  color: C.teal,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6
                }}
              >
                Next step
              </Text>
              <Text
                style={{ fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 6 }}
              >
                Turn findings into a growth plan.
              </Text>
              <Text style={{ fontSize: 8, color: "#a1a1a6", lineHeight: 1.5 }}>
                Book a free 30-min strategy call. We walk through this report
                together and map out a content plan that drives real traffic.
              </Text>
            </View>
          </View>
        </View>

        <PageFooter page={3} total={3} />
      </Page>
    </Document>
  );
}
