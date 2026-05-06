import { AuditError } from "@/lib/audit/types";

const protocolPattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

export function normalizeUrl(input: string) {
  const sanitized = input.replace(/\s+/g, "").trim();

  if (!sanitized) {
    throw new AuditError("INVALID_URL", "Please enter a website URL.", 400);
  }

  const withProtocol = protocolPattern.test(sanitized)
    ? sanitized
    : `https://${sanitized}`;

  let parsed: URL;

  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new AuditError("INVALID_URL", "Please enter a valid domain or URL.", 400);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new AuditError(
      "BLOCKED_URL",
      "This URL cannot be analyzed for security reasons.",
      400
    );
  }

  parsed.hostname = parsed.hostname.toLowerCase();

  if (
    (parsed.protocol === "https:" && parsed.port === "443") ||
    (parsed.protocol === "http:" && parsed.port === "80")
  ) {
    parsed.port = "";
  }

  return parsed.toString();
}
