import { useEffect, useMemo, useState } from "react";
import settings from "../../settings/settings";
import "./Location.css";

const imageBase = "/images/home/";

const locationSlides = [
  {
    id: "location-intro",
    layout: "intro",
    eyebrow: "Location",
    kicker: "Sakumono Estate · Ghana",
    title: "Placed between calm, coast, and city access.",
    body: "One Plus One Luxe Retreat gives guests a peaceful residential base with easy access to beaches, shopping, restaurants, Tema, and Accra.",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    items: [
      "Peaceful setting",
      "Near beaches",
      "Near restaurants",
      "Easy city access",
    ],
  },
  {
    id: "location-neighborhood",
    layout: "neighborhood",
    eyebrow: "Neighborhood",
    kicker: "Private residential feel",
    title: "A quiet area with room to unwind.",
    body: "Stay in a private, relaxed setting that works beautifully for couples, solo travelers, business guests, and short getaways.",
    image: `${imageBase}06-exterior-balcony-front-view.jpeg`,
    cards: [
      {
        icon: "shield",
        title: "Peace of mind",
        text: "A calmer setting with a private apartment feel.",
      },
      {
        icon: "coffee",
        title: "Slow mornings",
        text: "Good for restful mornings and relaxed evenings.",
      },
      {
        icon: "building",
        title: "Longer stays",
        text: "Practical for business, leisure, and flexible trips.",
      },
      {
        icon: "pin",
        title: "Well placed",
        text: "Tucked in a convenient area with access to key spots.",
      },
    ],
  },
  {
    id: "location-nearby",
    layout: "nearby",
    eyebrow: "Nearby Highlights",
    kicker: "Beaches · Food · Essentials",
    title: "Close to the places guests actually need.",
    body: "From breezy beach time to casual dining and shopping errands, the retreat sits near everyday and leisure spots that make travel easier.",
    image: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
    cards: [
      {
        icon: "waves",
        title: "Beaches",
        text: "Nearby coastal relaxation and weekend outings.",
      },
      {
        icon: "food",
        title: "Restaurants",
        text: "Dining options for quick meals or evening plans.",
      },
      {
        icon: "bag",
        title: "Shopping",
        text: "Handy for groceries, essentials, and local errands.",
      },
    ],
  },
  {
    id: "location-access",
    layout: "access",
    eyebrow: "Travel Access",
    kicker: "Tema & Accra",
    title: "A useful base for moving around.",
    body: "Whether the visit is for work, family, or leisure, the location makes it easier to move between the retreat and the wider city.",
    image: `${imageBase}02-entryway-hanging-chair-black-door.jpeg`,
    route: ["Retreat", "Tema", "Accra"],
    cards: [
      {
        icon: "building",
        title: "Business stays",
        text: "Good base for guests moving between work and rest.",
      },
      {
        icon: "car",
        title: "City movement",
        text: "Useful for short trips and broader city plans.",
      },
      {
        icon: "map",
        title: "Known area",
        text: "Sakumono Estate balances calm and convenience.",
      },
    ],
  },
  {
    id: "location-services",
    layout: "services",
    eyebrow: "Getting Around",
    kicker: "Available on request",
    title: "Support beyond the stay.",
    body: "Airport transfers, private driver support, local guidance, and parking access can make arrivals, departures, and movement around the city smoother.",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
    cards: [
      {
        icon: "plane",
        title: "Airport transfers",
        text: "Available on request.",
      },
      { icon: "car", title: "Private driver", text: "Available on request." },
      { icon: "map", title: "Local guide", text: "Available on request." },
      {
        icon: "parking",
        title: "Parking access",
        text: "Subject to availability.",
      },
    ],
  },
  {
    id: "location-map",
    layout: "map",
    eyebrow: "Map & Orientation",
    kicker: "General area",
    title: "Easy to place on the map.",
    body: "The retreat is located in Sakumono Estate, Ghana. The public site can show the general area, while exact access details can be shared after booking for privacy and security.",
    image: `${imageBase}06-exterior-balcony-front-view.jpeg`,
  },
  {
    id: "location-book",
    layout: "book",
    eyebrow: "Book Direct",
    kicker: "Stay close to what matters",
    title: "Privacy, comfort, and easy access.",
    body: "Choose a stay that keeps you close to the coast, the city, and the places that matter during your trip.",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
    cta: true,
  },
];

