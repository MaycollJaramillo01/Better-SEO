/**
 * Fetches Open PageRank data for a given domain.
 * API docs: https://www.domcop.com/openpagerank/documentation
 * Free tier: 100 requests/day — no account required if key provided.
 * Set OPR_API_KEY in environment variables to enable.
 */

interface OprResponse {
  status_code: number;
  response: Array<{
    status_code: number;
    error?: string;
    page_rank_integer: number;
    page_rank_decimal: number;
    domain: string;
  }>;
}

export interface OpenPageRankResult {
  openPageRank: number | null;
  fetched: boolean;
}

function extractRootDomain(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove leading "www."
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function fetchOpenPageRank(finalUrl: string): Promise<OpenPageRankResult> {
  const apiKey = process.env.OPR_API_KEY;

  if (!apiKey) {
    return { openPageRank: null, fetched: false };
  }

  const domain = extractRootDomain(finalUrl);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://openpagerank.com/api/v1.0/getPageRank?domains[]=${encodeURIComponent(domain)}`,
      {
        headers: {
          API_OPR: apiKey
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      return { openPageRank: null, fetched: true };
    }

    const data: OprResponse = await response.json();
    const entry = data?.response?.[0];

    if (!entry || entry.status_code !== 200) {
      return { openPageRank: null, fetched: true };
    }

    return {
      openPageRank: entry.page_rank_integer ?? null,
      fetched: true
    };
  } catch {
    return { openPageRank: null, fetched: true };
  }
}
