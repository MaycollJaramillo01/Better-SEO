import { z } from "zod";

const allowedProtocols = new Set(["http:", "https:"]);

function isUrlLike(value: string) {
  const input = value.trim();

  if (!input) {
    return false;
  }

  try {
    const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(input)
      ? input
      : `https://${input}`;
    const parsed = new URL(withProtocol);
    return allowedProtocols.has(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

const OptionalEmailSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().email("Please enter a valid email address.").optional()
);

export const AuditRequestSchema = z.object({
  url: z
    .string({ error: "Please enter a website URL." })
    .trim()
    .min(1, "Please enter a website URL.")
    .refine(isUrlLike, "Please enter a valid domain or URL."),
  email: OptionalEmailSchema
});

const HeadingEntrySchema = z.object({
  level: z.enum(["h1", "h2", "h3"]),
  text: z.string()
});

const OpenGraphSummarySchema = z.object({
  title: z.boolean(),
  description: z.boolean(),
  image: z.boolean(),
  url: z.boolean(),
  missingFields: z.array(z.string())
});

const TwitterCardSummarySchema = z.object({
  type: z.string(),
  title: z.boolean(),
  description: z.boolean(),
  image: z.boolean(),
  site: z.boolean(),
  missingFields: z.array(z.string())
});

const DiscoverySummarySchema = z.object({
  robotsTxtChecked: z.boolean(),
  robotsTxtExists: z.boolean(),
  robotsTxtStatusCode: z.number(),
  robotsTxtHasSitemap: z.boolean(),
  robotsTxtBlocksAll: z.boolean(),
  sitemapXmlChecked: z.boolean(),
  sitemapXmlExists: z.boolean(),
  sitemapXmlStatusCode: z.number()
});

// The summary is validated server-side (fully typed via AuditSummary in types.ts).
// Client-side we use z.unknown() to avoid Zod v4 TypeScript instantiation-depth
// limits that appear above ~62 complex object keys. All fields pass through unchanged.
const AuditSummarySchema = z.unknown();

const AuditIssueSchema = z.object({
  severity: z.enum(["critical", "high", "medium", "low"]),
  category: z.string(),
  title: z.string(),
  message: z.string(),
  recommendation: z.string()
});

const AuditRecommendationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string()
});

export const AuditSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    url: z.string(),
    finalUrl: z.string(),
    statusCode: z.number(),
    score: z.number(),
    grade: z.enum(["Poor", "Needs Work", "Good", "Excellent"]),
    summary: AuditSummarySchema,
    issues: z.array(AuditIssueSchema),
    recommendations: z.array(AuditRecommendationSchema)
  })
});

export const AuditErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string()
  })
});

export const AuditResponseSchema = z.union([
  AuditSuccessResponseSchema,
  AuditErrorResponseSchema
]);

export type AuditRequestInput = z.infer<typeof AuditRequestSchema>;
export type AuditResponse = z.infer<typeof AuditResponseSchema>;
