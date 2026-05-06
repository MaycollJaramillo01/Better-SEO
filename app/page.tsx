"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Blocks,
  BrainCircuit,
  ChevronDown,
  FileSearch,
  FolderSearch,
  GlobeLock,
  Heading,
  ImageUpscale,
  Link2,
  LockKeyhole,
  SearchCheck,
  Shield,
  Sparkles,
  Waypoints
} from "lucide-react";

import { AuditForm } from "@/components/audit/AuditForm";
import { AuditResults } from "@/components/audit/AuditResults";
import { Reveal } from "@/components/ui/Reveal";
import type { AuditData } from "@/lib/audit/types";
import { cn } from "@/lib/utils";

const featureStrip = [
  {
    title: "Technical SEO",
    description:
      "Response, HTTPS, headings, links and indexability — all in one focused flow.",
    icon: Activity
  },
  {
    title: "Metadata Review",
    description:
      "Title, meta description, Open Graph, Twitter Card, schema and snippet readiness.",
    icon: SearchCheck
  },
  {
    title: "Crawl Discovery",
    description:
      "robots.txt, sitemap.xml, canonical, X-Robots-Tag and access blockers.",
    icon: GlobeLock
  }
];

const checks = [
  {
    title: "Title and meta description",
    description: "Find missing, short, or overextended metadata.",
    icon: FileSearch
  },
  {
    title: "Heading structure",
    description: "Review H1, H2 and H3 hierarchy for clarity.",
    icon: Heading
  },
  {
    title: "Indexability signals",
    description: "Status, robots hints, HTTPS and canonical.",
    icon: Shield
  },
  {
    title: "Image ALT coverage",
    description: "Measure missing ALT for accessibility and SEO.",
    icon: ImageUpscale
  },
  {
    title: "Canonical URL",
    description: "Confirm or flag missing canonical guidance.",
    icon: Link2
  },
  {
    title: "Open Graph",
    description: "Review the social preview fields.",
    icon: Sparkles
  },
  {
    title: "Schema markup",
    description: "Detect JSON-LD blocks and extract types.",
    icon: Blocks
  },
  {
    title: "HTTPS and viewport",
    description: "Verify secure URLs and mobile rendering.",
    icon: LockKeyhole
  },
  {
    title: "Response time",
    description: "Measure initial HTML response speed.",
    icon: Activity
  },
  {
    title: "HTML payload size",
    description: "Flag heavy HTML documents and bloated markup.",
    icon: Blocks
  },
  {
    title: "robots.txt",
    description: "Check root robots rules and full-site blocks.",
    icon: GlobeLock
  },
  {
    title: "XML sitemap",
    description: "Detect /sitemap.xml and sitemap references.",
    icon: FileSearch
  },
  {
    title: "X-Robots-Tag",
    description: "Catch HTTP-level noindex or nofollow directives.",
    icon: Shield
  },
  {
    title: "Twitter Card",
    description: "Review metadata for Twitter/X previews.",
    icon: Sparkles
  },
  {
    title: "URL cleanliness",
    description: "Review URL length, depth, query strings and casing.",
    icon: Link2
  },
  {
    title: "Charset and hreflang",
    description: "Detect encoding and alternate language annotations.",
    icon: FileSearch
  },
  {
    title: "Image dimensions",
    description: "Flag images missing width or height attributes.",
    icon: ImageUpscale
  },
  {
    title: "Script load",
    description: "Count inline and external scripts that affect page weight.",
    icon: Blocks
  }
];

const agencyBenefits = [
  {
    title: "Generate qualified leads.",
    description: "Give prospects a useful technical snapshot before the first call.",
    icon: BadgeCheck
  },
  {
    title: "Open with data.",
    description: "Use real findings instead of generic claims about SEO.",
    icon: BrainCircuit
  },
  {
    title: "Find quick wins.",
    description: "Spot metadata, structure and indexability gaps fast.",
    icon: Waypoints
  },
  {
    title: "Sell maintenance plans.",
    description: "Turn recurring technical QA into an obvious next step.",
    icon: FolderSearch
  }
];

