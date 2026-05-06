const navItems = [
  { label: "Audit", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Checks", href: "#checks" },
  { label: "Agencies", href: "#agencies" },
  { label: "FAQ", href: "#faq" }
];

/**
 * Apple-style top navigation: full-width 44px bar with translucent
 * blurred background and tightly-spaced, evenly-distributed links.
 */
export function Header() {
  return (
    <header className="apple-nav-blur sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-11 w-full max-w-[1024px] items-center justify-between px-4 text-[12px] text-text-main">
        {/* Logo */}
        <a
          href="#hero"
          aria-label="SEO Audit home"
          className="flex h-11 items-center px-2 text-text-main hover:text-text-main/70"
        >
          <svg viewBox="0 0 22 22" className="h-4 w-4" aria-hidden="true">
            <circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M11 5.5v5.5l3.5 2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="ml-2 font-medium tracking-tight">SEO Audit</span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1 text-[12px] font-normal text-text-main/85 transition-colors hover:text-text-main"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <a
          href="#hero"
          className="rounded-full px-3 py-1 text-[12px] font-normal text-text-main/85 transition-colors hover:text-text-main"
        >
          Run audit
        </a>
      </div>
    </header>
  );
}
