import { assertSafeUrl } from "@/lib/audit/fetchWebsite";
import type { DiscoverySummary } from "@/lib/audit/types";

const DISCOVERY_TIMEOUT_MS = 4_500;

function emptyDiscovery(): DiscoverySummary {
  return {
    robotsTxtChecked: true,
    robotsTxtExists: false,
    robotsTxtStatusCode: 0,
    robotsTxtHasSitemap: false,
    robotsTxtBlocksAll: false,
    sitemapXmlChecked: true,
    sitemapXmlExists: false,
    sitemapXmlStatusCode: 0
  };
}

async function fetchText(url: string, accept: string) {
  await assertSafeUrl(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DISCOVERY_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; FreeSEOAuditBot/2.0)",
        accept
      }
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      text: text.slice(0, 250_000),
      contentType: response.headers.get("content-type") ?? ""
    };
  } catch {
    return {
      statusCode: 0,
      text: "",
      contentType: ""
    };
  } finally {
    clearTimeout(timeout);
  }
}

function robotsBlocksAll(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, "").trim())
    .filter(Boolean);

  let appliesToAll = false;

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rest.join(":").trim().toLowerCase();

    if (key === "user-agent") {
      appliesToAll = value === "*";
      continue;
    }

    if (appliesToAll && key === "disallow" && value === "/") {
      return true;
    }
  }

  return false;
}

export async function discoverSiteFiles(finalUrl: string): Promise<DiscoverySummary> {
  let origin: string;

  try {
    origin = new URL(finalUrl).origin;
  } catch {
    return emptyDiscovery();
  }

  const [robotsResult, sitemapResult] = await Promise.all([
    fetchText(`${origin}/robots.txt`, "text/plain,*/*;q=0.8"),
    fetchText(`${origin}/sitemap.xml`, "application/xml,text/xml,*/*;q=0.8")
  ]);

  const robotsExists =
    robotsResult.statusCode >= 200 &&
    robotsResult.statusCode < 400 &&
    robotsResult.text.trim().length > 0;
  const sitemapExists =
    sitemapResult.statusCode >= 200 &&
    sitemapResult.statusCode < 400 &&
    (sitemapResult.contentType.toLowerCase().includes("xml") ||
      /<(urlset|sitemapindex)\b/i.test(sitemapResult.text));

  return {
    robotsTxtChecked: true,
    robotsTxtExists: robotsExists,
    robotsTxtStatusCode: robotsResult.statusCode,
    robotsTxtHasSitemap: /^sitemap:/im.test(robotsResult.text),
    robotsTxtBlocksAll: robotsExists ? robotsBlocksAll(robotsResult.text) : false,
    sitemapXmlChecked: true,
    sitemapXmlExists: sitemapExists,
    sitemapXmlStatusCode: sitemapResult.statusCode
  };
}
