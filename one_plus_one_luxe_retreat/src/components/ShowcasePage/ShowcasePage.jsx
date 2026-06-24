import { useMemo } from "react";
import settings from "../../settings/settings";
import "./ShowcasePage.css";

export default function ShowcasePage({
  id,
  eyebrow,
  title,
  description,
  featuredLabel,
  featuredTitle,
  featuredBody,
  items = [],
}) {
  const { theme, screens } = settings;

  const cssVars = useMemo(
    () => ({
      "--showcase-black": theme.colors.black,
      "--showcase-surface": theme.colors.surface,
      "--showcase-surface-2": theme.colors.surface2,
      "--showcase-copper": theme.colors.copper,
      "--showcase-copper-light": theme.colors.copperLight,
      "--showcase-sand": theme.colors.sand,
      "--showcase-cream": theme.colors.cream,
      "--showcase-muted": theme.colors.muted,
      "--showcase-font-display": theme.typography.fontFamily.display,
      "--showcase-font-body": theme.typography.fontFamily.body,
      "--showcase-letter-normal": theme.typography.letterSpacing.normal,
      "--showcase-letter-wide": theme.typography.letterSpacing.wide,
      "--showcase-section-padding-sm": screens.layout.small.sectionPaddingY,
      "--showcase-section-padding-md": screens.layout.medium.sectionPaddingY,
      "--showcase-section-padding-lg": screens.layout.large.sectionPaddingY,
      "--showcase-page-padding-sm": screens.layout.small.pagePaddingX,
      "--showcase-page-padding-md": screens.layout.medium.pagePaddingX,
      "--showcase-page-padding-lg": screens.layout.large.pagePaddingX,
      "--showcase-page-max": screens.layout.large.pageMaxWidth,
      "--showcase-card-padding-sm": screens.elements.small.cardPadding,
      "--showcase-card-padding-md": screens.elements.medium.cardPadding,
      "--showcase-card-padding-lg": screens.elements.large.cardPadding,
      "--showcase-transition": theme.transitions.default,
      "--showcase-transition-slow": theme.transitions.slow,
    }),
    [theme, screens],
  );

  return (
    <section
      id={id}
      className={`showcase-page showcase-page--${id}`}
      style={cssVars}
    >
      <div className="showcase-page__inner">
        <div className="showcase-page__intro">
          <p className="showcase-page__eyebrow">{eyebrow}</p>

          <h2 className="showcase-page__title">{title}</h2>

          <p className="showcase-page__description">{description}</p>
        </div>

        <div className="showcase-page__feature">
          <div className="showcase-page__feature-card">
            <p className="showcase-page__section-label">{featuredLabel}</p>

            <h3 className="showcase-page__heading">{featuredTitle}</h3>

            <p className="showcase-page__body">{featuredBody}</p>
          </div>

          <div className="showcase-page__visual" aria-hidden="true">
            <span className="showcase-page__visual-label">{eyebrow}</span>
          </div>
        </div>

        <div className="showcase-page__grid">
          {items.map((item, index) => (
            <article className="showcase-page__card" key={item.label}>
              <span className="showcase-page__card-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{item.label}</h3>

              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
