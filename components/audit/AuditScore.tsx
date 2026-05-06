"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Badge } from "@/components/ui/Badge";

type AuditScoreProps = {
  score: number;
  grade: "Poor" | "Needs Work" | "Good" | "Excellent";
  indexability: string;
};

const gradeColor = {
  Excellent: "var(--success)",
  Good: "var(--primary-teal)",
  "Needs Work": "var(--accent-gold)",
  Poor: "var(--error)"
} as const;

/* ─── Bilingual heart content ─────────────────────────────────────── */

type HeartEntry = {
  headline: string;
  pain: string;
  opportunity: string;
};

type HeartMap = Record<AuditScoreProps["grade"], HeartEntry>;

const heartContent: Record<"en" | "es", HeartMap> = {
  en: {
    Poor: {
      headline: "Your site is practically invisible to customers right now.",
      pain: "When someone searches Google for what you sell, your competitors show up — you don't. Those are real people, ready to spend money, who never even know you exist. Every day this doesn't change, they're choosing someone else.",
      opportunity: "The good news: sites at this level have the most room to grow. Fixing even the most critical issues could dramatically change how many customers find you — often faster than you'd expect."
    },
    "Needs Work": {
      headline: "You're showing up — but your competitors are winning the click.",
      pain: "You're visible on Google, but rivals who've done a bit more work are getting the calls that should be yours. It's not a massive gap — but it's costing you real customers every single week.",
      opportunity: "You don't need a complete overhaul. A handful of targeted fixes could move you ahead of most competitors in your space. The opportunity is right there, waiting."
    },
    Good: {
      headline: "You're doing well — but there's money still left on the table.",
      pain: "Your site performs solidly, but a few gaps mean some customers find a competitor before they find you. In competitive markets, 'almost excellent' still costs real sales every month.",
      opportunity: "You're close to the top. The right improvements could make you the obvious first choice in your category — not just one of the options."
    },
    Excellent: {
      headline: "Your site is in excellent shape — keep it that way.",
      pain: "You've done the hard work, and it shows. But staying here isn't automatic. Search engines keep changing, and your competitors are always trying to catch up.",
      opportunity: "The goal now is to protect what you've built and get ahead of those changes before they affect your rankings — not react to them after the fact."
    }
  },
  es: {
    Poor: {
      headline: "Tu sitio es prácticamente invisible para tus clientes ahora mismo.",
      pain: "Cuando alguien busca en Google lo que tú vendes, aparecen tus competidores — tú no. Son personas reales, listas para gastar dinero, que ni siquiera saben que existes. Cada día que esto no cambia, eligen a otro.",
      opportunity: "La buena noticia: los sitios en este nivel son los que más pueden mejorar. Corregir incluso los problemas más críticos podría cambiar radicalmente cuántos clientes te encuentran — muchas veces más rápido de lo que esperas."
    },
    "Needs Work": {
      headline: "Apareces — pero tus competidores se están llevando el clic.",
      pain: "Estás visible en Google, pero competidores que han hecho un poco más de trabajo están recibiendo las llamadas que deberían ser tuyas. No es una diferencia enorme — pero te está costando clientes reales todas las semanas.",
      opportunity: "No necesitas una revisión completa. Unos pocos ajustes específicos podrían ponerte por delante de la mayoría de tus competidores. La oportunidad está justo ahí, esperando."
    },
    Good: {
      headline: "Lo estás haciendo bien — pero todavía hay dinero que te estás perdiendo.",
      pain: "Tu sitio funciona bien en general, pero algunas brechas hacen que ciertos clientes encuentren a un competidor antes que a ti. En mercados competitivos, 'casi perfecto' sigue costando ventas reales cada mes.",
      opportunity: "Estás cerca de la cima. Las mejoras correctas podrían hacerte la primera opción obvia en tu categoría — no solo una más entre las opciones."
    },
    Excellent: {
      headline: "Tu sitio está en excelente forma — mantenerlo así es la clave.",
      pain: "Has hecho el trabajo difícil, y se nota. Pero mantenerse aquí no es automático. Los motores de búsqueda siguen cambiando, y tus competidores siempre están intentando alcanzarte.",
      opportunity: "El objetivo ahora es proteger lo que has construido y anticiparte a esos cambios antes de que afecten tu posicionamiento — no reaccionar cuando ya es tarde."
    }
  }
};

const labels = {
  en: {
    eyebrow: "What this means for your business",
    cta: "Get a professional review →",
    scoreLabel: "out of 100"
  },
  es: {
    eyebrow: "Lo que esto significa para tu negocio",
    cta: "Obtener una revisión profesional →",
    scoreLabel: "de 100"
  }
};

/* ─── Component ───────────────────────────────────────────────────── */

export function AuditScore({ score, grade, indexability }: AuditScoreProps) {
  const lang = useLanguage();
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = gradeColor[grade];
  const heart = heartContent[lang][grade];
  const l = labels[lang];

  return (
    <section className="premium-panel relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-x-8 top-0 h-36 rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.18),transparent_70%)] blur-3xl" />
      <div className="absolute inset-x-[16%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
              SEO Score
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-text-main sm:text-4xl">
              {grade} baseline
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            <Badge
              variant={
                grade === "Excellent"
                  ? "success"
                  : grade === "Good"
                    ? "info"
                    : grade === "Needs Work"
                      ? "warning"
                      : "error"
              }
              className="px-4 py-1.5"
            >
              {grade}
            </Badge>
            <Badge variant="neutral" className="px-4 py-1.5">
              {indexability}
            </Badge>
          </div>
        </div>

        {/* Score circle */}
        <div className="mt-8 flex justify-center">
          <div className="relative h-64 w-64 max-w-full">
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(232,246,245,0.76))] blur-md" />
            <svg
              viewBox="0 0 220 220"
              className="relative h-full w-full -rotate-90"
              role="img"
              aria-label={`SEO score ${score} out of 100`}
            >
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="rgba(var(--border-rgb),0.82)"
                strokeWidth="14"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 680ms ease-out" }}
              />
            </svg>
            <div className="absolute inset-[28px] flex flex-col items-center justify-center rounded-full border border-white/70 bg-white/62 backdrop-blur-sm">
              <span className="text-6xl font-semibold tracking-[-0.05em] text-text-main">
                {score}
              </span>
              <span className="mt-2 text-sm font-medium text-text-muted">{l.scoreLabel}</span>
            </div>
          </div>
        </div>

        {/* Heart message */}
        <div className="mt-7 overflow-hidden rounded-[24px] border border-border-soft/70 bg-gradient-to-b from-white/90 to-white/60 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
            {l.eyebrow}
          </p>
          <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-text-main">
            {heart.headline}
          </h3>
          <p className="mt-3 text-[13px] leading-[1.75] text-text-muted">
            {heart.pain}
          </p>
          <div
            className="mt-4 rounded-[18px] border px-5 py-4"
            style={{
              background: "rgba(var(--primary-rgb), 0.05)",
              borderColor: "rgba(var(--primary-rgb), 0.16)"
            }}
          >
            <p className="text-[13px] font-medium leading-[1.65] text-primary-dark">
              {heart.opportunity}
            </p>
          </div>
          <a
            href="#contact"
            className="mt-5 inline-block text-[13px] font-semibold text-primary-dark underline-offset-2 hover:underline"
          >
            {l.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
