import { lookup } from "node:dns/promises";
import net from "node:net";

import { AuditError, type FetchWebsiteResult } from "@/lib/audit/types";

const REQUEST_TIMEOUT_MS = 12_000;
const BLOCKED_HOSTNAMES = new Set(["localhost"]);

function isBlockedIpv4(address: string) {
  const octets = address.split(".").map(Number);

  if (octets.length !== 4 || octets.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [first, second] = octets;

  return (
    address === "0.0.0.0" ||
    address === "127.0.0.1" ||
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function isBlockedIpv6(address: string) {
  const normalized = address.toLowerCase();
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

function isBlockedIp(address: string) {
  const ipVersion = net.isIP(address);

  if (ipVersion === 4) {
    return isBlockedIpv4(address);
  }

  if (ipVersion === 6) {
    return isBlockedIpv6(address);
  }

  return false;
}

export async function assertSafeUrl(targetUrl: string) {
  const parsed = new URL(targetUrl);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new AuditError(
      "BLOCKED_URL",
      "This URL cannot be analyzed for security reasons.",
      400
    );
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new AuditError(
      "BLOCKED_URL",
      "This URL cannot be analyzed for security reasons.",
      400
    );
  }

  if (isBlockedIp(hostname)) {
    throw new AuditError(
      "BLOCKED_URL",
      "This URL cannot be analyzed for security reasons.",
      400
    );
  }

  try {
    const addresses = await lookup(hostname, { all: true, verbatim: true });

    if (addresses.some((entry) => isBlockedIp(entry.address))) {
      throw new AuditError(
        "BLOCKED_URL",
        "This URL cannot be analyzed for security reasons.",
        400
      );
    }
  } catch (error) {
    if (error instanceof AuditError) {
      throw error;
    }
  }
}

export async function fetchWebsite(url: string): Promise<FetchWebsiteResult> {
  await assertSafeUrl(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; FreeSEOAuditBot/2.0)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "accept-encoding": "gzip, deflate, br"
      }
    });

    const responseTimeMs = Date.now() - startTime;
    const finalUrl = response.url || url;

    await assertSafeUrl(finalUrl);

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("text/html")) {
      throw new AuditError("HTML_NOT_FOUND", "The URL did not return an HTML document.", 422);
    }

    const html = await response.text();

    if (!html.trim()) {
      throw new AuditError("HTML_NOT_FOUND", "The website returned an empty HTML document.", 422);
    }

    const pageSizeBytes = Buffer.byteLength(html, "utf8");
    const isRedirected = response.redirected;
    const xRobotsTag = response.headers.get("x-robots-tag") ?? "";
    const hasHstsHeader = Boolean(response.headers.get("strict-transport-security"));
    const hasXContentTypeOptions = Boolean(response.headers.get("x-content-type-options"));
    const hasXFrameOptions = Boolean(response.headers.get("x-frame-options"));

    return {
      html,
      finalUrl,
      statusCode: response.status,
      contentType,
      responseTimeMs,
      pageSizeBytes,
      isRedirected,
      xRobotsTag,
      hasHstsHeader,
      hasXContentTypeOptions,
      hasXFrameOptions
    };
  } catch (error) {
    if (error instanceof AuditError) {
      throw error;
    }

    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.message.toLowerCase().includes("abort"))
    ) {
      throw new AuditError("TIMEOUT", "The website took too long to respond.", 504);
    }

    throw new AuditError("FETCH_FAILED", "The website could not be reached.", 502);
  } finally {
    clearTimeout(timeout);
  }
}