const processSteps = [
  { n: "01", title: "Submit a URL", body: "Domain or full page — both work." },
  { n: "02", title: "Review the snapshot", body: "Technical signals, metadata, structure." },
  { n: "03", title: "Prioritize fixes", body: "Sorted by severity and impact." },
  { n: "04", title: "Use it in discovery", body: "Open the conversation with real data." }
];

const faqs = [
  {
    question: "Is this audit really free?",
    answer:
      "Yes. The tool reviews a single URL and returns a focused technical SEO snapshot — no signup required."
  },
  {
    question: "Does it crawl the entire website?",
    answer:
      "No. This version analyzes the submitted page only. It does not crawl site architecture or multiple URLs."
  },
  {
    question: "Does it replace a professional SEO audit?",
    answer:
      "No. It identifies visible technical issues quickly. Deeper audits should review crawl paths, templates, content intent and analytics."
  },
  {
    question: "Can agencies use this for clients?",
    answer:
      "Yes. It is built for lead generation, discovery calls and early-stage technical reviews."
  }
];

/* =========================================================================
   Hero illustration — pure SVG, no external images.
   Mimics Apple's product hero: a centered "device" frame containing a
   dashboard, with subtle drop shadow.
   ========================================================================= */
function HeroVisual() {
  return (
    <Reveal className="mx-auto mt-16 max-w-[1024px] px-4">
      <div className="relative">
        <div className="absolute inset-x-10 -bottom-8 h-16 rounded-[100%] bg-black/10 blur-2xl" />
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)]">
          {/* Faux browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-[var(--border-soft)] bg-[#f5f5f7] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-4 truncate rounded-md bg-white px-3 py-1 text-[12px] text-text-muted">
              audit.example.com/report
            </span>
          </div>

          {/* Dashboard preview */}
          <div className="grid gap-6 p-8 md:grid-cols-[260px_1fr]">
            {/* Score card */}
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[#f5f5f7] p-6">
              <p className="text-[13px] font-medium text-text-muted">SEO Score</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[64px] font-semibold leading-none tracking-[-0.05em] text-text-main">
                  86
                </span>
                <span className="text-[15px] text-text-muted">/100</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full w-[86%] rounded-full bg-[var(--primary-teal)]" />
              </div>
              <p className="mt-4 text-[13px] text-text-muted">Good baseline</p>
            </div>

            {/* Right side metrics */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                { l: "Title", v: "58 chars", ok: true },
                { l: "Meta", v: "146 chars", ok: true },
                { l: "H1", v: "1", ok: true },
                { l: "ALT missing", v: "12%", ok: false },
                { l: "Schema", v: "Detected", ok: true },
                { l: "HTTPS", v: "Enabled", ok: true }
              ].map((m) => (
                <div
                  key={m.l}
                  className="rounded-xl border border-[var(--border-soft)] bg-white px-4 py-3"
                >
                  <p className="text-[12px] text-text-muted">{m.l}</p>
                  <p className="mt-1 text-[15px] font-medium text-text-main">{m.v}</p>
                  <span
                    className={cn(
                      "mt-2 inline-block h-1 w-6 rounded-full",
                      m.ok ? "bg-[var(--success)]" : "bg-[var(--accent-gold)]"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function LoadingPanel() {
  return (
    <section className="apple-section-light py-20">
      <div className="section-shell text-center">
        <p className="apple-eyebrow">Audit in progress</p>
        <h2 className="apple-headline mt-3 text-[36px] sm:text-[56px]">
          Analyzing your page&hellip;
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] text-text-muted">
          Checking response, HTML structure, metadata, accessibility and indexability signals.
        </p>
        <div className="mx-auto mt-10 h-1.5 w-72 overflow-hidden rounded-full bg-[#f5f5f7]">
          <div className="h-full w-1/2 animate-[scan-line_1.6s_ease-in-out_infinite] rounded-full bg-[var(--primary-teal)]" />
        </div>
      </div>
    </section>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <section className="apple-section-light py-20">
      <div className="section-shell text-center">
        <p className="apple-eyebrow" style={{ color: "var(--coral-dark)" }}>
          Audit unavailable
        </p>
        <h2 className="apple-headline mt-3 text-[36px] sm:text-[56px]">
          We couldn&apos;t complete the audit.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] text-text-muted">{message}</p>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [auditStatus, setAuditStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [auditError, setAuditError] = useState<string>("");
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  function handleAuditStart() {
    setAuditStatus("loading");
    setAuditError("");
    setAuditData(null);
  }

  function handleAuditSuccess(data: AuditData) {
    setAuditStatus("success");
    setAuditError("");
    setAuditData(data);
  }

  function handleAuditError(message: string) {
    setAuditStatus("error");
    setAuditError(message);
    setAuditData(null);
  }

  function handleReset() {
    setAuditStatus("idle");
    setAuditError("");
    setAuditData(null);
    setResetSignal((c) => c + 1);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("hero")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start"
    });
  }

  return (
    <>
      {/* ============================================================
          HERO — full-bleed white, massive centered headline
          ============================================================ */}
      <section
        id="hero"
        className="apple-section-light relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20"
      >
        <div className="section-shell text-center">
          <Reveal>
            <p className="apple-eyebrow">Free SEO Audit Tool</p>
          </Reveal>

          <Reveal>
            <h1 className="apple-headline mx-auto mt-3 max-w-[14ch] text-balance text-[44px] leading-[1.05] sm:text-[80px] lg:text-[96px]">
              Better SEO,
              <br />
              in a single click.
            </h1>
          </Reveal>

          <Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-[19px] leading-[1.4] text-text-muted sm:text-[24px]">
              Audit metadata, headings, links and indexability in seconds. A focused report,
              built for sales conversations.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-7 flex items-center justify-center gap-5 text-[17px]">
              <a href="#features" className="apple-link">Learn more</a>
              <span className="text-[var(--border-soft)]">·</span>
              <a href="#checks" className="apple-link">See what it checks</a>
            </div>
          </Reveal>

          <Reveal>
            <div className="mx-auto mt-10 max-w-[760px]">
              <AuditForm
                key={resetSignal}
                onAuditStart={handleAuditStart}
                onAuditSuccess={handleAuditSuccess}
                onAuditError={handleAuditError}
              />
            </div>
          </Reveal>
        </div>

        <HeroVisual />
      </section>

      {/* ============================================================
          AUDIT STATE — loading / error / success
          ============================================================ */}
      {auditStatus === "loading" ? <LoadingPanel /> : null}
      {auditStatus === "error" && auditError ? <ErrorPanel message={auditError} /> : null}
      {auditStatus === "success" && auditData ? (
        <section className="apple-section-light">
          <AuditResults data={auditData} onReset={handleReset} />
        </section>
      ) : null}

      {/* ============================================================
          FEATURES — full-bleed BLACK section
          ============================================================ */}
      <section id="features" className="apple-section-dark py-24 sm:py-32">
        <div className="section-shell text-center">
          <Reveal>
            <p className="apple-eyebrow" style={{ color: "#2997ff" }}>
              What it does
            </p>
          </Reveal>

          <Reveal>
            <h2 className="apple-headline mx-auto mt-3 max-w-[18ch] text-balance text-[40px] leading-[1.05] text-white sm:text-[72px]">
              Real findings. <br className="hidden sm:block" />
              <span className="text-[#86868b]">Faster than ever.</span>
            </h2>
          </Reveal>

          <Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-[19px] leading-[1.45] text-[#86868b] sm:text-[21px]">
              Three focused signals, designed for the way agencies start client conversations.
            </p>
          </Reveal>

          <Reveal stagger className="mx-auto mt-16 grid max-w-[1040px] gap-5 md:grid-cols-3">
            {featureStrip.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl bg-[#1d1d1f] p-8 text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-8 text-[24px] font-semibold tracking-[-0.02em] text-white">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#a1a1a6]">{description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          CHECKS — full-bleed WHITE section, grid of cards
          ============================================================ */}
      <section id="checks" className="apple-section-light py-24 sm:py-32">
        <div className="section-shell">
          <div className="text-center">
            <Reveal>
              <p className="apple-eyebrow">What it checks</p>
            </Reveal>
            <Reveal>
              <h2 className="apple-headline mx-auto mt-3 max-w-[20ch] text-balance text-[40px] leading-[1.05] sm:text-[64px]">
                Eight signals.
                <br />
                <span className="text-text-muted">One clear report.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {checks.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--border-soft)] bg-white p-7 transition-shadow duration-300 hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[var(--primary-teal)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-7 text-[19px] font-semibold tracking-[-0.02em] text-text-main">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.5] text-text-muted">{description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          AGENCIES — full-bleed BLACK
          ============================================================ */}
      <section id="agencies" className="apple-section-dark py-24 sm:py-32">
        <div className="section-shell">
          <div className="text-center">
            <Reveal>
              <p className="apple-eyebrow" style={{ color: "#2997ff" }}>
                For agencies
              </p>
            </Reveal>
            <Reveal>
              <h2 className="apple-headline mx-auto mt-3 max-w-[16ch] text-balance text-[40px] leading-[1.05] text-white sm:text-[72px]">
                Make the first SEO conversation
                <span className="text-[#86868b]"> feel specific.</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mx-auto mt-5 max-w-2xl text-[19px] leading-[1.45] text-[#86868b] sm:text-[21px]">
                A prospect sees immediate value. Your team gets structured talking points. The
                next step justifies itself.
              </p>
            </Reveal>
          </div>

          <Reveal stagger className="mt-16 grid gap-5 md:grid-cols-2">
            {agencyBenefits.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl bg-[#1d1d1f] p-8 transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon className="h-5 w-5 text-[#2997ff]" aria-hidden="true" />
                <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.02em] text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#a1a1a6]">{description}</p>
              </article>
            ))}
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <a href="#hero" className="apple-cta">
                Run a free audit
              </a>
              <a href="#checks" className="apple-link ml-6 text-[#2997ff]">
                See every check
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          WORKFLOW — light gray section, numbered steps
          ============================================================ */}
      <section id="workflow" className="apple-section-gray py-24 sm:py-32">
        <div className="section-shell">
          <div className="text-center">
            <Reveal>
              <p className="apple-eyebrow">Workflow</p>
            </Reveal>
            <Reveal>
              <h2 className="apple-headline mx-auto mt-3 max-w-[20ch] text-balance text-[40px] leading-[1.05] sm:text-[64px]">
                From URL to insight
                <br />
                <span className="text-text-muted">in four small steps.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(({ n, title, body }) => (
              <div
                key={n}
                className="rounded-2xl border border-[var(--border-soft)] bg-white p-7"
              >
                <p className="text-[14px] font-medium text-[var(--primary-teal)]">{n}</p>
                <p className="mt-6 text-[19px] font-semibold tracking-[-0.02em] text-text-main">
                  {title}
                </p>
                <p className="mt-2 text-[14px] leading-[1.5] text-text-muted">{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FAQ — white section, accordion
          ============================================================ */}
      <section id="faq" className="apple-section-light py-24 sm:py-32">
        <div className="section-shell mx-auto max-w-[820px]">
          <Reveal>
            <p className="apple-eyebrow text-center">FAQ</p>
          </Reveal>
          <Reveal>
            <h2 className="apple-headline mx-auto mt-3 max-w-[18ch] text-balance text-center text-[40px] leading-[1.05] sm:text-[64px]">
              Questions before
              <br />
              <span className="text-text-muted">running an audit.</span>
            </h2>
          </Reveal>

          <Reveal stagger className="mt-14 divide-y divide-[var(--border-soft)] border-y border-[var(--border-soft)]">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="text-left text-[19px] font-semibold tracking-[-0.02em] text-text-main">
                    {question}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-text-main transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-text-muted">
                  {answer}
                </p>
              </details>
            ))}
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <a href="#hero" className="apple-cta">
                Get your free audit
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
