import * as cheerio from "cheerio";

import type {
  AnchorTextDistribution,
  AuditSummary,
  ExtractionContext,
  ExtractedMetadata,
  HeadingEntry,
  OpenGraphSummary,
  OutboundDomainEntry,
  TwitterCardSummary
} from "@/lib/audit/types";

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getMetaContent(
  $: cheerio.CheerioAPI,
  attribute: "name" | "property",
  target: string
) {
  const element = $("meta")
    .toArray()
    .find((node) => $(node).attr(attribute)?.toLowerCase() === target.toLowerCase());

  return normalizeText(element ? $(element).attr("content") ?? "" : "");
}

function getCanonicalUrl($: cheerio.CheerioAPI, finalUrl: string) {
  const canonicalNode = $("link")
    .toArray()
    .find((node) => $(node).attr("rel")?.toLowerCase().split(/\s+/).includes("canonical"));

  if (!canonicalNode) {
    return "";
  }

  const rawHref = ($(canonicalNode).attr("href") ?? "").trim();

  if (!rawHref) {
    return "";
  }

  try {
    return new URL(rawHref, finalUrl).toString();
  } catch {
    return rawHref;
  }
}

function hasFaviconLink($: cheerio.CheerioAPI) {
  return $("link")
    .toArray()
    .some((node) => {
      const relTokens = ($(node).attr("rel") ?? "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      return relTokens.includes("icon") || relTokens.includes("apple-touch-icon");
    });
}

function getHeadingPreview($: cheerio.CheerioAPI): HeadingEntry[] {
  return $("h1, h2, h3")
    .slice(0, 8)
    .toArray()
    .map((node) => ({
      level: node.tagName as HeadingEntry["level"],
      text: normalizeText($(node).text())
    }))
    .filter((entry) => entry.text.length > 0);
}

function getVisibleWordCount($: cheerio.CheerioAPI) {
  const body = $("body").clone();
  body.find("script, style, noscript, svg, iframe, template").remove();
  const text = normalizeText(body.text());

  if (!text) {
    return 0;
  }

  return text.split(" ").filter(Boolean).length;
}

function collectSchemaTypes(value: unknown, types: Set<string>) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectSchemaTypes(entry, types));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const typeValue = record["@type"];

  if (typeof typeValue === "string") {
    types.add(typeValue);
  }

  if (Array.isArray(typeValue)) {
    typeValue
      .filter((entry): entry is string => typeof entry === "string")
      .forEach((entry) => types.add(entry));
  }

  Object.values(record).forEach((entry) => collectSchemaTypes(entry, types));
}

function getSchemaTypes($: cheerio.CheerioAPI) {
  const types = new Set<string>();

  $("script[type='application/ld+json']")
    .toArray()
    .forEach((node) => {
      const content = $(node).contents().text().trim();

      if (!content) {
        return;
      }

      try {
        const parsed = JSON.parse(content) as unknown;
        collectSchemaTypes(parsed, types);
      } catch {
        return;
      }
    });

  return Array.from(types);
}

function getLinkMetrics($: cheerio.CheerioAPI, finalUrl: string) {
  const finalHost = new URL(finalUrl).hostname;
  let internalLinks = 0;
  let externalLinks = 0;
  let emptyLinks = 0;
  let anchorsWithoutText = 0;

  $("a")
    .toArray()
    .forEach((node) => {
      const href = ($(node).attr("href") ?? "").trim();
      const text = normalizeText($(node).text());
      const ariaLabel = normalizeText($(node).attr("aria-label") ?? "");
      const title = normalizeText($(node).attr("title") ?? "");
      const imageAlt = normalizeText($(node).find("img[alt]").first().attr("alt") ?? "");
      const hasReadableText = Boolean(text || ariaLabel || title || imageAlt);

      if (!hasReadableText) {
        anchorsWithoutText += 1;
      }

      if (!href || href === "#" || /^javascript:/i.test(href)) {
        emptyLinks += 1;
        return;
      }

      if (/^(mailto|tel):/i.test(href)) {
        return;
      }

      try {
        const parsed = new URL(href, finalUrl);

        if (!["http:", "https:"].includes(parsed.protocol)) {
          return;
        }

        if (parsed.hostname === finalHost) {
          internalLinks += 1;
        } else {
          externalLinks += 1;
        }
      } catch {
        emptyLinks += 1;
      }
    });

  return {
    internalLinks,
    externalLinks,
    emptyLinks,
    anchorsWithoutText
  };
}

