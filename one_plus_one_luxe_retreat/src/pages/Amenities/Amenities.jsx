import { useEffect, useMemo, useState } from "react";
import settings from "../../settings/settings";
import "./Amenities.css";

const imageBase = "/images/home/";

const amenitySlides = [
  {
    id: "amenities-intro",
    layout: "intro",
    eyebrow: "Amenities",
    kicker: "Prepared for comfort",
    title: "Everything you need, already prepared.",
    body: "One Plus One Luxe Retreat is designed to feel beautiful, practical, and guest-ready from the moment you arrive.",
    image: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
    feature: "Comfort, privacy, and thoughtful details.",
  },
  {
    id: "amenities-comfort",
    layout: "comfort",
    eyebrow: "Comfort Essentials",
    kicker: "Rest easy",
    title: "The everyday things guests ask for first.",
    body: "Fast connection, cool rooms, entertainment, fresh linens, towels, and a calm queen bedroom make the stay easy from day one.",
    image: `${imageBase}20-bedroom-black-bed-wide-view.jpeg`,
    items: [
      { icon: "wifi", label: "High-speed Wi-Fi" },
      { icon: "ac", label: "Air conditioning" },
      { icon: "tv", label: "Smart TV" },
      { icon: "stream", label: "Streaming access" },
      { icon: "bed", label: "Queen-size bed" },
      { icon: "linen", label: "Fresh linens" },
      { icon: "towel", label: "Towels provided" },
      { icon: "water", label: "Hot water" },
    ],
  },
  {
    id: "amenities-kitchen",
    layout: "kitchen",
    eyebrow: "Kitchen & Dining",
    kicker: "Stay flexible",
    title: "Cook, snack, or start slow mornings your way.",
    body: "The kitchen and breakfast bar make the apartment better for longer stays, work trips, and guests who want flexibility beyond restaurants.",
    image: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
    items: [
      { icon: "kitchen", label: "Fully equipped kitchen" },
      { icon: "dining", label: "Breakfast bar" },
      { icon: "cookware", label: "Cookware" },
      { icon: "dishes", label: "Dishes & glasses" },
      { icon: "fridge", label: "Fridge" },
      { icon: "coffee", label: "Coffee / kettle setup" },
    ],
  },
  {
    id: "amenities-bath",
    layout: "bath",
    eyebrow: "Bathroom & Relaxation",
    kicker: "Spa detail",
    title: "The bathtub is one of the strongest moments.",
    body: "A relaxing bathroom experience gives the retreat its luxury identity, with a soaking tub, clean finishes, towels, and a calm bath mood.",
    image: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
    items: [
      { icon: "bath", label: "Luxury bathtub" },
      { icon: "sparkle", label: "Waterfall wall detail" },
      { icon: "mirror", label: "Mirror" },
      { icon: "shower", label: "Shower" },
      { icon: "towel", label: "Bathroom towels" },
      { icon: "clean", label: "Clean essentials" },
    ],
  },
  {
    id: "amenities-outdoor",
    layout: "outdoor",
    eyebrow: "Outdoor & Access",
    kicker: "Private moments",
    title: "Step outside without leaving the retreat.",
    body: "The balcony, rooftop terrace, exterior stairs, and parking access give guests more space, more privacy, and more ways to enjoy the stay.",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    items: [
      { icon: "balcony", label: "Private balcony" },
      { icon: "rooftop", label: "Rooftop terrace" },
      { icon: "seat", label: "Outdoor seating" },
      { icon: "parking", label: "Parking area" },
      { icon: "stairs", label: "Exterior stairs access" },
      { icon: "key", label: "Private apartment access" },
    ],
  },
  {
    id: "amenities-safety",
    layout: "safety",
    eyebrow: "Safety & Practical Details",
    kicker: "Peace of mind",
    title: "Clear, simple details that help guests feel secure.",
    body: "This slide should feel reassuring, not scary: practical safety details, quiet hours, privacy, and clear expectations.",
    image: `${imageBase}06-exterior-balcony-front-view.jpeg`,
    items: [
      { icon: "camera", label: "Exterior security cameras" },
      { icon: "aid", label: "First aid kit" },
      { icon: "light", label: "Well-lit entry" },
      { icon: "quiet", label: "Quiet hours" },
      { icon: "lock", label: "Private apartment" },
      { icon: "parking", label: "Parking subject to availability" },
    ],
  },
  {
    id: "amenities-services",
    layout: "services",
    eyebrow: "Extra Services",
    kicker: "Available on request",
    title: "Add convenience when the trip needs more.",
    body: "Optional services can make the stay feel more premium and local. Extra cost may apply depending on the request.",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
    items: [
      { icon: "airport", label: "Airport transfers" },
      { icon: "driver", label: "Private driver" },
      { icon: "laundry", label: "Laundry / housekeeping" },
      { icon: "grocery", label: "Grocery shopping" },
      { icon: "wellness", label: "Massage / wellness" },
      { icon: "guide", label: "Local guide or companion" },
    ],
  },
  {
    id: "amenities-book",
    layout: "book",
    eyebrow: "Ready?",
    kicker: "Book the full retreat",
    title: "Enjoy the comfort, not just the photos.",
    body: "Once guests know what is included, the next step is simple: check dates and book the retreat.",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
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

function AmenityIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    wifi: (
      <>
        <path d="M4 9.5a12 12 0 0 1 16 0" {...common} />
        <path d="M7.5 13a7 7 0 0 1 9 0" {...common} />
        <path d="M11 16.5a1.4 1.4 0 0 1 2 0" {...common} />
      </>
    ),
    ac: (
      <>
        <path d="M12 3v18M5 6l14 12M19 6L5 18" {...common} />
        <path d="M8.2 4.7 12 7l3.8-2.3M8.2 19.3 12 17l3.8 2.3" {...common} />
      </>
    ),
    tv: (
      <>
        <rect x="4" y="5" width="16" height="11" rx="1.8" {...common} />
        <path d="M9 20h6M12 16v4" {...common} />
      </>
    ),
    stream: (
      <>
        <rect x="5" y="6" width="14" height="12" rx="2" {...common} />
        <path d="m11 10 4 2-4 2v-4Z" {...common} />
      </>
    ),
    bed: (
      <>
        <path d="M4 12V6M20 18v-5a3 3 0 0 0-3-3H4v8" {...common} />
        <path d="M4 14h16M7 10V8h5v2" {...common} />
      </>
    ),
    linen: (
      <>
        <path d="M7 4h10v16H7z" {...common} />
        <path d="M9.5 7h5M9.5 10h5M9.5 13h5" {...common} />
      </>
    ),
    towel: (
      <>
        <path d="M8 4h8v16H8z" {...common} />
        <path d="M8 8h8M10 12h4" {...common} />
      </>
    ),
    water: (
      <>
        <path
          d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z"
          {...common}
        />
        <path d="M9.5 15.5A3 3 0 0 0 13 18" {...common} />
      </>
    ),
    kitchen: (
      <>
        <path d="M6 3v18M10 3v18M6 9h4" {...common} />
        <path d="M15 3v7a3 3 0 0 0 3 3v8" {...common} />
      </>
    ),
    dining: (
      <>
        <path d="M4 10h16M7 10v10M17 10v10" {...common} />
        <path d="M8 5h8l2 5H6l2-5Z" {...common} />
      </>
    ),
    cookware: (
      <>
        <path d="M5 12h11a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z" {...common} />
        <path d="M16 12h3M8 8c0-1 1-1 1-2M12 8c0-1 1-1 1-2" {...common} />
      </>
    ),
    dishes: (
      <>
        <circle cx="12" cy="12" r="7" {...common} />
        <circle cx="12" cy="12" r="3.5" {...common} />
      </>
    ),
    fridge: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="1.8" {...common} />
        <path d="M7 10h10M10 7v1M10 14v1" {...common} />
      </>
    ),
    coffee: (
      <>
        <path d="M6 8h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z" {...common} />
        <path
          d="M16 10h1a2 2 0 0 1 0 4h-1M8 4c0 .8.7.8.7 1.6S8 6.4 8 7M12 4c0 .8.7.8.7 1.6S12 6.4 12 7"
          {...common}
        />
      </>
    ),
    bath: (
      <>
        <path d="M5 12h14v3a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-3Z" {...common} />
        <path d="M8 12V7a3 3 0 0 1 6 0M14 7h2" {...common} />
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
    mirror: (
      <>
        <ellipse cx="12" cy="10" rx="5" ry="7" {...common} />
        <path d="M12 17v4M9 21h6" {...common} />
      </>
    ),
    shower: (
      <>
        <path d="M7 9a5 5 0 0 1 10 0" {...common} />
        <path
          d="M6 9h12M8 13v.01M12 13v.01M16 13v.01M10 17v.01M14 17v.01"
          {...common}
        />
      </>
    ),
    clean: (
      <>
        <path d="M8 14l-2 7M16 14l2 7M6 21h12" {...common} />
        <path d="M9 3h6l1 11H8L9 3Z" {...common} />
      </>
    ),
    balcony: (
      <>
        <path d="M5 11h14M7 11v9M12 11v9M17 11v9M4 20h16" {...common} />
        <path d="M8 7a4 4 0 0 1 8 0v4H8V7Z" {...common} />
      </>
    ),
    rooftop: (
      <>
        <path d="M4 11 12 4l8 7" {...common} />
        <path d="M6 10v10h12V10M9 20v-6h6v6" {...common} />
      </>
    ),
    seat: (
      <>
        <path d="M7 12V6h10v6M6 12h12v5H6zM8 17v3M16 17v3" {...common} />
      </>
    ),
    parking: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" {...common} />
        <path d="M10 17V7h4a3 3 0 0 1 0 6h-4" {...common} />
      </>
    ),
    stairs: (
      <>
        <path d="M4 19h4v-4h4v-4h4V7h4" {...common} />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="12" r="3.5" {...common} />
        <path d="M11.5 12H21M17 12v3M20 12v2" {...common} />
      </>
    ),
    camera: (
      <>
        <path
          d="M8 7l1.4-2h5.2L16 7h2.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-7A2.5 2.5 0 0 1 5.5 7H8Z"
          {...common}
        />
        <circle cx="12" cy="13" r="3.2" {...common} />
      </>
    ),
    aid: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" {...common} />
        <path d="M12 8v8M8 12h8" {...common} />
      </>
    ),
    light: (
      <>
        <path d="M9 14a5 5 0 1 1 6 0v2H9v-2Z" {...common} />
        <path d="M9 20h6M10 16h4" {...common} />
      </>
    ),
    quiet: (
      <>
        <path d="M5 10v4h3l4 4V6L8 10H5Z" {...common} />
        <path d="M17 9l3 6M20 9l-3 6" {...common} />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" {...common} />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" {...common} />
      </>
    ),
    airport: (
      <>
        <path d="M12 3v18M4 13l8-3 8 3M8 18l4-2 4 2" {...common} />
      </>
    ),
    driver: (
      <>
        <path d="M5 15h14l-1.5-5h-11L5 15Z" {...common} />
        <path d="M7 15v3M17 15v3M8 18h8M8 10l1-3h6l1 3" {...common} />
      </>
    ),
    laundry: (
      <>
        <rect x="6" y="3" width="12" height="18" rx="2" {...common} />
        <circle cx="12" cy="13" r="4" {...common} />
        <path d="M9 6h.01M12 6h.01" {...common} />
      </>
    ),
    grocery: (
      <>
        <path d="M6 8h14l-2 9H8L6 8ZM6 8 5 4H3" {...common} />
        <circle cx="9" cy="20" r="1" {...common} />
        <circle cx="17" cy="20" r="1" {...common} />
      </>
    ),
    wellness: (
      <>
        <path
          d="M12 21s-7-4.2-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.8-7 10-7 10Z"
          {...common}
        />
      </>
    ),
    guide: (
      <>
        <path d="M9 18 4 20V6l5-2 6 2 5-2v14l-5 2-6-2Z" {...common} />
        <path d="M9 4v14M15 6v14" {...common} />
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
      {icons[name] || icons.sparkle}
    </svg>
  );
}

