"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  FileSearch,
  Flame,
  Globe2,
  LayoutTemplate,
  LineChart,
  Pencil,
  SearchCheck,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";

import { AuditForm } from "@/components/audit/AuditForm";
import { AuditResults } from "@/components/audit/AuditResults";
import { Reveal } from "@/components/ui/Reveal";
import type { AuditData } from "@/lib/audit/types";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const services = [
  {
    icon: SearchCheck,
    eyebrow: "Step 1 — Free",
    title: "SEO Audit",
    description:
      "Instant technical snapshot of your page. We scan metadata, structure, indexability, speed and more — no signup needed.",
    cta: "Run your free audit",
    href: "#audit"
  },
  {
    icon: CalendarDays,
    eyebrow: "Step 2 — Strategy call",
    title: "SEO Appointment",
    description:
      "30-minute call with our team. We walk through your audit findings, answer your questions and outline a clear action plan.",
    cta: "Book a free call",
    href: "#contact"
  },
  {
    icon: Pencil,
    eyebrow: "Step 3 — Growth",
    title: "Content Strategy",
    description:
      "We develop a keyword-driven content plan tailored to your audience, industry and business goals — then help you execute it.",
    cta: "Start growing",
    href: "#contact"
  }
];

const results = [
  { icon: TrendingUp, stat: "3×", label: "Average traffic increase within 6 months" },
  { icon: Users,     stat: "68%", label: "Of new clients come from organic search after 90 days" },
  { icon: Flame,     stat: "40+", label: "Businesses improved their Google ranking with us" },
  { icon: LineChart, stat: "2×",  label: "More leads for clients who implement our content plan" }
];

const whyUs = [
  {
    icon: BadgeCheck,
    title: "Data-first approach.",
    description:
      "Every recommendation we make is grounded in real audit data from your site — not generic SEO checklists."
  },
  {
    icon: BrainCircuit,
    title: "Strategy, not just reports.",
    description:
      "The audit is the start. We help you understand what to fix, in what order, and why it moves the needle."
  },
  {
    icon: LayoutTemplate,
    title: "Content that converts.",
    description:
      "We build content strategies around the exact queries your customers are typing — turning traffic into clients."
  },
  {
    icon: Globe2,
    title: "Built for growth.",
    description:
      "Whether you're a local business or scaling nationally, we adapt the strategy to your market and budget."
  }
];

const faqs = [
  {
    question: "Is the SEO audit really free?",
    answer:
      "Yes — completely free, no card or signup required. Run as many audits as you need. The audit is our way of showing you exactly where your site stands before we talk."
  },
  {
    question: "What happens on the strategy call?",
    answer:
      "We spend 30 minutes reviewing your audit results together, explaining what they mean in plain language, and mapping out the highest-impact fixes for your specific business."
  },
  {
    question: "What does a content strategy include?",
    answer:
      "Keyword research targeted to your audience, a topic and publishing calendar, on-page optimization guidelines, and monthly performance reviews to track what's working."
  },
  {
    question: "How long before I see results?",
    answer:
      "Technical fixes often improve rankings within 4–8 weeks. Content strategies typically show meaningful traffic growth within 3–6 months depending on competition and publishing pace."
  },
  {
    question: "Do you work with small businesses?",
    answer:
      "Yes. Most of our clients are small and mid-size businesses that want to compete online without a large in-house marketing team. We keep our process lean and focused on ROI."
  }
];

