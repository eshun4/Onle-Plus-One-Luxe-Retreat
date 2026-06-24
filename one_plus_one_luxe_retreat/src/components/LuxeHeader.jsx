import { useEffect, useMemo, useRef, useState } from "react";
import settings from "../settings/settings";
import "./LuxeHeader.css";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 10h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
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
  { label: "Home", href: "#home" },
  { label: "The Stay", href: "#stay" },
  { label: "Gallery", href: "#gallery" },
  { label: "Amenities", href: "#amenities" },
  { label: "Location", href: "#location" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

function getInitialActiveHref() {
  if (typeof window === "undefined") {
    return "#home";
  }

  const currentHash = window.location.hash;

  if (navLinks.some((link) => link.href === currentHash)) {
    return currentHash;
  }

  return "#home";
}

function getBannerHeight() {
  const banner = document.querySelector(".luxe-header__banner");

  if (!banner) {
    return 0;
  }

  return Math.ceil(banner.getBoundingClientRect().height);
}

function getCurrentSectionHref() {
  const markerY =
    (window.scrollY || window.pageYOffset) + getBannerHeight() + 24;

  let currentHref = "#home";

  navLinks.forEach((link) => {
    const sectionId = link.href.replace("#", "");
    const section = document.getElementById(sectionId);

    if (section && section.offsetTop <= markerY) {
      currentHref = link.href;
    }
  });

  return currentHref;
}

export default function LuxeHeader({
  logo,
  logoSrc,
  logoAlt = "One Plus One Luxe Retreat",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(getInitialActiveHref);
  const activeClickLockRef = useRef(null);
  const frameRef = useRef(null);
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

  useEffect(() => {
    function updateActiveHref() {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const activeClickLock = activeClickLockRef.current;

        if (activeClickLock && performance.now() < activeClickLock.expiresAt) {
          setActiveHref(activeClickLock.href);
          return;
        }

        activeClickLockRef.current = null;
        setActiveHref(getCurrentSectionHref());
      });
    }

    function handleHashChange() {
      const currentHash = window.location.hash;

      if (navLinks.some((link) => link.href === currentHash)) {
        setActiveHref(currentHash);
      } else {
        updateActiveHref();
      }
    }

    updateActiveHref();

    window.addEventListener("scroll", updateActiveHref, { passive: true });
    window.addEventListener("resize", updateActiveHref);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", updateActiveHref);
      window.removeEventListener("resize", updateActiveHref);
      window.removeEventListener("hashchange", handleHashChange);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function handleNavClick(href) {
    activeClickLockRef.current = {
      href,
      expiresAt: performance.now() + 2400,
    };

    setActiveHref(href);
    setMenuOpen(false);
  }

  return (
    <header className="luxe-header" style={cssVars}>
      <div className="luxe-header__banner">
        <div className="luxe-header__container luxe-header__banner-inner">
          <p className="luxe-header__banner-copy">
            Book direct for the best retreat experience.{" "}
            <a href="#availability">Check your dates</a>
          </p>
        </div>
      </div>

      <div className="luxe-header__nav-shell">
        <div className="luxe-header__nav-bar">
          <div className="luxe-header__container luxe-header__nav-inner">
            <a
              className="luxe-header__brand"
              href="#home"
              aria-label={logoAlt}
              onClick={() => handleNavClick("#home")}
            >
              <span className="luxe-header__brand-mark">
                {logo ? (
                  logo
                ) : logoSrc ? (
                  <img src={logoSrc} alt={logoAlt} />
                ) : null}
              </span>

              <span className="luxe-header__brand-name">
                One Plus One Luxe Retreat
              </span>
            </a>

            <nav
              className="luxe-header__nav-links"
              aria-label="Primary navigation"
            >
              <ul className="luxe-header__nav-list">
                {navLinks.map((link) => {
                  const isActive = activeHref === link.href;

                  return (
                    <li
                      key={link.label}
                      className={`luxe-header__nav-item ${
                        isActive ? "is-active" : ""
                      }`}
                    >
                      <a
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => handleNavClick(link.href)}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="luxe-header__actions">
              <a
                className="luxe-header__cta-desktop"
                href="#availability"
                onClick={() => handleNavClick("#stay")}
              >
                <span>Check Availability</span>
                <CalendarIcon />
              </a>

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

        <div className="luxe-header__cta-row">
          <div className="luxe-header__container">
            <a
              className="luxe-header__cta-mobile"
              href="#availability"
              onClick={() => handleNavClick("#stay")}
            >
              <span>Check Availability</span>
              <CalendarIcon />
            </a>
          </div>
        </div>

        <div
          className={`luxe-header__mobile-panel ${menuOpen ? "is-open" : ""}`}
        >
          <div className="luxe-header__container luxe-header__mobile-panel-inner">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={isActive ? "is-active" : ""}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