export default function Amenities() {
  const [activePanel, setActivePanel] = useState(0);
  const [panelHeight, setPanelHeight] = useState("100vh");
  const [headerCover, setHeaderCover] = useState("0px");

  const { theme, screens } = settings;

  const previousPanel = amenitySlides[activePanel - 1];
  const nextPanel = amenitySlides[activePanel + 1];

  const cssVars = useMemo(
    () => ({
      "--amenities-black": theme.colors.black,
      "--amenities-surface": theme.colors.surface,
      "--amenities-surface-2": theme.colors.surface2,
      "--amenities-copper": theme.colors.copper,
      "--amenities-copper-light": theme.colors.copperLight,
      "--amenities-sand": theme.colors.sand,
      "--amenities-cream": theme.colors.cream,
      "--amenities-muted": theme.colors.muted,
      "--amenities-font-display": theme.typography.fontFamily.display,
      "--amenities-font-body": theme.typography.fontFamily.body,
      "--amenities-letter-normal": theme.typography.letterSpacing.normal,
      "--amenities-letter-wide": theme.typography.letterSpacing.wide,
      "--amenities-page-padding-sm": screens.layout.small.pagePaddingX,
      "--amenities-page-padding-md": screens.layout.medium.pagePaddingX,
      "--amenities-page-padding-lg": screens.layout.large.pagePaddingX,
      "--amenities-page-max": screens.layout.large.pageMaxWidth,
      "--amenities-transition": theme.transitions.default,
      "--amenities-transition-slow": theme.transitions.slow,
      "--amenities-panel-count": amenitySlides.length,
      "--amenities-panel-height": panelHeight,
      "--amenities-header-cover": headerCover,
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

  function goToPanel(panelIndex) {
    const safePanelIndex = Math.max(
      0,
      Math.min(panelIndex, amenitySlides.length - 1),
    );

    setActivePanel(safePanelIndex);
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
      id="amenities"
      className="amenities-page"
      style={cssVars}
      data-horizontal-section="true"
    >
      <div className="amenities-page__pin" onClick={handlePanelTap}>
        <div className="amenities-page__progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${(activePanel + 1) / amenitySlides.length})`,
            }}
          />
        </div>

        <div className="amenities-page__counter" aria-hidden="true">
          <span>{String(activePanel + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(amenitySlides.length).padStart(2, "0")}</span>
        </div>

        <nav
          className="amenities-page__panel-controls"
          aria-label="Amenities slides"
        >
          <button
            className="amenities-page__carousel-button"
            type="button"
            aria-label="Previous amenities slide"
            disabled={!previousPanel}
            onClick={() => goToPanel(activePanel - 1)}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            className="amenities-page__carousel-button"
            type="button"
            aria-label="Next amenities slide"
            disabled={!nextPanel}
            onClick={() => goToPanel(activePanel + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <div
          className="amenities-page__track"
          style={{
            transform: `translate3d(-${activePanel * 100}vw, 0, 0)`,
          }}
        >
          {amenitySlides.map((slide, index) => (
            <article
              id={slide.id}
              key={slide.id}
              className={`amenities-page__panel amenities-page__panel--${slide.layout} ${
                activePanel === index ? "is-active" : ""
              }`}
              data-horizontal-panel-index={index}
            >
              <div
                className="amenities-page__panel-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              />

              <div className="amenities-page__panel-scrim" aria-hidden="true" />

              <div className="amenities-page__panel-inner">
                <div className="amenities-page__copy">
                  <p className="amenities-page__eyebrow">{slide.eyebrow}</p>
                  <p className="amenities-page__kicker">{slide.kicker}</p>

                  <h2>{slide.title}</h2>

                  <p className="amenities-page__body">{slide.body}</p>

                  {slide.feature ? (
                    <div className="amenities-page__feature-pill">
                      <AmenityIcon name="sparkle" />
                      <span>{slide.feature}</span>
                    </div>
                  ) : null}

                  {slide.cta ? (
                    <a
                      className="amenities-page__cta-button"
                      href="#availability"
                    >
                      <span>Book Now</span>
                      <AmenityIcon name="book" />
                    </a>
                  ) : null}
                </div>

                {slide.items ? (
                  <div className="amenities-page__amenity-grid">
                    {slide.items.map((item) => (
                      <div
                        className="amenities-page__amenity-card"
                        key={item.label}
                      >
                        <AmenityIcon name={item.icon} />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="amenities-page__hero-card">
                    <AmenityIcon name={slide.cta ? "book" : "sparkle"} />
                    <span>
                      {slide.cta ? "Book when ready" : "Guest-ready details"}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="amenities-page__tap-hint" aria-hidden="true">
          Tap left or right to explore
        </div>
      </div>
    </section>
  );
}
