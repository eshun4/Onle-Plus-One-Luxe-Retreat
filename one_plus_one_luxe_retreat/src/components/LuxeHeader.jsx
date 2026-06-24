import { useMemo, useState } from "react";
import settings from "../settings/settings";
import "./LuxeHeader.css";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 16l4.2 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="8"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5.5 19c1.1-3.1 4-4.8 6.5-4.8S17.4 15.9 18.5 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const navLinks = [
  { label: "Stays", href: "#home" },
  { label: "Suites", href: "#suites" },
  { label: "Experiences", href: "#experiences" },
  { label: "Gallery", href: "#gallery" },
  { label: "Dining", href: "#dining" },
  { label: "Contact", href: "#contact" },
];

const quickLinks = [
  { label: "Our Suites", href: "#suites" },
  { label: "Resort Amenities", href: "#amenities" },
  { label: "Private Events", href: "#events" },
  { label: "Location", href: "#location" },
];

export default function LuxeHeader({
  logo,
  logoSrc,
  logoAlt = "One Plus One Luxe Resort",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, screens } = settings;

  const cssVars = useMemo(
    () => ({
      "--luxe-black": theme.colors.black,
      "--luxe-surface": theme.colors.surface,
      "--luxe-surface-2": theme.colors.surface2,
      "--luxe-copper": theme.colors.copper,
      "--luxe-copper-light": theme.colors.copperLight,
      "--luxe-sand": theme.colors.sand,
      "--luxe-cream": theme.colors.cream,
      "--luxe-muted": theme.colors.muted,

      "--luxe-font-display": theme.typography.fontFamily.display,
      "--luxe-font-body": theme.typography.fontFamily.body,

      "--luxe-text-xs": theme.typography.fontSizes.xs,
      "--luxe-text-sm": theme.typography.fontSizes.sm,
      "--luxe-text-base": theme.typography.fontSizes.base,
      "--luxe-text-lg": theme.typography.fontSizes.lg,

      "--luxe-letter-tight": theme.typography.letterSpacing.tight,
      "--luxe-letter-normal": theme.typography.letterSpacing.normal,
      "--luxe-letter-wide": theme.typography.letterSpacing.wide,

      "--luxe-line-tight": theme.typography.lineHeights.tight,
      "--luxe-line-normal": theme.typography.lineHeights.normal,

      "--luxe-rule": theme.borders.rule,
      "--luxe-rule-light": theme.borders.ruleLight,

      "--luxe-transition": theme.transitions.default,
      "--luxe-transition-slow": theme.transitions.slow,

      "--luxe-nav-height-sm": screens.elements.small.navHeight,
      "--luxe-nav-height-md": screens.elements.medium.navHeight,
      "--luxe-nav-height-lg": screens.elements.large.navHeight,
    }),
    [theme, screens],
  );

  return (
    <header className="luxe-header" style={cssVars}>
      <div className="luxe-header__banner">
        <div className="luxe-header__container luxe-header__banner-inner">
          <p className="luxe-header__banner-copy">
            Direct booking perks available now{" "}
            <a href="#booking">Explore More</a>
          </p>

          <div className="luxe-header__quick-links">
            {quickLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="luxe-header__nav-shell">
        <div className="luxe-header__nav-bar">
          <div className="luxe-header__container luxe-header__nav-inner">
            <a className="luxe-header__brand" href="#home" aria-label={logoAlt}>
              <span className="luxe-header__brand-mark">
                {logo ? (
                  logo
                ) : logoSrc ? (
                  <img src={logoSrc} alt={logoAlt} />
                ) : null}
              </span>

              <span className="luxe-header__brand-name">
                One Plus One Luxe Resort
              </span>
            </a>

            <nav
              className="luxe-header__nav-links"
              aria-label="Primary navigation"
            >
              <ul className="luxe-header__nav-list">
                {navLinks.map((link) => (
                  <li key={link.label} className="luxe-header__nav-item">
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="luxe-header__actions">
              <button className="luxe-header__search-desktop" type="button">
                <span>Search</span>
                <SearchIcon />
              </button>

              <button
                className="luxe-header__icon-button luxe-header__icon-desktop"
                type="button"
                aria-label="Account"
              >
                <UserIcon />
              </button>

              <button
                className="luxe-header__icon-button luxe-header__menu-toggle"
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="luxe-header__search-row">
          <div className="luxe-header__container">
            <button className="luxe-header__search-mobile" type="button">
              <span>Search</span>
              <SearchIcon />
            </button>
          </div>
        </div>

        <div
          className={`luxe-header__mobile-panel ${menuOpen ? "is-open" : ""}`}
        >
          <div className="luxe-header__container luxe-header__mobile-panel-inner">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="luxe-header__mobile-divider" />

            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
