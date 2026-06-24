import { useEffect, useMemo, useState } from "react";
import settings from "../../settings/settings";
import "./Reviews.css";

const imageBase = "/images/home/";

const reviewSlides = [
  {
    id: "reviews-intro",
    layout: "intro",
    eyebrow: "Reviews",
    kicker: "Guest confidence",
    title: "Guest stories that build trust before booking.",
    body: "This page is designed as a premium guestbook. As real reviews come in, they can be added here to highlight comfort, cleanliness, location, communication, and the overall stay experience.",
    image: `${imageBase}20-bedroom-black-bed-wide-view.jpeg`,
    cards: [
      {
        icon: "star",
        title: "Review-ready",
        text: "Built to display verified guest feedback clearly.",
      },
      {
        icon: "clean",
        title: "Trust areas",
        text: "Cleanliness, comfort, location, value, and support.",
      },
      {
        icon: "quote",
        title: "Guestbook feel",
        text: "A calm review wall instead of a noisy feed.",
      },
    ],
  },
  {
    id: "reviews-featured",
    layout: "featured",
    eyebrow: "Featured Review",
    kicker: "Coming soon",
    title: "A highlighted guest review will live here.",
    body: "When the first strong review is available, this slide should feature it with the guest type, short quote, and rating details.",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
    quote: "Featured guest review coming soon.",
    cards: [
      {
        icon: "couple",
        title: "Stay type",
        text: "Couple stay / Business stay / Weekend stay",
      },
      {
        icon: "star",
        title: "Rating",
        text: "Add verified platform rating later",
      },
      {
        icon: "quote",
        title: "Source",
        text: "Airbnb, Vrbo, Booking.com, or direct guest",
      },
    ],
  },
  {
    id: "reviews-categories",
    layout: "categories",
    eyebrow: "What Guests Rate",
    kicker: "Trust markers",
    title: "The details that matter most to guests.",
    body: "Review categories help future guests quickly understand what people appreciate about the retreat.",
    image: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
    metrics: [
      { icon: "clean", label: "Cleanliness", note: "Room, bathroom, linens" },
      { icon: "bed", label: "Comfort", note: "Sleep, quiet, layout" },
      { icon: "pin", label: "Location", note: "Sakumono, access, convenience" },
      { icon: "chat", label: "Communication", note: "Clarity and support" },
      { icon: "sparkle", label: "Amenities", note: "Wi-Fi, AC, kitchen, bath" },
      { icon: "value", label: "Value", note: "Overall booking confidence" },
    ],
  },
  {
    id: "reviews-guest-types",
    layout: "guest-types",
    eyebrow: "Guest Types",
    kicker: "Who it works for",
    title: "Let future guests see themselves here.",
    body: "Reviews should help each visitor understand whether the retreat fits their kind of trip.",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    cards: [
      {
        icon: "couple",
        title: "Couples",
        text: "Private, calm, and relaxing for a quiet stay.",
      },
      {
        icon: "person",
        title: "Solo travelers",
        text: "Comfortable apartment feel with useful amenities.",
      },
      {
        icon: "work",
        title: "Business guests",
        text: "Good base for work trips between Tema and Accra.",
      },
      {
        icon: "sun",
        title: "Vacation stays",
        text: "Easy access to beaches, dining, and local movement.",
      },
    ],
  },
  {
    id: "reviews-wall",
    layout: "wall",
    eyebrow: "Review Wall",
    kicker: "Guestbook slots",
    title: "A clean wall for verified guest feedback.",
    body: "These cards are placeholders for now. Replace each one with real guest feedback when reviews are available.",
    image: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
    reviews: [
      {
        label: "Review slot 01",
        text: "Guest review coming soon.",
        type: "Comfort",
      },
      {
        label: "Review slot 02",
        text: "Guest review coming soon.",
        type: "Cleanliness",
      },
      {
        label: "Review slot 03",
        text: "Guest review coming soon.",
        type: "Location",
      },
      {
        label: "Review slot 04",
        text: "Guest review coming soon.",
        type: "Communication",
      },
    ],
  },
  {
    id: "reviews-platforms",
    layout: "platforms",
    eyebrow: "Platform Trust",
    kicker: "Booking channels",
    title: "Ready for reviews from trusted platforms.",
    body: "When the property has real platform reviews, this slide can show the source and rating without overclaiming.",
    image: `${imageBase}06-exterior-balcony-front-view.jpeg`,
    platforms: [
      {
        icon: "home",
        title: "Airbnb",
        text: "Add rating after verified reviews.",
      },
      {
        icon: "home",
        title: "Vrbo",
        text: "Add rating after verified reviews.",
      },
      {
        icon: "calendar",
        title: "Booking.com",
        text: "Add rating after verified reviews.",
      },
      {
        icon: "book",
        title: "Direct booking",
        text: "Use guest feedback after direct stays.",
      },
    ],
  },
  {
    id: "reviews-book",
    layout: "book",
    eyebrow: "Book Direct",
    kicker: "Be the next guest",
    title: "Ready to experience the retreat yourself?",
    body: "The review section will grow with every guest stay. For now, guests can book with confidence based on the stay details, gallery, amenities, and location.",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
    cta: true,
  },
];