const processSteps = [
  { n: "01", title: "Run the free audit", body: "Enter your URL. Get a full technical SEO snapshot in seconds." },
  { n: "02", title: "Review the findings", body: "See exactly what's blocking your site from ranking higher." },
  { n: "03", title: "Book a strategy call", body: "We walk through the results and build your action plan." },
  { n: "04", title: "Grow your traffic", body: "Execute the content strategy and watch rankings climb." }
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */

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

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [auditStatus, setAuditStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [auditError, setAuditError]   = useState<string>("");
  const [auditData,  setAuditData]    = useState<AuditData | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const auditStateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auditStatus === "idle") return;
    const el = auditStateRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }, [auditStatus]);

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
    document.getElementById("audit")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="apple-section-light relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20"
      >
        <div className="section-shell text-center">
          <Reveal>
            <p className="apple-eyebrow">SEO · Content Strategy · Growth</p>
          </Reveal>

          <Reveal>
            <h1 className="apple-headline mx-auto mt-3 max-w-[16ch] text-balance text-[44px] leading-[1.05] sm:text-[80px] lg:text-[96px]">
              Your website should
              <br />
              <span className="text-[var(--primary-teal)]">work harder</span>{" "}
              for you.
            </h1>
          </Reveal>

          <Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-[19px] leading-[1.4] text-text-muted sm:text-[22px]">
              Start with a free SEO audit. Then let&apos;s build a strategy that brings
              more customers to your door — without paid ads.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#audit" className="apple-cta">
                Get your free audit
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" className="apple-link text-[17px]">
                Book a strategy call
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RESULTS STRIP ────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border-soft)] bg-[#f5f5f7] py-10">
        <div className="section-shell">
          <Reveal stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {results.map(({ icon: Icon, stat, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--primary-teal)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-main">
                    {stat}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.4] text-text-muted">{label}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── AUDIT TOOL ───────────────────────────────────────────────────── */}
      <section id="audit" className="apple-section-light py-20 sm:py-28">
        <div className="section-shell text-center">
          <Reveal>
            <p className="apple-eyebrow">Free SEO Audit</p>
          </Reveal>
          <Reveal>
            <h2 className="apple-headline mx-auto mt-3 max-w-[18ch] text-balance text-[36px] leading-[1.05] sm:text-[64px]">
              See exactly where
              <br />
              <span className="text-text-muted">your site stands.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-[1.5] text-text-muted">
              Enter your URL below. We&apos;ll scan 40+ SEO signals and give you a full
              technical report — free, in seconds.
            </p>
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
      </section>

      {/* ── AUDIT STATE: loading / error / results ────────────────────────── */}
      <div ref={auditStateRef} style={{ scrollMarginTop: "60px" }}>
        {auditStatus === "loading" ? <LoadingPanel /> : null}
        {auditStatus === "error" && auditError ? <ErrorPanel message={auditError} /> : null}
        {auditStatus === "success" && auditData ? (
          <section className="apple-section-light">
            <AuditResults data={auditData} onReset={handleReset} />
          </section>
        ) : null}
      </div>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="apple-section-dark py-24 sm:py-32">
        <div className="section-shell text-center">
          <Reveal>
            <p className="apple-eyebrow" style={{ color: "#2997ff" }}>What we offer</p>
          </Reveal>
          <Reveal>
            <h2 className="apple-headline mx-auto mt-3 max-w-[18ch] text-balance text-[40px] leading-[1.05] text-white sm:text-[72px]">
              From audit to growth.{" "}
              <span className="text-[#86868b]">Every step covered.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-[19px] leading-[1.45] text-[#86868b] sm:text-[21px]">
              We don&apos;t just hand you a report. We help you understand it, prioritize
              fixes and build the content engine that drives lasting growth.
            </p>
          </Reveal>

          <Reveal stagger className="mx-auto mt-16 grid max-w-[1040px] gap-5 md:grid-cols-3">
            {services.map(({ icon: Icon, eyebrow, title, description, cta, href }) => (
              <article
                key={title}
                className="flex flex-col rounded-2xl bg-[#1d1d1f] p-8 text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#2997ff]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2997ff]">
                  {eyebrow}
                </p>
                <h3 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-white">
                  {title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-[#a1a1a6]">
                  {description}
                </p>
                <a
                  href={href}
                  className="mt-8 flex items-center gap-1 text-[15px] font-medium text-[#2997ff] transition-opacity hover:opacity-80"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section id="why" className="apple-section-light py-24 sm:py-32">
        <div className="section-shell">
          <div className="text-center">
            <Reveal>
              <p className="apple-eyebrow">Why choose us</p>
            </Reveal>
            <Reveal>
              <h2 className="apple-headline mx-auto mt-3 max-w-[20ch] text-balance text-[40px] leading-[1.05] sm:text-[64px]">
                Real strategy.
                <br />
                <span className="text-text-muted">Measurable results.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal stagger className="mt-16 grid gap-5 sm:grid-cols-2">
            {whyUs.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="flex gap-5 rounded-2xl border border-[var(--border-soft)] bg-white p-8 transition-shadow duration-300 hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[var(--primary-teal)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-text-main">
                    {title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-text-muted">{description}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" className="bg-[#f5f5f7] py-24 sm:py-32">
        <div className="section-shell">
          <div className="text-center">
            <Reveal>
              <p className="apple-eyebrow">How it works</p>
            </Reveal>
            <Reveal>
              <h2 className="apple-headline mx-auto mt-3 max-w-[20ch] text-balance text-[40px] leading-[1.05] sm:text-[64px]">
                Audit to results
                <br />
                <span className="text-text-muted">in four steps.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(({ n, title, body }) => (
              <div
                key={n}
                className="rounded-2xl border border-[var(--border-soft)] bg-white p-7"
              >
                <p className="text-[14px] font-semibold text-[var(--primary-teal)]">{n}</p>
                <p className="mt-6 text-[19px] font-semibold tracking-[-0.02em] text-text-main">
                  {title}
                </p>
                <p className="mt-2 text-[14px] leading-[1.5] text-text-muted">{body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <div className="mt-14 text-center">
              <a href="#audit" className="apple-cta">
                Start with a free audit
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT / BOOKING ────────────────────────────────────────────── */}
      <section id="contact" className="apple-section-dark py-24 sm:py-32">
        <div className="section-shell">
          <div className="mx-auto max-w-[900px]">
            <div className="text-center">
              <Reveal>
                <p className="apple-eyebrow" style={{ color: "#2997ff" }}>Book a free call</p>
              </Reveal>
              <Reveal>
                <h2 className="apple-headline mx-auto mt-3 max-w-[18ch] text-balance text-[40px] leading-[1.05] text-white sm:text-[64px]">
                  Let&apos;s talk about
                  <br />
                  <span className="text-[#86868b]">your growth.</span>
                </h2>
              </Reveal>
              <Reveal>
                <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.5] text-[#86868b]">
                  30 minutes. No pressure. We review your audit results together and map
                  out a plan that fits your business and budget.
                </p>
              </Reveal>
            </div>

            <Reveal>
              <form
                className="mt-12 rounded-2xl bg-[#1d1d1f] p-8 sm:p-10"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#a1a1a6]" htmlFor="contact-name">
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Jane Smith"
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-[#555] outline-none transition focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#a1a1a6]" htmlFor="contact-email">
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="jane@company.com"
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-[#555] outline-none transition focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[13px] font-medium text-[#a1a1a6]" htmlFor="contact-url">
                      Website URL
                    </label>
                    <input
                      id="contact-url"
                      type="text"
                      placeholder="https://yourwebsite.com"
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-[#555] outline-none transition focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[13px] font-medium text-[#a1a1a6]" htmlFor="contact-message">
                      What&apos;s your biggest SEO challenge?
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Tell us a bit about your goals or what you'd like help with..."
                      className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-[#555] outline-none transition focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]"
                    />
                  </div>
                </div>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <p className="text-[13px] text-[#555]">
                    Free 30-min call · No commitment · Response within 24h
                  </p>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full bg-[#2997ff] px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0077ed] active:scale-[0.98]"
                  >
                    Request a strategy call
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="apple-section-light py-24 sm:py-32">
        <div className="section-shell mx-auto max-w-[820px]">
          <Reveal>
            <p className="apple-eyebrow text-center">FAQ</p>
          </Reveal>
          <Reveal>
            <h2 className="apple-headline mx-auto mt-3 max-w-[18ch] text-balance text-center text-[40px] leading-[1.05] sm:text-[64px]">
              Common questions
              <br />
              <span className="text-text-muted">before we talk.</span>
            </h2>
          </Reveal>

          <Reveal
            stagger
            className="mt-14 divide-y divide-[var(--border-soft)] border-y border-[var(--border-soft)]"
          >
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
              <a href="#contact" className="apple-cta">
                Book your free strategy call
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </a>
              <p className="mt-4 text-[13px] text-text-muted">
                Or{" "}
                <a href="#audit" className="apple-link">
                  run a free audit first
                </a>{" "}
                — no signup required.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA BAR ────────────────────────────────────────────────── */}
      <section className="apple-section-dark py-16">
        <div className="section-shell flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-[22px] font-semibold text-white sm:text-[28px]">
              Ready to rank higher?
            </p>
            <p className="mt-1 text-[15px] text-[#86868b]">
              Start free. Scale when you&apos;re ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#audit" className="apple-cta">
              Free SEO audit
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/20 px-7 py-3 text-[15px] font-medium text-white transition hover:bg-white/10"
            >
              Book a call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
