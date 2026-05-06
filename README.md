# Free SEO Audit Tool

Free SEO Audit Tool is a Next.js MVP for agencies that want to offer a public technical SEO audit as a lead magnet. Visitors can submit a domain or URL, receive a structured report, and use the findings to start higher-quality SEO conversations.

## Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Next.js API Route Handlers
- Native server-side `fetch`
- Cheerio
- Zod
- Lucide React

## Installation

```bash
npm install
```

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Structure

```text
free-seo-audit-tool/
|-- app/
|   |-- api/
|   |   `-- audit/
|   |       `-- route.ts
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- audit/
|   |   |-- AuditForm.tsx
|   |   |-- AuditResults.tsx
|   |   |-- AuditScore.tsx
|   |   |-- IssueCard.tsx
|   |   |-- MetricCard.tsx
|   |   |-- RecommendationCard.tsx
|   |   `-- SeoPreview.tsx
|   |-- layout/
|   |   |-- Footer.tsx
|   |   `-- Header.tsx
|   `-- ui/
|       |-- Badge.tsx
|       |-- Button.tsx
|       |-- Card.tsx
|       `-- Input.tsx
|-- lib/
|   |-- audit/
|   |   |-- analyzeSeo.ts
|   |   |-- calculateScore.ts
|   |   |-- extractMetadata.ts
|   |   |-- fetchWebsite.ts
|   |   |-- normalizeUrl.ts
|   |   `-- types.ts
|   |-- utils.ts
|   `-- validators/
|       `-- auditSchema.ts
|-- public/
|   `-- favicon.svg
|-- eslint.config.mjs
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
|-- tsconfig.json
`-- README.md
```

## What it analyzes

- Title tag existence and length
- Meta description existence and length
- H1 count
- H2 and H3 counts
- First eight major headings
- Canonical tag
- Robots meta directives
- Open Graph fields
- Image ALT coverage
- Internal and external link counts
- Empty links and anchors without readable text
- HTTPS usage
- Favicon detection
- HTML `lang` attribute
- Mobile viewport tag
- JSON-LD schema presence and detected types
- Approximate word count
- Basic indexability status
- Final HTTP status code

## MVP limitations

- It does not crawl the full website
- It does not measure real Core Web Vitals
- It does not connect to Google Search Console
- It does not store leads
- It does not export PDF yet

## Next improvements

- Save leads in Supabase
- Send the report by email
- Export PDF
- Crawl up to 50 URLs
- Integrate with Google Search Console
- Add an agency dashboard
- Add white-label client reporting
