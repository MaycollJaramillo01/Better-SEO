const footerColumns: Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "Product",
    links: [
      { label: "Free SEO Audit", href: "#hero" },
      { label: "Features", href: "#features" },
      { label: "Checks performed", href: "#checks" },
      { label: "FAQ", href: "#faq" }
    ]
  },
  {
    title: "For agencies",
    links: [
      { label: "Why agencies use it", href: "#agencies" },
      { label: "Lead generation", href: "#agencies" },
      { label: "Client discovery", href: "#agencies" },
      { label: "Maintenance plans", href: "#agencies" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "How it works", href: "#features" },
      { label: "Workflow", href: "#workflow" },
      { label: "Get a sample report", href: "#hero" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "mailto:hello@example.com" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" }
    ]
  }
];

/**
 * Apple-style footer: light gray surface, dense column links,
 * fine-print disclaimer at the bottom.
 */
export function Footer() {
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer
      id="contact"
      className="apple-section-gray border-t border-[var(--border-soft)]"
    >
      <div className="mx-auto w-full max-w-[1024px] px-4 py-8 text-[12px] leading-[1.5]">
        {/* Tiny disclaimer at the very top — apple.com pattern */}
        <p className="text-text-muted">
          A free single-URL technical SEO snapshot. Results are intended for discovery and lead
          generation, not as a replacement for a deep technical audit.
        </p>

        <div className="mt-6 h-px bg-[var(--border-soft)]" />

        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="font-semibold text-text-main">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-muted transition-colors hover:text-text-main hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 h-px bg-[var(--border-soft)]" />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted">
            Copyright &copy; {currentYear} SEO Audit. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 text-text-muted">
            <a href="#" className="hover:text-text-main hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-text-main hover:underline">Terms of Use</a>
            <a href="#" className="hover:text-text-main hover:underline">Cookies</a>
            <a href="#" className="hover:text-text-main hover:underline">Legal</a>
            <a href="#contact" className="hover:text-text-main hover:underline">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