function getOpenGraph($: cheerio.CheerioAPI): OpenGraphSummary {
  const title = Boolean(getMetaContent($, "property", "og:title"));
  const description = Boolean(getMetaContent($, "property", "og:description"));
  const image = Boolean(getMetaContent($, "property", "og:image"));
  const url = Boolean(getMetaContent($, "property", "og:url"));
  const missingFields: string[] = [];

  if (!title) missingFields.push("og:title");
  if (!description) missingFields.push("og:description");
  if (!image) missingFields.push("og:image");
  if (!url) missingFields.push("og:url");

  return { title, description, image, url, missingFields };
}

function getTwitterCard($: cheerio.CheerioAPI): TwitterCardSummary {
  const type = getMetaContent($, "name", "twitter:card");
  const title = Boolean(getMetaContent($, "name", "twitter:title"));
  const description = Boolean(getMetaContent($, "name", "twitter:description"));
  const image = Boolean(getMetaContent($, "name", "twitter:image"));
  const site = Boolean(getMetaContent($, "name", "twitter:site"));
  const missingFields: string[] = [];

  if (!type) missingFields.push("twitter:card");
  if (!title) missingFields.push("twitter:title");
  if (!description) missingFields.push("twitter:description");
  if (!image) missingFields.push("twitter:image");

  return { type, title, description, image, site, missingFields };
}

function getCharset($: cheerio.CheerioAPI): { hasCharset: boolean; charset: string } {
  const metaCharset = $("meta[charset]").first().attr("charset") ?? "";

  if (metaCharset) {
    return { hasCharset: true, charset: metaCharset.toUpperCase() };
  }

  const httpEquiv = $("meta")
    .toArray()
    .find(
      (node) => $(node).attr("http-equiv")?.toLowerCase() === "content-type"
    );

  if (httpEquiv) {
    const content = $(httpEquiv).attr("content") ?? "";
    const match = content.match(/charset=([^\s;]+)/i);

    if (match) {
      return { hasCharset: true, charset: match[1].toUpperCase() };
    }
  }

  return { hasCharset: false, charset: "" };
}

function getHreflang($: cheerio.CheerioAPI) {
  const tags = $("link[rel='alternate'][hreflang]").toArray();
  return {
    hasHreflang: tags.length > 0,
    hreflangCount: tags.length
  };
}

function getScriptMetrics($: cheerio.CheerioAPI) {
  let inlineScriptCount = 0;
  let externalScriptCount = 0;

  $("script").toArray().forEach((node) => {
    const src = $(node).attr("src");
    const type = ($(node).attr("type") ?? "").toLowerCase();

    if (type === "application/ld+json") return;

    if (src) {
      externalScriptCount += 1;
    } else {
      const content = $(node).text().trim();
      if (content.length > 0) {
        inlineScriptCount += 1;
      }
    }
  });

  return { inlineScriptCount, externalScriptCount };
}

function getImageDimensionIssues($: cheerio.CheerioAPI) {
  return $("img")
    .toArray()
    .filter((node) => {
      const width = $(node).attr("width");
      const height = $(node).attr("height");
      return !width || !height;
    }).length;
}

function hasSitemapLink($: cheerio.CheerioAPI) {
  return $("link[rel='sitemap']").length > 0;
}

function getParagraphCount($: cheerio.CheerioAPI): number {
  return $("p")
    .toArray()
    .filter((node) => normalizeText($(node).text()).split(" ").filter(Boolean).length >= 5)
    .length;
}