function getBannerHeight() {
  const banner = document.querySelector(".luxe-header__banner");
  return banner ? Math.ceil(banner.getBoundingClientRect().height) : 0;
}

function getFullHeaderHeight() {
  const header = document.querySelector(".luxe-header");
  return header
    ? Math.ceil(header.getBoundingClientRect().height)
    : getBannerHeight();
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

function LocationIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    pin: (
      <>
        <path
          d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
          {...common}
        />
        <circle cx="12" cy="10" r="2.4" {...common} />
      </>
    ),
    shield: (
      <>
        <path
          d="M12 3 5 6v5c0 5 3.1 8.4 7 10 3.9-1.6 7-5 7-10V6l-7-3Z"
          {...common}
        />
        <path d="m9 12 2 2 4-5" {...common} />
      </>
    ),
    coffee: (
      <>
        <path d="M6 8h10v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V8Z" {...common} />
        <path
          d="M16 10h1a2 2 0 0 1 0 4h-1M8 4c0 .8.7.8.7 1.6S8 6.4 8 7M12 4c0 .8.7.8.7 1.6S12 6.4 12 7"
          {...common}
        />
      </>
    ),
    building: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" {...common} />
        <path
          d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01"
          {...common}
        />
      </>
    ),
    waves: (
      <>
        <path
          d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"
          {...common}
        />
        <path
          d="M3 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"
          {...common}
        />
      </>
    ),
    food: (
      <>
        <path d="M6 3v18M10 3v18M6 9h4" {...common} />
        <path d="M15 3v7a3 3 0 0 0 3 3v8" {...common} />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" {...common} />
        <path d="M9 8a3 3 0 0 1 6 0" {...common} />
      </>
    ),
    car: (
      <>
        <path d="M5 15h14l-1.5-5h-11L5 15Z" {...common} />
        <path d="M7 15v3M17 15v3M8 18h8M8 10l1-3h6l1 3" {...common} />
      </>
    ),
    map: (
      <>
        <path d="M9 18 4 20V6l5-2 6 2 5-2v14l-5 2-6-2Z" {...common} />
        <path d="M9 4v14M15 6v14" {...common} />
      </>
    ),
    plane: (
      <>
        <path d="M12 3v18M4 13l8-3 8 3M8 18l4-2 4 2" {...common} />
      </>
    ),
    parking: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" {...common} />
        <path d="M10 17V7h4a3 3 0 0 1 0 6h-4" {...common} />
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
      {icons[name] || icons.pin}
    </svg>
  );
}

