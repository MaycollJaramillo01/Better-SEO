import { calculateScore } from "@/lib/audit/calculateScore";
import { extractMetadata } from "@/lib/audit/extractMetadata";
import type {
  AuditIssue,
  AuditRecommendation,
  AuditData,
  ExtractionContext,
  AuditSummary,
  IssueSeverity,
  RecommendationPriority
} from "@/lib/audit/types";

const issueSeverityOrder: Record<IssueSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

const recommendationPriorityOrder: Record<RecommendationPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

function addRecommendation(
  collection: Map<string, AuditRecommendation>,
  recommendation: AuditRecommendation
) {
  const existing = collection.get(recommendation.title);

  if (!existing) {
    collection.set(recommendation.title, recommendation);
    return;
  }

  if (
    recommendationPriorityOrder[recommendation.priority] <
    recommendationPriorityOrder[existing.priority]
  ) {
    collection.set(recommendation.title, recommendation);
  }
}

function pushIssue(
  issues: AuditIssue[],
  recommendations: Map<string, AuditRecommendation>,
  issue: AuditIssue,
  recommendation: AuditRecommendation
) {
  issues.push(issue);
  addRecommendation(recommendations, recommendation);
}

function sortIssues(issues: AuditIssue[]) {
  return issues.sort(
    (left, right) => issueSeverityOrder[left.severity] - issueSeverityOrder[right.severity]
  );
}

function sortRecommendations(recommendations: AuditRecommendation[]) {
  return recommendations.sort(
    (left, right) =>
      recommendationPriorityOrder[left.priority] - recommendationPriorityOrder[right.priority]
  );
}