function getBannerHeight() {
  const banner = document.querySelector(".luxe-header__banner");

  if (!banner) {
    return 0;
  }

  return Math.ceil(banner.getBoundingClientRect().height);
}

function getFullHeaderHeight() {
  const header = document.querySelector(".luxe-header");

  if (!header) {
    return getBannerHeight();
  }

  return Math.ceil(header.getBoundingClientRect().height);
}

function ArrowIcon({ direction = "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === "left" ? (
        <path
          d="M14.5 6.5L9 12l5.5 5.5M9.5 12H20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5L15 12l-5.5 5.5M4 12h10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function ReviewIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    star: (
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        {...common}
      />
    ),
    quote: (
      <>
        <path d="M8 8H5v5h3v3H4V8h4Z" {...common} />
        <path d="M18 8h-3v5h3v3h-4V8h4Z" {...common} />
      </>
    ),
    clean: (
      <>
        <path d="M8 14l-2 7M16 14l2 7M6 21h12" {...common} />
        <path d="M9 3h6l1 11H8L9 3Z" {...common} />
      </>
    ),
    bed: (
      <>
        <path d="M4 12V6M20 18v-5a3 3 0 0 0-3-3H4v8" {...common} />
        <path d="M4 14h16M7 10V8h5v2" {...common} />
      </>
    ),
    pin: (
      <>
        <path
          d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
          {...common}
        />
        <circle cx="12" cy="10" r="2.4" {...common} />
      </>
    ),
    chat: (
      <>
        <path d="M5 5h14v10H8l-3 4V5Z" {...common} />
        <path d="M9 9h6M9 12h4" {...common} />
      </>
    ),
    sparkle: (
      <>
        <path
          d="M12 3l1.4 5.1L18.5 9.5l-5.1 1.4L12 16l-1.4-5.1-5.1-1.4 5.1-1.4L12 3Z"
          {...common}
        />
        <path
          d="M18 15l.7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z"
          {...common}
        />
      </>
    ),
    value: (
      <>
        <path d="M20 7 10 17l-5-5" {...common} />
        <path d="M4 19h16" {...common} />
      </>
    ),
    couple: (
      <>
        <circle cx="9" cy="8" r="3" {...common} />
        <circle cx="16" cy="9" r="2.5" {...common} />
        <path d="M4 21a5 5 0 0 1 10 0M13 21a4 4 0 0 1 7 0" {...common} />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="8" r="3.5" {...common} />
        <path d="M5 21a7 7 0 0 1 14 0" {...common} />
      </>
    ),
    work: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="2" {...common} />
        <path d="M9 7V5h6v2M4 12h16" {...common} />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" {...common} />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          {...common}
        />
      </>
    ),
    home: (
      <>
        <path d="M4 11 12 4l8 7" {...common} />
        <path d="M6 10v10h12V10M9 20v-6h6v6" {...common} />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v3M17 3v3" {...common} />
        <rect x="4" y="5" width="16" height="15" rx="2.5" {...common} />
        <path d="M4 10h16" {...common} />
      </>
    ),
    book: (
      <>
        <path d="M7 3v3M17 3v3" {...common} />
        <rect x="4" y="5" width="16" height="15" rx="2.5" {...common} />
        <path d="M4 10h16M9 15l2 2 4-5" {...common} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.star}
    </svg>
  );
}