export default function Location() {
  const [activePanel, setActivePanel] = useState(0);
  const [panelHeight, setPanelHeight] = useState("100vh");

  const { theme, screens } = settings;

  const previousPanel = locationSlides[activePanel - 1];
  const nextPanel = locationSlides[activePanel + 1];

  const cssVars = useMemo(
    () => ({
      "--location-black": theme.colors.black,
      "--location-surface": theme.colors.surface,
      "--location-surface-2": theme.colors.surface2,
      "--location-copper": theme.colors.copper,
      "--location-copper-light": theme.colors.copperLight,
      "--location-sand": theme.colors.sand,
      "--location-cream": theme.colors.cream,
      "--location-muted": theme.colors.muted,
      "--location-font-display": theme.typography.fontFamily.display,
      "--location-font-body": theme.typography.fontFamily.body,
      "--location-letter-normal": theme.typography.letterSpacing.normal,
      "--location-letter-wide": theme.typography.letterSpacing.wide,
      "--location-page-padding-sm": screens.layout.small.pagePaddingX,
      "--location-page-padding-md": screens.layout.medium.pagePaddingX,
      "--location-page-padding-lg": screens.layout.large.pagePaddingX,
      "--location-page-max": screens.layout.large.pageMaxWidth,
      "--location-transition": theme.transitions.default,
      "--location-transition-slow": theme.transitions.slow,
      "--location-panel-count": locationSlides.length,
      "--location-panel-height": panelHeight,
    }),
    [theme, screens, panelHeight],
  );

  useEffect(() => {
    function updatePanelHeight() {
      const isSmallOrMedium = window.matchMedia("(max-width: 1023px)").matches;
      const headerOffset = isSmallOrMedium
        ? getFullHeaderHeight()
        : getBannerHeight();
      const nextPanelHeight = Math.max(420, window.innerHeight - headerOffset);

      setPanelHeight(`${nextPanelHeight}px`);
    }

    updatePanelHeight();

    window.addEventListener("resize", updatePanelHeight);

    return () => {
      window.removeEventListener("resize", updatePanelHeight);
    };
  }, []);

  function goToPanel(panelIndex) {
    setActivePanel(
      Math.max(0, Math.min(panelIndex, locationSlides.length - 1)),
    );
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
      id="location"
      className="location-page"
      style={cssVars}
      data-horizontal-section="true"
    >
      <div className="location-page__pin" onClick={handlePanelTap}>
        <div className="location-page__progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${(activePanel + 1) / locationSlides.length})`,
            }}
          />
        </div>

        <div className="location-page__counter" aria-hidden="true">
          <span>{String(activePanel + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(locationSlides.length).padStart(2, "0")}</span>
        </div>

        <nav
          className="location-page__panel-controls"
          aria-label="Location slides"
        >
          <button
            className="location-page__carousel-button"
            type="button"
            aria-label="Previous location slide"
            disabled={!previousPanel}
            onClick={() => goToPanel(activePanel - 1)}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            className="location-page__carousel-button"
            type="button"
            aria-label="Next location slide"
            disabled={!nextPanel}
            onClick={() => goToPanel(activePanel + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <div
          className="location-page__track"
          style={{
            transform: `translate3d(-${activePanel * 100}vw, 0, 0)`,
          }}
        >
          {locationSlides.map((slide, index) => (
            <article
              id={slide.id}
              key={slide.id}
              className={`location-page__panel location-page__panel--${slide.layout} ${
                activePanel === index ? "is-active" : ""
              }`}
              data-horizontal-panel-index={index}
            >
              <div
                className="location-page__panel-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              />

              <div className="location-page__panel-scrim" aria-hidden="true" />

              <div className="location-page__panel-inner">
                <div className="location-page__copy">
                  <p className="location-page__eyebrow">{slide.eyebrow}</p>
                  <p className="location-page__kicker">{slide.kicker}</p>

                  <h2>{slide.title}</h2>

                  <p className="location-page__body">{slide.body}</p>

                  {slide.items ? (
                    <div className="location-page__pill-row">
                      {slide.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  ) : null}

                  {slide.route ? (
                    <div className="location-page__route-list">
                      {slide.route.map((point) => (
                        <div className="location-page__route-point" key={point}>
                          <span />
                          <strong>{point}</strong>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {slide.cta ? (
                    <a
                      className="location-page__cta-button"
                      href="#availability"
                    >
                      <span>Book Now</span>
                      <LocationIcon name="book" />
                    </a>
                  ) : null}
                </div>

                {slide.layout === "map" ? (
                  <div className="location-page__map-board">
                    <div className="location-page__map-line location-page__map-line--one" />
                    <div className="location-page__map-line location-page__map-line--two" />

                    <div className="location-page__pin-card location-page__pin-card--retreat">
                      <LocationIcon name="pin" />
                      <span>Retreat</span>
                    </div>

                    <div className="location-page__pin-card location-page__pin-card--beach">
                      <LocationIcon name="waves" />
                      <span>Beaches</span>
                    </div>

                    <div className="location-page__pin-card location-page__pin-card--tema">
                      <LocationIcon name="building" />
                      <span>Tema</span>
                    </div>

                    <div className="location-page__pin-card location-page__pin-card--accra">
                      <LocationIcon name="map" />
                      <span>Accra</span>
                    </div>

                    <p className="location-page__map-note">
                      General area shown publicly. Exact access details can be
                      shared after booking.
                    </p>
                  </div>
                ) : slide.cards ? (
                  <div className="location-page__card-grid">
                    {slide.cards.map((card) => (
                      <div
                        className="location-page__travel-card"
                        key={card.title}
                      >
                        <LocationIcon name={card.icon} />
                        <h3>{card.title}</h3>
                        <p>{card.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="location-page__hero-card">
                    <LocationIcon name="pin" />
                    <span>Sakumono Estate</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="location-page__tap-hint" aria-hidden="true">
          Tap left or right to explore
        </div>
      </div>
    </section>
  );
}