function getReadingTimeMinutes(wordCount: number): number {
  const wordsPerMinute = 238;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

function getMetaRefresh($: cheerio.CheerioAPI): { hasMetaRefresh: boolean; metaRefreshDelay: number } {
  const node = $("meta")
    .toArray()
    .find((n) => $(n).attr("http-equiv")?.toLowerCase() === "refresh");

  if (!node) {
    return { hasMetaRefresh: false, metaRefreshDelay: 0 };
  }

  const content = $(node).attr("content") ?? "";
  const delay = parseInt(content.split(";")[0] ?? "0", 10);
  return { hasMetaRefresh: true, metaRefreshDelay: isNaN(delay) ? 0 : delay };
}

function getCanonicalCount($: cheerio.CheerioAPI): number {
  return $("link")
    .toArray()
    .filter((node) =>
      $(node)
        .attr("rel")
        ?.toLowerCase()
        .split(/\s+/)
        .includes("canonical")
    ).length;
}

function getLazyLoadedImages($: cheerio.CheerioAPI): number {
  return $("img")
    .toArray()
    .filter((node) => $(node).attr("loading")?.toLowerCase() === "lazy").length;
}

function getDeprecatedHtml($: cheerio.CheerioAPI): { hasDeprecatedHtml: boolean; deprecatedTagsFound: string[] } {
  const deprecated = ["center", "font", "marquee", "blink", "strike", "tt", "big", "basefont", "applet", "frame", "frameset", "noframes"];
  const found = new Set<string>();

  deprecated.forEach((tag) => {
    if ($(tag).length > 0) {
      found.add(`<${tag}>`);
    }
  });

  $("table[width], table[bgcolor], td[width], td[bgcolor], td[valign], td[align], body[bgcolor], body[text], body[link]")
    .toArray()
    .forEach(() => {
      found.add("presentational HTML attributes");
    });

  return {
    hasDeprecatedHtml: found.size > 0,
    deprecatedTagsFound: Array.from(found)
  };
}

function getInlineCssCount($: cheerio.CheerioAPI): number {
  return $("[style]").toArray().filter((node) => {
    const style = $(node).attr("style") ?? "";
    return style.trim().length > 0;
  }).length;
}

function getAmpUrl($: cheerio.CheerioAPI): { hasAmp: boolean; ampUrl: string } {
  const node = $("link[rel='amphtml']").first();
  if (!node.length) {
    return { hasAmp: false, ampUrl: "" };
  }
  return { hasAmp: true, ampUrl: node.attr("href") ?? "" };
}

function hasPreconnect($: cheerio.CheerioAPI): boolean {
  return $("link[rel='preconnect'], link[rel='dns-prefetch']").length > 0;
}

function hasWebManifest($: cheerio.CheerioAPI): boolean {
  return $("link[rel='manifest']").length > 0;
}

function getOgType($: cheerio.CheerioAPI): string {
  return getMetaContent($, "property", "og:type");
}

function getMetaKeywords($: cheerio.CheerioAPI): string {
  return getMetaContent($, "name", "keywords");
}

function getTitleMatchesH1($: cheerio.CheerioAPI, title: string): boolean {
  if (!title) return false;
  const h1Text = normalizeText($("h1").first().text());
  if (!h1Text) return false;
  return title.toLowerCase() === h1Text.toLowerCase();
}

function getNofollowLinkMetrics(
  $: cheerio.CheerioAPI,
  finalUrl: string
): { internalNofollowLinks: number; externalNofollowLinks: number } {
  const finalHost = new URL(finalUrl).hostname;
  let internalNofollowLinks = 0;
  let externalNofollowLinks = 0;

  $("a")
    .toArray()
    .forEach((node) => {
      const href = ($(node).attr("href") ?? "").trim();
      const rel = ($(node).attr("rel") ?? "").toLowerCase();
      const isNofollow = rel.split(/\s+/).includes("nofollow");

      if (!href || href === "#" || /^javascript:/i.test(href)) return;
      if (/^(mailto|tel):/i.test(href)) return;

      try {
        const parsed = new URL(href, finalUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) return;

        if (isNofollow) {
          if (parsed.hostname === finalHost) {
            internalNofollowLinks += 1;
          } else {
            externalNofollowLinks += 1;
          }
        }
      } catch {
        // skip malformed
      }
    });

  return { internalNofollowLinks, externalNofollowLinks };
}

const GENERIC_ANCHOR_PHRASES = new Set([
  "click here", "here", "read more", "more", "learn more", "this", "link",
  "website", "visit", "page", "article", "post", "download", "view", "see more",
  "clic aquí", "más información", "ver más", "leer más", "aquí", "este"
]);

function classifyAnchorText(
  text: string,
  href: string,
  brandDomain: string
): keyof Omit<AnchorTextDistribution, "total"> {
  const clean = text.toLowerCase().trim();

  if (!clean) return "empty";

  // Naked URL: anchor text itself looks like a URL
  if (/^https?:\/\//i.test(clean) || /^www\./i.test(clean)) return "nakedUrl";

  // Branded: contains the root domain name (without TLD)
  const brandName = brandDomain.split(".")[0] ?? "";
  if (brandName && clean.includes(brandName.toLowerCase())) return "branded";

  // Generic
  if (GENERIC_ANCHOR_PHRASES.has(clean)) return "generic";

  return "keyword";
}

function getLinkProfile(
  $: cheerio.CheerioAPI,
  finalUrl: string
): {
  anchorText: AnchorTextDistribution;
  outboundDomainCount: number;
  topOutboundDomains: OutboundDomainEntry[];
  topLinkedDomain: string;
  topLinkedDomainCount: number;
  outboundConcentration: number;
} {
  let finalHost = "";
  let brandDomain = "";

  try {
    const parsed = new URL(finalUrl);
    finalHost = parsed.hostname;
    brandDomain = parsed.hostname.replace(/^www\./, "");
  } catch {
    // ignore
  }

  const domainCounts = new Map<string, number>();
  const distribution: AnchorTextDistribution = {
    branded: 0,
    keyword: 0,
    nakedUrl: 0,
    generic: 0,
    empty: 0,
    total: 0
  };

  $("a")
    .toArray()
    .forEach((node) => {
      const href = ($(node).attr("href") ?? "").trim();

      if (!href || href === "#" || /^(javascript|mailto|tel):/i.test(href)) return;

      let parsedHref: URL;
      try {
        parsedHref = new URL(href, finalUrl);
      } catch {
        return;
      }

      if (!["http:", "https:"].includes(parsedHref.protocol)) return;

      // Only analyze external links for outbound profile
      if (parsedHref.hostname !== finalHost) {
        const outDomain = parsedHref.hostname.replace(/^www\./, "");
        domainCounts.set(outDomain, (domainCounts.get(outDomain) ?? 0) + 1);

        // Anchor text classification for external links
        const anchorText = normalizeText($(node).text());
        const category = classifyAnchorText(anchorText, href, brandDomain);
        distribution[category] += 1;
        distribution.total += 1;
      }
    });

  // Build sorted domain list
  const sortedDomains: OutboundDomainEntry[] = Array.from(domainCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([domain, count]) => ({ domain, count }));

  const topOutboundDomains = sortedDomains.slice(0, 5);
  const topEntry = sortedDomains[0];
  const topLinkedDomain = topEntry?.domain ?? "";
  const topLinkedDomainCount = topEntry?.count ?? 0;
  const totalExternal = distribution.total;
  const outboundConcentration =
    totalExternal > 0 ? Math.round((topLinkedDomainCount / totalExternal) * 100) : 0;

  return {
    anchorText: distribution,
    outboundDomainCount: domainCounts.size,
    topOutboundDomains,
    topLinkedDomain,
    topLinkedDomainCount,
    outboundConcentration
  };
}

function getHeadingHierarchyIssues($: cheerio.CheerioAPI): string[] {
  const issues = new Set<string>();
  const nodes = $("h1, h2, h3, h4, h5, h6").toArray();

  let prevLevel = 0;

  for (const node of nodes) {
    const level = parseInt(node.tagName.replace("h", ""), 10);

    if (prevLevel > 0 && level > prevLevel + 1) {
      issues.add(`H${level} found without a preceding H${level - 1}`);
    }

    prevLevel = level;
  }

  return Array.from(issues);
}

function analyzeUrl(finalUrl: string) {
  try {
    const parsed = new URL(finalUrl);
    const path = parsed.pathname;
    const segments = path.split("/").filter(Boolean);
    const urlLength = finalUrl.length;
    const urlDepth = segments.length;
    const urlHasQueryParams = parsed.searchParams.size > 0 || parsed.search.length > 1;
    const urlHasUppercase = /[A-Z]/.test(path);
    const urlIsClean =
      !urlHasUppercase &&
      urlLength <= 115 &&
      urlDepth <= 4 &&
      !parsed.search.includes("?id=") &&
      !/[{}|\\^`<>\s]/.test(path);

    return { urlLength, urlDepth, urlHasQueryParams, urlHasUppercase, urlIsClean };
  } catch {
    return {
      urlLength: finalUrl.length,
      urlDepth: 0,
      urlHasQueryParams: false,
      urlHasUppercase: false,
      urlIsClean: false
    };
  }
}

export function extractMetadata(
  html: string,
  finalUrl: string,
  statusCode: number,
  context: ExtractionContext
): ExtractedMetadata {
  const $ = cheerio.load(html);

  const title = normalizeText($("head title").first().text());
  const metaDescription = getMetaContent($, "name", "description");
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const headings = getHeadingPreview($);
  const headingHierarchyIssues = getHeadingHierarchyIssues($);
  const imageCount = $("img").length;
  const imagesWithoutAlt = $("img")
    .toArray()
    .filter((node) => !normalizeText($(node).attr("alt") ?? "")).length;
  const imagesWithoutAltPercentage =
    imageCount === 0 ? 0 : (imagesWithoutAlt / imageCount) * 100;
  const imagesWithoutDimensions = getImageDimensionIssues($);

  const { internalLinks, externalLinks, emptyLinks, anchorsWithoutText } = getLinkMetrics(
    $,
    finalUrl
  );

  const canonicalUrl = getCanonicalUrl($, finalUrl);
  let canonicalMatchesFinalUrl = false;
  let canonicalHostMatchesFinalUrl = false;

  if (canonicalUrl) {
    try {
      const canonical = new URL(canonicalUrl);
      const final = new URL(finalUrl);
      canonicalMatchesFinalUrl =
        canonical.origin === final.origin &&
        canonical.pathname.replace(/\/$/, "") === final.pathname.replace(/\/$/, "");
      canonicalHostMatchesFinalUrl = canonical.hostname === final.hostname;
    } catch {
      canonicalMatchesFinalUrl = false;
      canonicalHostMatchesFinalUrl = false;
    }
  }

  const viewportContent = getMetaContent($, "name", "viewport");
  const robotsContent = getMetaContent($, "name", "robots").toLowerCase();
  const robotsDirectives = robotsContent
    .split(",")
    .map((directive) => directive.trim())
    .filter(Boolean);
  const nofollow = robotsDirectives.includes("nofollow");
  const isNoindex = robotsDirectives.includes("noindex");
  const hasNoarchive = robotsDirectives.includes("noarchive");
  const hasNosnippet = robotsDirectives.includes("nosnippet");
  const xRobotsTag = normalizeText(context.xRobotsTag).toLowerCase();
  const xRobotsNoindex = /\bnoindex\b/.test(xRobotsTag);
  const xRobotsNofollow = /\bnofollow\b/.test(xRobotsTag);

  const openGraph = getOpenGraph($);
  const twitterCard = getTwitterCard($);
  const { hasCharset, charset } = getCharset($);
  const { hasHreflang, hreflangCount } = getHreflang($);
  const { inlineScriptCount, externalScriptCount } = getScriptMetrics($);
  const sitemapLink = hasSitemapLink($);

  const schemaCount = $("script[type='application/ld+json']").length;
  const schemaTypes = getSchemaTypes($);
  const lang = normalizeText($("html").attr("lang") ?? "");
  const isHttps = new URL(finalUrl).protocol === "https:";

  // --- New deep analysis ---
  const wordCount = getVisibleWordCount($);
  const paragraphCount = getParagraphCount($);
  const readingTimeMinutes = getReadingTimeMinutes(wordCount);
  const { hasMetaRefresh, metaRefreshDelay } = getMetaRefresh($);
  const canonicalCount = getCanonicalCount($);
  const lazyLoadedImages = getLazyLoadedImages($);
  const { hasDeprecatedHtml, deprecatedTagsFound } = getDeprecatedHtml($);
  const inlineCssCount = getInlineCssCount($);
  const { hasAmp, ampUrl } = getAmpUrl($);
  const ampPreconnect = hasPreconnect($);
  const webManifest = hasWebManifest($);
  const ogType = getOgType($);
  const metaKeywords = getMetaKeywords($);
  const { internalNofollowLinks, externalNofollowLinks } = getNofollowLinkMetrics($, finalUrl);
  const titleMatchesH1 = getTitleMatchesH1($, normalizeText($("head title").first().text()));
  const linkProfile = getLinkProfile($, finalUrl);

  let indexability: AuditSummary["indexability"] = "Indexable";

  if (statusCode >= 400 || isNoindex || xRobotsNoindex || context.discovery.robotsTxtBlocksAll) {
    indexability = "Not Indexable";
  } else if (!canonicalUrl || !isHttps || !canonicalHostMatchesFinalUrl) {
    indexability = "Potential Issues";
  }

  const urlAnalysis = analyzeUrl(finalUrl);

  return {
    summary: {
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      h1Count,
      h2Count,
      h3Count,
      headings,
      headingHierarchyIssues,
      imageCount,
      imagesWithoutAlt,
      imagesWithoutAltPercentage,
      imagesWithoutDimensions,
      internalLinks,
      externalLinks,
      emptyLinks,
      anchorsWithoutText,
      wordCount,
      hasCanonical: Boolean(canonicalUrl),
      canonicalUrl,
      canonicalMatchesFinalUrl,
      canonicalHostMatchesFinalUrl,
      hasViewport: Boolean(viewportContent),
      viewportContent,
      hasFavicon: hasFaviconLink($),
      hasSchema: schemaCount > 0,
      schemaCount,
      schemaTypes,
      hasLang: Boolean(lang),
      lang,
      hasHreflang,
      hreflangCount,
      hasCharset,
      charset,
      isHttps,
      isNoindex,
      robotsContent,
      robotsDirectives,
      nofollow,
      hasNoarchive,
      hasNosnippet,
      xRobotsTag,
      xRobotsNoindex,
      xRobotsNofollow,
      indexability,
      hasOpenGraph:
        openGraph.title || openGraph.description || openGraph.image || openGraph.url,
      openGraph,
      hasTwitterCard: Boolean(twitterCard.type),
      twitterCard,
      inlineScriptCount,
      externalScriptCount,
      hasSitemapLink: sitemapLink,
      responseTimeMs: context.responseTimeMs,
      pageSizeBytes: context.pageSizeBytes,
      isRedirected: context.isRedirected,
      contentType: context.contentType,
      discovery: context.discovery,
      ...urlAnalysis,
      // New deep analysis fields
      paragraphCount,
      readingTimeMinutes,
      hasMetaRefresh,
      metaRefreshDelay,
      canonicalCount,
      lazyLoadedImages,
      hasDeprecatedHtml,
      deprecatedTagsFound,
      inlineCssCount,
      hasAmp,
      ampUrl,
      hasPreconnect: ampPreconnect,
      hasWebManifest: webManifest,
      ogType,
      metaKeywords,
      internalNofollowLinks,
      externalNofollowLinks,
      titleMatchesH1,
      hasHstsHeader: context.hasHstsHeader,
      hasXContentTypeOptions: context.hasXContentTypeOptions,
      hasXFrameOptions: context.hasXFrameOptions,
      // Link profile
      anchorText: linkProfile.anchorText,
      outboundDomainCount: linkProfile.outboundDomainCount,
      topOutboundDomains: linkProfile.topOutboundDomains,
      topLinkedDomain: linkProfile.topLinkedDomain,
      topLinkedDomainCount: linkProfile.topLinkedDomainCount,
      outboundConcentration: linkProfile.outboundConcentration,
      // Open PageRank — populated by route.ts after fetching
      openPageRank: null,
      openPageRankFetched: false
    }
  };
}
