"use client";

import { useState } from "react";
import { Globe2, Mail } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AuditData } from "@/lib/audit/types";
import {
  AuditRequestSchema,
  AuditResponseSchema,
  type AuditRequestInput
} from "@/lib/validators/auditSchema";

type FormStatus = "idle" | "loading" | "success" | "error";

type AuditFormProps = {
  onAuditStart: () => void;
  onAuditSuccess: (data: AuditData) => void;
  onAuditError: (message: string) => void;
};

function mapApiError(code?: string, fallback?: string) {
  switch (code) {
    case "INVALID_URL":
      return "Please enter a valid domain or URL.";
    case "BLOCKED_URL":
      return "This URL cannot be analyzed for security reasons.";
    case "TIMEOUT":
      return "The website took too long to respond.";
    case "FETCH_FAILED":
      return "We could not reach this website. Check the URL and try again.";
    case "HTML_NOT_FOUND":
      return "We could not analyze this page because it did not return HTML.";
    default:
      return fallback || "Something went wrong while analyzing the website.";
  }
}

/**
 * Apple-style audit form. Single horizontal row centred under the hero
 * headline — search-bar feel + filled Apple Blue CTA.
 */
export function AuditForm({
  onAuditStart,
  onAuditSuccess,
  onAuditError
}: AuditFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [values, setValues] = useState<AuditRequestInput>({
    url: "",
    email: undefined
  });
  const [fieldErrors, setFieldErrors] = useState<{ url?: string; email?: string }>({});

  const isLoading = status === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = AuditRequestSchema.safeParse(values);

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const nextFieldErrors = {
        url: flattened.url?.[0],
        email: flattened.email?.[0]
      };
      setFieldErrors(nextFieldErrors);
      setFormError(nextFieldErrors.url ?? nextFieldErrors.email ?? null);
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setStatus("loading");
    onAuditStart();

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: parsed.data.url, email: parsed.data.email })
      });

      const payload = await response.json();
      const parsedResponse = AuditResponseSchema.safeParse(payload);

      if (!parsedResponse.success) throw new Error("Invalid API response.");

      if (!parsedResponse.data.success) {
        const message = mapApiError(
          parsedResponse.data.error.code,
          parsedResponse.data.error.message
        );
        throw new Error(message);
      }

      setStatus("success");
      onAuditSuccess(parsedResponse.data.data);
    } catch (error) {
      const message =
        error instanceof Error
          ? mapApiError(undefined, error.message)
          : "Something went wrong while analyzing the website.";

      setStatus("error");
      setFormError(message);
      onAuditError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="mx-auto flex w-full max-w-[680px] flex-col items-stretch gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            name="url"
            type="text"
            label="Website URL"
            hideLabel
            placeholder="Enter your website URL"
            value={values.url}
            onChange={(e) => setValues((c) => ({ ...c, url: e.target.value }))}
            error={fieldErrors.url}
            autoComplete="url"
            icon={Globe2}
          />
        </div>
        <Button type="submit" size="lg" loading={isLoading} className="sm:w-auto">
          Run Free Audit
        </Button>
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-[680px] items-start gap-3">
        <Mail className="mt-3 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
        <Input
          name="email"
          type="email"
          label="Email (optional)"
          hideLabel
          placeholder="Email (optional) — get a copy of the report"
          value={values.email ?? ""}
          onChange={(e) =>
            setValues((c) => ({ ...c, email: e.target.value || undefined }))
          }
          error={fieldErrors.email}
          autoComplete="email"
        />
      </div>

      <p className="mt-4 text-center text-[13px] text-text-muted">
        No signup required. Domains without protocol use HTTPS automatically.
      </p>

      <div aria-live="polite" className="mt-3 min-h-[1.25rem] text-center">
        {formError ? (
          <p className="text-[13px] text-[var(--coral-dark)]">{formError}</p>
        ) : null}
      </div>
    </form>
  );
}