function buildIssues(summary: AuditSummary, statusCode: number) {
  const issues: AuditIssue[] = [];
  const recommendations = new Map<string, AuditRecommendation>();

  if (statusCode >= 400) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "critical",
        category: "Status Code",
        title: "The page returned an HTTP error status",
        message: `The audited URL returned status code ${statusCode}, which can block search engines and users from accessing the page.`,
        recommendation: "Resolve the HTTP status issue so the page returns a valid 200-level response."
      },
      {
        priority: "high",
        title: "Resolve HTTP status errors",
        description:
          "Fix the response code before investing in on-page SEO improvements. Search engines need a valid accessible page."
      }
    );
  }

  if (!summary.title) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Metadata",
        title: "The page is missing a title tag",
        message: "Search engines rely on the title tag to understand the page topic and show a strong search result.",
        recommendation: "Add a unique title tag between 30 and 60 characters."
      },
      {
        priority: "high",
        title: "Add a unique title tag",
        description:
          "Every important page should have a descriptive title between 30 and 60 characters."
      }
    );
  } else if (summary.titleLength < 30) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Metadata",
        title: "The title tag is too short",
        message: `The current title is ${summary.titleLength} characters long. Short titles often miss important relevance signals.`,
        recommendation: "Expand the title so it clearly describes the page topic."
      },
      {
        priority: "medium",
        title: "Improve title tag length",
        description:
          "Aim for a title between 30 and 60 characters while keeping the main topic and intent clear."
      }
    );
  } else if (summary.titleLength > 60) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Metadata",
        title: "The title tag is too long",
        message: `The current title is ${summary.titleLength} characters long and may be truncated in search results.`,
        recommendation: "Shorten the title to keep the most important information visible."
      },
      {
        priority: "medium",
        title: "Trim the title tag",
        description:
          "Keep the title within 30 to 60 characters so the main message is easier to display in search results."
      }
    );
  }

  if (!summary.metaDescription) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Metadata",
        title: "The page is missing a meta description",
        message: "Without a description, search engines may pull weaker copy from the page.",
        recommendation: "Add a descriptive meta description between 120 and 160 characters."
      },
      {
        priority: "high",
        title: "Improve meta description",
        description: "Write a description between 120 and 160 characters."
      }
    );
  } else if (summary.metaDescriptionLength < 120) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Metadata",
        title: "The meta description is too short",
        message: `The current description is ${summary.metaDescriptionLength} characters long, which limits the message shown in search results.`,
        recommendation: "Add more detail while keeping the description concise and relevant."
      },
      {
        priority: "medium",
        title: "Expand the meta description",
        description:
          "Use 120 to 160 characters to explain the page value and encourage qualified clicks."
      }
    );
  } else if (summary.metaDescriptionLength > 160) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Metadata",
        title: "The meta description is too long",
        message: `The current description is ${summary.metaDescriptionLength} characters long and may be truncated in search results.`,
        recommendation: "Shorten the copy and front-load the most important message."
      },
      {
        priority: "medium",
        title: "Trim the meta description",
        description:
          "Keep the meta description within 120 to 160 characters so the message remains readable in search snippets."
      }
    );
  }

  if (summary.h1Count === 0) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Headings",
        title: "The page does not have an H1 heading",
        message: "A clear H1 helps define the primary topic for both users and search engines.",
        recommendation: "Add one descriptive H1 that reflects the page topic."
      },
      {
        priority: "high",
        title: "Add a clear H1 heading",
        description: "Use one descriptive H1 that summarizes the main topic of the page."
      }
    );
  } else if (summary.h1Count > 1) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Headings",
        title: "The page has multiple H1 headings",
        message: `This page contains ${summary.h1Count} H1 tags, which can dilute the main topic signal.`,
        recommendation: "Keep one clear H1 and move secondary headings to H2 or H3."
      },
      {
        priority: "medium",
        title: "Use only one H1",
        description: "Keep one clear H1 that describes the main topic of the page."
      }
    );
  }

  if (summary.h2Count === 0) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Headings",
        title: "The page lacks H2 structure",
        message: "H2 headings help organize content into scannable sections and reinforce topical depth.",
        recommendation: "Break the page into sections with relevant H2 headings."
      },
      {
        priority: "medium",
        title: "Improve heading structure",
        description:
          "Add H2 headings to organize supporting sections and make the page easier to scan."
      }
    );
  }

  if (!summary.hasCanonical) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Canonical",
        title: "The page is missing a canonical URL",
        message: "Without a canonical tag, search engines may have a harder time understanding the preferred URL.",
        recommendation: "Add a canonical tag that points to the preferred page URL."
      },
      {
        priority: "medium",
        title: "Add a canonical URL",
        description:
          "Use a canonical tag to confirm the preferred version of the page for search engines."
      }
    );
  }

  if (summary.hasCanonical && !summary.canonicalHostMatchesFinalUrl) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Canonical",
        title: "Canonical points to a different host",
        message:
          "The canonical URL uses a different hostname than the audited page, which can transfer indexing signals away from this site.",
        recommendation: "Confirm the canonical URL points to the intended preferred version of this page."
      },
      {
        priority: "high",
        title: "Review cross-host canonical",
        description:
          "A canonical pointing to another host should be intentional. Otherwise update it to the preferred URL on this site."
      }
    );
  } else if (summary.hasCanonical && !summary.canonicalMatchesFinalUrl) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Canonical",
        title: "Canonical differs from the final URL",
        message:
          "The canonical URL does not exactly match the final audited path. This may be intentional, but it should be reviewed.",
        recommendation: "Make sure canonical normalization is deliberate and consistent."
      },
      {
        priority: "low",
        title: "Review canonical normalization",
        description:
          "Confirm the canonical path matches the preferred version of the page after redirects and trailing-slash handling."
      }
    );
  }

  if (summary.isNoindex) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "critical",
        category: "Indexability",
        title: "The page is marked as noindex",
        message: "The robots meta tag is currently telling search engines not to index this page.",
        recommendation: "Remove the noindex directive if this page should rank."
      },
      {
        priority: "high",
        title: "Remove noindex if the page should rank",
        description: "This page is currently telling search engines not to index it."
      }
    );
  }

  if (summary.xRobotsNoindex) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "critical",
        category: "Indexability",
        title: "The HTTP X-Robots-Tag blocks indexing",
        message:
          "The server response includes an X-Robots-Tag noindex directive, which can prevent search engines from indexing the page.",
        recommendation: "Remove the HTTP noindex directive if this page should be eligible for search indexing."
      },
      {
        priority: "high",
        title: "Remove HTTP noindex if the page should rank",
        description:
          "X-Robots-Tag directives are powerful because they apply at the HTTP response level."
      }
    );
  }

  if (summary.discovery.robotsTxtBlocksAll) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "critical",
        category: "Robots",
        title: "robots.txt appears to block all crawling",
        message:
          "The robots.txt file includes a User-agent: * group with Disallow: /, which can block broad crawler access.",
        recommendation: "Review robots.txt and remove full-site blocking if the site should be crawlable."
      },
      {
        priority: "high",
        title: "Fix full-site robots.txt blocking",
        description:
          "A broad Disallow: / can prevent search engines from crawling important public pages."
      }
    );
  }

  if (!summary.isHttps) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "HTTPS",
        title: "The page is not using HTTPS",
        message: "HTTPS is an important trust and security signal for both users and search engines.",
        recommendation: "Serve the page over HTTPS and redirect the HTTP version."
      },
      {
        priority: "high",
        title: "Move the page to HTTPS",
        description:
          "Enable HTTPS and make sure the canonical URL and internal links point to the secure version."
      }
    );
  }

  if (!summary.hasViewport) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Mobile",
        title: "The page is missing a viewport tag",
        message: "Without a viewport tag, mobile rendering can break and hurt usability.",
        recommendation:
          "Add a viewport meta tag so the page scales correctly on mobile devices."
      },
      {
        priority: "high",
        title: "Add a mobile viewport tag",
        description:
          'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to improve mobile rendering.'
      }
    );
  }

  if (!summary.hasCharset) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "HTML",
        title: "No charset declaration was detected",
        message:
          "A charset declaration helps browsers interpret text consistently and should appear early in the document head.",
        recommendation: "Add a UTF-8 charset declaration in the document head."
      },
      {
        priority: "low",
        title: "Add charset metadata",
        description: "Use <meta charset=\"utf-8\"> near the top of the document head."
      }
    );
  }

  if (summary.imageCount > 0 && summary.imagesWithoutAltPercentage > 50) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Images",
        title: "A large share of images are missing alt text",
        message: `${summary.imagesWithoutAlt} of ${summary.imageCount} images do not have alt text.`,
        recommendation: "Add descriptive alt text to meaningful images across the page."
      },
      {
        priority: "high",
        title: "Fix missing image alt text",
        description:
          "Review important images and add descriptive alt text to improve accessibility and image relevance."
      }
    );
  } else if (summary.imageCount > 0 && summary.imagesWithoutAltPercentage > 20) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Images",
        title: "Some images are missing alt text",
        message: `${summary.imagesWithoutAlt} of ${summary.imageCount} images do not have alt text.`,
        recommendation: "Add descriptive alt text to important images."
      },
      {
        priority: "medium",
        title: "Improve image alt coverage",
        description:
          "Add descriptive alt text to important images so content is more accessible and informative."
      }
    );
  }

  if (summary.imagesWithoutDimensions > 0) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: summary.imagesWithoutDimensions > 5 ? "medium" : "low",
        category: "Images",
        title: "Some images are missing width or height attributes",
        message: `${summary.imagesWithoutDimensions} image elements are missing explicit width or height attributes.`,
        recommendation:
          "Add intrinsic image dimensions or reserve layout space to reduce visual instability."
      },
      {
        priority: summary.imagesWithoutDimensions > 5 ? "medium" : "low",
        title: "Add image dimensions",
        description:
          "Explicit dimensions help browsers reserve space and can reduce layout shifts."
      }
    );
  }

  if (summary.headingHierarchyIssues.length > 0) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Headings",
        title: "Heading hierarchy skips levels",
        message: `Detected hierarchy issues: ${summary.headingHierarchyIssues.join(", ")}.`,
        recommendation: "Use a logical heading outline without skipping important levels."
      },
      {
        priority: "medium",
        title: "Clean up heading hierarchy",
        description:
          "A clean heading outline improves accessibility, scannability and content interpretation."
      }
    );
  }

  if (summary.openGraph.missingFields.length > 0) {
    const severity = summary.openGraph.missingFields.length >= 3 ? "medium" : "low";

    pushIssue(
      issues,
      recommendations,
      {
        severity,
        category: "Social",
        title: "Open Graph metadata is incomplete",
        message: `Missing fields: ${summary.openGraph.missingFields.join(", ")}.`,
        recommendation: "Complete the main Open Graph tags so shared links look more consistent."
      },
      {
        priority: severity === "medium" ? "medium" : "low",
        title: "Complete Open Graph tags",
        description:
          "Add og:title, og:description, og:image and og:url so pages share cleanly across social platforms."
      }
    );
  }

  if (summary.twitterCard.missingFields.length > 0) {
    const severity = summary.twitterCard.missingFields.length >= 3 ? "low" : "low";

    pushIssue(
      issues,
      recommendations,
      {
        severity,
        category: "Social",
        title: "Twitter Card metadata is incomplete",
        message: `Missing fields: ${summary.twitterCard.missingFields.join(", ")}.`,
        recommendation:
          "Add Twitter Card metadata if the page should present cleanly when shared."
      },
      {
        priority: "low",
        title: "Complete Twitter Card tags",
        description:
          "Add twitter:card, twitter:title, twitter:description and twitter:image for stronger social previews."
      }
    );
  }

  if (!summary.hasSchema) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Schema",
        title: "No structured data was detected",
        message: "Structured data can help search engines understand entities, organization details and content type.",
        recommendation: "Add relevant JSON-LD schema for the page type."
      },
      {
        priority: "medium",
        title: "Add structured data",
        description:
          "Implement relevant JSON-LD such as Organization, WebSite, Article or Service schema where appropriate."
      }
    );
  }

  if (!summary.hasLang) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Language",
        title: "The HTML language attribute is missing",
        message: "The lang attribute helps browsers and assistive technologies interpret the page correctly.",
        recommendation: "Set the language on the html element."
      },
      {
        priority: "low",
        title: "Add an HTML lang attribute",
        description:
          "Set a language like en or es on the html element so browsers and search engines have a clear language hint."
      }
    );
  }

  if (!summary.hasFavicon) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Branding",
        title: "No favicon was detected",
        message: "A favicon improves brand consistency in browsers and shared shortcuts.",
        recommendation: "Add an icon link in the document head."
      },
      {
        priority: "low",
        title: "Add a favicon",
        description:
          "Add link rel=\"icon\" or an equivalent icon asset so the site has a consistent browser identity."
      }
    );
  }

  if (!summary.discovery.robotsTxtExists) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Robots",
        title: "robots.txt was not found",
        message:
          "The audit could not detect a robots.txt file at the site root. This is not always critical, but it limits crawler guidance.",
        recommendation: "Add a robots.txt file that references the XML sitemap and defines crawler rules."
      },
      {
        priority: "low",
        title: "Publish robots.txt",
        description:
          "A simple robots.txt file gives crawlers explicit guidance and can reference your XML sitemap."
      }
    );
  }

  if (!summary.discovery.sitemapXmlExists && !summary.hasSitemapLink && !summary.discovery.robotsTxtHasSitemap) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Sitemap",
        title: "No XML sitemap signal was detected",
        message:
          "The audit did not find /sitemap.xml, a sitemap link tag, or a sitemap directive in robots.txt.",
        recommendation: "Publish an XML sitemap and reference it from robots.txt."
      },
      {
        priority: "medium",
        title: "Add an XML sitemap",
        description:
          "Sitemaps help search engines discover important URLs, especially on larger or frequently updated sites."
      }
    );
  }

  if (summary.wordCount < 250) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Content",
        title: "The page has limited visible copy",
        message: `The page contains approximately ${summary.wordCount} visible words, which may limit topical depth.`,
        recommendation: "Expand the page with useful supporting copy where it adds value."
      },
      {
        priority: "low",
        title: "Add more useful on-page copy",
        description:
          "Pages with less than 250 visible words often need more context to support strong organic relevance."
      }
    );
  }

  if (!summary.urlIsClean) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "URL",
        title: "The final URL could be cleaner",
        message:
          "The audited URL is long, deep, includes query parameters, uppercase characters or uncommon path characters.",
        recommendation:
          "Use short, readable, lowercase URLs for important landing pages where possible."
      },
      {
        priority: "low",
        title: "Improve URL readability",
        description:
          "Clean URLs are easier to understand, share and maintain across campaigns."
      }
    );
  }

  if (summary.responseTimeMs > 2500) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "high",
        category: "Performance",
        title: "The initial HTML response is slow",
        message: `The server took approximately ${summary.responseTimeMs}ms to return the HTML document.`,
        recommendation:
          "Review hosting, server rendering, caching and backend bottlenecks that affect initial response time."
      },
      {
        priority: "high",
        title: "Improve server response time",
        description:
          "A faster HTML response improves crawl efficiency and user-perceived performance."
      }
    );
  } else if (summary.responseTimeMs > 1200) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Performance",
        title: "The initial HTML response could be faster",
        message: `The server returned HTML in approximately ${summary.responseTimeMs}ms.`,
        recommendation:
          "Review caching and server response paths to reduce initial wait time."
      },
      {
        priority: "medium",
        title: "Reduce initial response time",
        description:
          "Improving the first HTML response can help both users and crawlers reach content sooner."
      }
    );
  }

  if (summary.pageSizeBytes > 1_500_000) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "medium",
        category: "Performance",
        title: "The HTML document is very large",
        message: `The returned HTML is approximately ${Math.round(summary.pageSizeBytes / 1024)}KB.`,
        recommendation:
          "Reduce unnecessary markup, inline payloads and duplicated template output."
      },
      {
        priority: "medium",
        title: "Reduce HTML payload size",
        description:
          "Large HTML documents can slow parsing and make crawls less efficient."
      }
    );
  }

  if (summary.externalScriptCount > 25) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Performance",
        title: "The page loads many external scripts",
        message: `${summary.externalScriptCount} external script tags were detected.`,
        recommendation:
          "Audit third-party scripts and remove anything that does not support business or measurement goals."
      },
      {
        priority: "low",
        title: "Audit JavaScript dependencies",
        description:
          "Reducing unnecessary scripts can improve performance and simplify maintenance."
      }
    );
  }

  if (summary.emptyLinks > 0) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Links",
        title: "Some links are empty or placeholder links",
        message: `${summary.emptyLinks} link elements use empty, broken or placeholder href values.`,
        recommendation: "Replace placeholder links with valid destinations or remove them."
      },
      {
        priority: "low",
        title: "Clean up empty links",
        description:
          "Remove empty link targets and placeholder href values so the page is easier to crawl and use."
      }
    );
  }

  if (summary.anchorsWithoutText > 0) {
    pushIssue(
      issues,
      recommendations,
      {
        severity: "low",
        category: "Accessibility",
        title: "Some anchors do not expose readable text",
        message: `${summary.anchorsWithoutText} links do not have visible text or an accessible label.`,
        recommendation: "Add descriptive link text or aria-labels."
      },
      {
        priority: "low",
        title: "Label icon-only links",
        description:
          "Ensure links have readable text, an aria-label or meaningful image alt text so users and crawlers can interpret them."
      }
    );
  }

  if (issues.length === 0) {
    addRecommendation(recommendations, {
      priority: "low",
      title: "Keep monitoring technical SEO",
      description:
        "This page looks healthy at a basic level. Recheck metadata, indexability and templates whenever the site changes."
    });
  }

  return {
    issues: sortIssues(issues),
    recommendations: sortRecommendations(Array.from(recommendations.values()))
  };
}

export function analyzeSeo(
  html: string,
  requestedUrl: string,
  finalUrl: string,
  statusCode: number,
  context: ExtractionContext
): AuditData {
  const { summary } = extractMetadata(html, finalUrl, statusCode, context);
  const { issues, recommendations } = buildIssues(summary, statusCode);
  const { score, grade } = calculateScore(summary, statusCode);

  return {
    url: requestedUrl,
    finalUrl,
    statusCode,
    score,
    grade,
    summary,
    issues,
    recommendations
  };
}
