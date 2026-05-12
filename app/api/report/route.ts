import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import React from "react";

import { AuditReportDocument } from "@/lib/pdf/AuditReport";
import { AuditSuccessResponseSchema } from "@/lib/validators/auditSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = AuditSuccessResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid audit data." }, { status: 400 });
    }

    // Cast to satisfy @react-pdf types — schema validates the shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = parsed.data.data as any;

    // @react-pdf/renderer expects a React element typed to its own DocumentProps
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(AuditReportDocument as any, { data });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any);

    const slug = (data.finalUrl as string)
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    // Convert Node.js Buffer → Uint8Array for the Web Response API
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${slug}.pdf"`,
        "Content-Length": String(uint8.byteLength)
      }
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF report." },
      { status: 500 }
    );
  }
}
