import type { AuditSummary, ScoreGrade } from "@/lib/audit/types";

function resolveGrade(score: number): ScoreGrade {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Needs Work";
  }

  return "Poor";
}

export function calculateScore(summary: AuditSummary, statusCode: number) {
  let score = 0;

  if (summary.titleLength >= 30 && summary.titleLength <= 60) {
    score += 10;
  } else if (summary.titleLength >= 20 && summary.titleLength <= 70) {
    score += 7;
  } else if (summary.titleLength > 0) {
    score += 4;
  }

  if (summary.metaDescriptionLength >= 120 && summary.metaDescriptionLength <= 160) {
    score += 10;
  } else if (summary.metaDescriptionLength >= 90 && summary.metaDescriptionLength <= 180) {
    score += 6;
  } else if (summary.metaDescriptionLength > 0) {
    score += 3;
  }

  if (summary.h1Count === 1) {
    score += 10;
  } else if (summary.h1Count > 1) {
    score += 5;
  }

  if (summary.h2Count > 0) {
    score += 8;
  } else if (summary.h3Count > 0) {
    score += 3;
  }

  if (summary.hasCanonical) {
    score += 7;
  }

  if (summary.indexability === "Indexable") {
    score += 12;
  } else if (summary.indexability === "Potential Issues") {
    score += 8;
  }

  if (summary.imageCount === 0 || summary.imagesWithoutAltPercentage <= 20) {
    score += 8;
  } else if (summary.imagesWithoutAltPercentage <= 50) {
    score += 4;
  }

  if (summary.isHttps) {
    score += 8;
  }

  if (summary.hasViewport) {
    score += 8;
  }

  const openGraphFieldsPresent = [
    summary.openGraph.title,
    summary.openGraph.description,
    summary.openGraph.image,
    summary.openGraph.url
  ].filter(Boolean).length;

  if (openGraphFieldsPresent === 4) {
    score += 5;
  } else if (openGraphFieldsPresent >= 2) {
    score += 3;
  } else if (openGraphFieldsPresent === 1) {
    score += 1;
  }

  if (summary.hasSchema) {
    score += 5;
  }

  if (summary.hasLang) {
    score += 4;
  }

  if (summary.hasFavicon) {
    score += 3;
  }

  if (summary.wordCount >= 700) {
    score += 4;
  } else if (summary.wordCount >= 250) {
    score += 2;
  }

  // Security headers
  if (summary.hasHstsHeader) {
    score += 3;
  }
  if (summary.hasXContentTypeOptions) {
    score += 2;
  }
  if (summary.hasXFrameOptions) {
    score += 2;
  }

  // Lazy loading (performance signal)
  if (summary.imageCount > 3 && summary.lazyLoadedImages > 0) {
    score += 2;
  }

  // Preconnect hints
  if (summary.hasPreconnect) {
    score += 2;
  }

  // Content structure
  if (summary.paragraphCount >= 5) {
    score += 2;
  }

  if (summary.responseTimeMs > 2500) {
    score -= 7;
  } else if (summary.responseTimeMs > 1200) {
    score -= 3;
  }

  if (summary.pageSizeBytes > 1_500_000) {
    score -= 5;
  } else if (summary.pageSizeBytes > 700_000) {
    score -= 2;
  }

  if (summary.headingHierarchyIssues.length > 0) {
    score -= 4;
  }

  if (summary.imagesWithoutDimensions > 0) {
    score -= summary.imagesWithoutDimensions > 5 ? 4 : 2;
  }

  if (!summary.hasCharset) {
    score -= 2;
  }

  if (!summary.urlIsClean) {
    score -= 3;
  }

  if (summary.externalScriptCount > 25) {
    score -= 3;
  }

  // Penalize meta refresh
  if (summary.hasMetaRefresh) {
    score -= summary.metaRefreshDelay === 0 ? 8 : 5;
  }

  // Penalize multiple canonical tags
  if (summary.canonicalCount > 1) {
    score -= 6;
  }

  // Penalize deprecated HTML
  if (summary.hasDeprecatedHtml) {
    score -= 3;
  }

  // Penalize title === H1 (missed opportunity)
  if (summary.titleMatchesH1) {
    score -= 2;
  }

  if (
    !summary.discovery.sitemapXmlExists &&
    !summary.hasSitemapLink &&
    !summary.discovery.robotsTxtHasSitemap
  ) {
    score -= 3;
  }

  // Link profile scoring
  if (summary.outboundDomainCount >= 3) {
    score += 2;
  }

  const { total: anchorTotal, keyword: anchorKeyword } = summary.anchorText;
  if (anchorTotal > 0 && anchorKeyword / anchorTotal >= 0.4) {
    score += 2;
  }

  if (summary.outboundConcentration >= 70 && summary.outboundDomainCount > 0) {
    score -= 3;
  }

  // Open PageRank bonus (if available)
  if (summary.openPageRankFetched && summary.openPageRank !== null) {
    if (summary.openPageRank >= 6) {
      score += 5;
    } else if (summary.openPageRank >= 3) {
      score += 3;
    } else if (summary.openPageRank >= 1) {
      score += 1;
    }
  }

  if (statusCode >= 400) {
    score = Math.min(score, 45);
  }

  if (summary.isNoindex || summary.xRobotsNoindex) {
    score = Math.min(score, 55);
  }

  if (summary.discovery.robotsTxtBlocksAll) {
    score = Math.min(score, 45);
  }

  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: boundedScore,
    grade: resolveGrade(boundedScore)
  };
}
