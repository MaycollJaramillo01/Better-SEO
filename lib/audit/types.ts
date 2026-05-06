export type ScoreGrade = "Poor" | "Needs Work" | "Good" | "Excellent";
export type IndexabilityStatus = "Indexable" | "Potential Issues" | "Not Indexable";
export type IssueSeverity = "critical" | "high" | "medium" | "low";
export type RecommendationPriority = "high" | "medium" | "low";
export type AuditErrorCode =
  | "INVALID_URL"
  | "BLOCKED_URL"
  | "FETCH_FAILED"
  | "TIMEOUT"
  | "HTML_NOT_FOUND"
  | "INVALID_RESPONSE";

export interface HeadingEntry {
  level: "h1" | "h2" | "h3";
  text: string;
}

export interface OpenGraphSummary {
  title: boolean;
  description: boolean;
  image: boolean;
  url: boolean;
  missingFields: string[];
}

export interface TwitterCardSummary {
  type: string;
  title: boolean;
  description: boolean;
  image: boolean;
  site: boolean;
  missingFields: string[];
}

export interface DiscoverySummary {
  robotsTxtChecked: boolean;
  robotsTxtExists: boolean;
  robotsTxtStatusCode: number;
  robotsTxtHasSitemap: boolean;
  robotsTxtBlocksAll: boolean;
  sitemapXmlChecked: boolean;
  sitemapXmlExists: boolean;
  sitemapXmlStatusCode: number;
}

export interface AuditSummary {
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headings: HeadingEntry[];
  headingHierarchyIssues: string[];
  imageCount: number;
  imagesWithoutAlt: number;
  imagesWithoutAltPercentage: number;
  imagesWithoutDimensions: number;
  internalLinks: number;
  externalLinks: number;
  emptyLinks: number;
  anchorsWithoutText: number;
  wordCount: number;
  hasCanonical: boolean;
  canonicalUrl: string;
  canonicalMatchesFinalUrl: boolean;
  canonicalHostMatchesFinalUrl: boolean;
  hasViewport: boolean;
  viewportContent: string;
  hasFavicon: boolean;
  hasSchema: boolean;
  schemaCount: number;
  schemaTypes: string[];
  hasLang: boolean;
  lang: string;
  hasHreflang: boolean;
  hreflangCount: number;
  hasCharset: boolean;
  charset: string;
  isHttps: boolean;
  isNoindex: boolean;
  robotsContent: string;
  robotsDirectives: string[];
  nofollow: boolean;
  hasNoarchive: boolean;
  hasNosnippet: boolean;
  xRobotsTag: string;
  xRobotsNoindex: boolean;
  xRobotsNofollow: boolean;
  indexability: IndexabilityStatus;
  hasOpenGraph: boolean;
  openGraph: OpenGraphSummary;
  hasTwitterCard: boolean;
  twitterCard: TwitterCardSummary;
  inlineScriptCount: number;
  externalScriptCount: number;
  hasSitemapLink: boolean;
  responseTimeMs: number;
  pageSizeBytes: number;
  isRedirected: boolean;
  contentType: string;
  urlLength: number;
  urlDepth: number;
  urlHasQueryParams: boolean;
  urlHasUppercase: boolean;
  urlIsClean: boolean;
  discovery: DiscoverySummary;
}

export interface AuditIssue {
  severity: IssueSeverity;
  category: string;
  title: string;
  message: string;
  recommendation: string;
}

export interface AuditRecommendation {
  priority: RecommendationPriority;
  title: string;
  description: string;
}

export interface AuditData {
  url: string;
  finalUrl: string;
  statusCode: number;
  score: number;
  grade: ScoreGrade;
  summary: AuditSummary;
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
}

export interface ExtractionContext {
  contentType: string;
  responseTimeMs: number;
  pageSizeBytes: number;
  isRedirected: boolean;
  xRobotsTag: string;
  discovery: DiscoverySummary;
}

export interface ExtractedMetadata {
  summary: AuditSummary;
}

export interface FetchWebsiteResult {
  html: string;
  finalUrl: string;
  statusCode: number;
  contentType: string;
  responseTimeMs: number;
  pageSizeBytes: number;
  isRedirected: boolean;
  xRobotsTag: string;
}

export class AuditError extends Error {
  code: AuditErrorCode;
  status: number;

  constructor(code: AuditErrorCode, message: string, status = 400) {
    super(message);
    this.name = "AuditError";
    this.code = code;
    this.status = status;
  }
}
