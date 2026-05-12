import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { analyzeSeo } from "@/lib/audit/analyzeSeo";
import { discoverSiteFiles } from "@/lib/audit/discoverSiteFiles";
import { fetchOpenPageRank } from "@/lib/audit/fetchBacklinkData";
import { fetchWebsite } from "@/lib/audit/fetchWebsite";
import { normalizeUrl } from "@/lib/audit/normalizeUrl";
import { AuditError } from "@/lib/audit/types";
import {
  AuditRequestSchema,
  AuditSuccessResponseSchema
} from "@/lib/validators/auditSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = (await request.json()) as unknown;
    const payload = AuditRequestSchema.parse(rawBody);
    const normalizedUrl = normalizeUrl(payload.url);
    const {
      html,
      finalUrl,
      statusCode,
      contentType,
      responseTimeMs,
      pageSizeBytes,
      isRedirected,
      xRobotsTag,
      hasHstsHeader,
      hasXContentTypeOptions,
      hasXFrameOptions
    } = await fetchWebsite(normalizedUrl);
    const discovery = await discoverSiteFiles(finalUrl);

    const data = analyzeSeo(html, normalizedUrl, finalUrl, statusCode, {
      contentType,
      responseTimeMs,
      pageSizeBytes,
      isRedirected,
      xRobotsTag,
      discovery,
      hasHstsHeader,
      hasXContentTypeOptions,
      hasXFrameOptions
    });

    // Fetch Open PageRank in parallel — never blocks or throws
    const oprResult = await fetchOpenPageRank(finalUrl);
    data.summary.openPageRank = oprResult.openPageRank;
    data.summary.openPageRankFetched = oprResult.fetched;

    const response = AuditSuccessResponseSchema.parse({
      success: true,
      data
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "Please check the submitted data.";

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message
          }
        },
        { status: 400 }
      );
    }

    if (error instanceof AuditError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong while analyzing the website."
        }
      },
      { status: 500 }
    );
  }
}