function StarRow() {
  return (
    <div className="reviews-page__stars" aria-hidden="true">
      <ReviewIcon name="star" />
      <ReviewIcon name="star" />
      <ReviewIcon name="star" />
      <ReviewIcon name="star" />
      <ReviewIcon name="star" />
    </div>
  );
}

export default function Reviews() {
  const [activePanel, setActivePanel] = useState(0);
  const [panelHeight, setPanelHeight] = useState("100vh");
  const [headerCover, setHeaderCover] = useState("0px");

  const { theme, screens } = settings;

  const previousPanel = reviewSlides[activePanel - 1];
  const nextPanel = reviewSlides[activePanel + 1];

  const cssVars = useMemo(
    () => ({
      "--reviews-black": theme.colors.black,
      "--reviews-surface": theme.colors.surface,
      "--reviews-surface-2": theme.colors.surface2,
      "--reviews-copper": theme.colors.copper,
      "--reviews-copper-light": theme.colors.copperLight,
      "--reviews-sand": theme.colors.sand,
      "--reviews-cream": theme.colors.cream,
      "--reviews-muted": theme.colors.muted,
      "--reviews-font-display": theme.typography.fontFamily.display,
      "--reviews-font-body": theme.typography.fontFamily.body,
      "--reviews-letter-normal": theme.typography.letterSpacing.normal,
      "--reviews-letter-wide": theme.typography.letterSpacing.wide,
      "--reviews-page-padding-sm": screens.layout.small.pagePaddingX,
      "--reviews-page-padding-md": screens.layout.medium.pagePaddingX,
      "--reviews-page-padding-lg": screens.layout.large.pagePaddingX,
      "--reviews-page-max": screens.layout.large.pageMaxWidth,
      "--reviews-transition": theme.transitions.default,
      "--reviews-transition-slow": theme.transitions.slow,
      "--reviews-panel-count": reviewSlides.length,
      "--reviews-panel-height": panelHeight,
      "--reviews-header-cover": headerCover,
    }),
    [theme, screens, panelHeight, headerCover],
  );

  useEffect(() => {
    function updatePanelMeasurements() {
      const isSmallOrMedium = window.matchMedia("(max-width: 1023px)").matches;
      const bannerHeight = getBannerHeight();
      const fullHeaderHeight = getFullHeaderHeight();
      const nextHeaderCover = isSmallOrMedium
        ? Math.max(0, fullHeaderHeight - bannerHeight)
        : 0;

      setHeaderCover(`${nextHeaderCover}px`);
      setPanelHeight(`${Math.max(420, window.innerHeight - bannerHeight)}px`);
    }

    updatePanelMeasurements();

    window.addEventListener("resize", updatePanelMeasurements);

    return () => {
      window.removeEventListener("resize", updatePanelMeasurements);
    };
  }, []);

  useEffect(() => {
    function handleReviewsPanelRequest(event) {
      const sectionId = event.detail?.sectionId;
      const targetId = event.detail?.targetId;

      if (sectionId !== "reviews") return;

      if (targetId === "reviews") {
        setActivePanel(0);
      }
    }

    window.addEventListener(
      "onePlusOne:stayPanelRequest",
      handleReviewsPanelRequest,
    );

    return () => {
      window.removeEventListener(
        "onePlusOne:stayPanelRequest",
        handleReviewsPanelRequest,
      );
    };
  }, []);

  function goToPanel(panelIndex) {
    setActivePanel(Math.max(0, Math.min(panelIndex, reviewSlides.length - 1)));
  }

  function handlePanelTap(event) {
    const isSmallOrMediumDevice = window.matchMedia(
      "(max-width: 1023px)",
    ).matches;

    if (!isSmallOrMediumDevice) return;

    const clickedInteractiveElement = event.target.closest(
      "a, button, input, textarea, select, [role='button']",
    );

    if (clickedInteractiveElement) return;

    if (event.clientX < window.innerWidth / 2) {
      goToPanel(activePanel - 1);
    } else {
      goToPanel(activePanel + 1);
    }
  }

  return (
    <section
      id="reviews"
      className="reviews-page"
      style={cssVars}
      data-horizontal-section="true"
    >
      <div className="reviews-page__pin" onClick={handlePanelTap}>
        <div className="reviews-page__progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${(activePanel + 1) / reviewSlides.length})`,
            }}
          />
        </div>

        <div className="reviews-page__counter" aria-hidden="true">
          <span>{String(activePanel + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(reviewSlides.length).padStart(2, "0")}</span>
        </div>

        <nav
          className="reviews-page__panel-controls"
          aria-label="Reviews slides"
        >
          <button
            className="reviews-page__carousel-button"
            type="button"
            aria-label="Previous reviews slide"
            disabled={!previousPanel}
            onClick={() => goToPanel(activePanel - 1)}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            className="reviews-page__carousel-button"
            type="button"
            aria-label="Next reviews slide"
            disabled={!nextPanel}
            onClick={() => goToPanel(activePanel + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <div
          className="reviews-page__track"
          style={{
            transform: `translate3d(-${activePanel * 100}vw, 0, 0)`,
          }}
        >
          {reviewSlides.map((slide, index) => (
            <article
              id={slide.id}
              key={slide.id}
              className={`reviews-page__panel reviews-page__panel--${slide.layout} ${
                activePanel === index ? "is-active" : ""
              }`}
              data-horizontal-panel-index={index}
            >
              <div
                className="reviews-page__panel-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              />

              <div className="reviews-page__panel-scrim" aria-hidden="true" />

              <div className="reviews-page__panel-inner">
                <div className="reviews-page__copy">
                  <p className="reviews-page__eyebrow">{slide.eyebrow}</p>
                  <p className="reviews-page__kicker">{slide.kicker}</p>

                  <h2>{slide.title}</h2>

                  <p className="reviews-page__body">{slide.body}</p>

                  {slide.quote ? (
                    <div className="reviews-page__quote-box">
                      <ReviewIcon name="quote" />
                      <p>{slide.quote}</p>
                      <StarRow />
                    </div>
                  ) : null}

                  {slide.cta ? (
                    <a
                      className="reviews-page__cta-button"
                      href="#availability"
                    >
                      <span>Book Now</span>
                      <ReviewIcon name="book" />
                    </a>
                  ) : null}
                </div>

                {slide.metrics ? (
                  <div className="reviews-page__metric-grid">
                    {slide.metrics.map((metric) => (
                      <div
                        className="reviews-page__metric-card"
                        key={metric.label}
                      >
                        <ReviewIcon name={metric.icon} />
                        <h3>{metric.label}</h3>
                        <p>{metric.note}</p>
                        <StarRow />
                      </div>
                    ))}
                  </div>
                ) : slide.reviews ? (
                  <div className="reviews-page__review-wall">
                    {slide.reviews.map((review) => (
                      <div
                        className="reviews-page__review-card"
                        key={review.label}
                      >
                        <ReviewIcon name="quote" />
                        <p>{review.text}</p>
                        <div>
                          <strong>{review.label}</strong>
                          <span>{review.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : slide.platforms ? (
                  <div className="reviews-page__platform-grid">
                    {slide.platforms.map((platform) => (
                      <div
                        className="reviews-page__platform-card"
                        key={platform.title}
                      >
                        <ReviewIcon name={platform.icon} />
                        <h3>{platform.title}</h3>
                        <p>{platform.text}</p>
                      </div>
                    ))}
                  </div>
                ) : slide.cards ? (
                  <div className="reviews-page__card-grid">
                    {slide.cards.map((card) => (
                      <div
                        className="reviews-page__trust-card"
                        key={card.title}
                      >
                        <ReviewIcon name={card.icon} />
                        <h3>{card.title}</h3>
                        <p>{card.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="reviews-page__hero-card">
                    <ReviewIcon name="quote" />
                    <span>Guestbook ready</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="reviews-page__tap-hint" aria-hidden="true">
          Tap left or right to explore
        </div>
      </div>
    </section>
  );
}
