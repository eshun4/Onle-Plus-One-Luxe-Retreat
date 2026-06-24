import { useEffect, useMemo, useState } from "react";
import settings from "../../settings/settings";
import "./Faq.css";

const imageBase = "/images/home/";

const faqSlides = [
  {
    id: "faq-intro",
    layout: "intro",
    eyebrow: "FAQ",
    kicker: "Before you book",
    title: "Clear answers before you reserve.",
    body: "Find quick answers about check-in, house rules, parking, services, location privacy, amenities, and booking support.",
    image: `${imageBase}02-entryway-hanging-chair-black-door.jpeg`,
    cards: [
      {
        icon: "question",
        title: "Quick answers",
        text: "Simple details guests usually ask before booking.",
      },
      {
        icon: "shield",
        title: "Clear expectations",
        text: "House rules, privacy, access, and guest care explained.",
      },
      {
        icon: "book",
        title: "Booking confidence",
        text: "Know what to expect before confirming your stay.",
      },
    ],
  },
  {
    id: "faq-arrival",
    layout: "arrival",
    eyebrow: "Arrival",
    kicker: "Check-in & checkout",
    title: "A smooth arrival starts with clear timing.",
    body: "Access details are shared after booking confirmation, so guests know how to arrive and what to expect.",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
    faqs: [
      {
        icon: "clock",
        question: "What time is check-in?",
        answer: "Check-in is typically from 3:00 PM.",
      },
      {
        icon: "clock",
        question: "What time is checkout?",
        answer: "Checkout is typically by 11:00 AM.",
      },
      {
        icon: "request",
        question: "Can I request early check-in?",
        answer: "Early check-in may be available on request.",
      },
      {
        icon: "key",
        question: "How do I receive access details?",
        answer: "Access details are shared after booking confirmation.",
      },
    ],
  },
  {
    id: "faq-rules",
    layout: "rules",
    eyebrow: "House Rules",
    kicker: "Guests & quiet hours",
    title: "Simple rules keep the stay peaceful.",
    body: "The retreat is designed for a calm, private stay. Guest count and gatherings should be confirmed before arrival.",
    image: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
    faqs: [
      {
        icon: "guests",
        question: "Can I bring extra guests?",
        answer: "Only registered guests are allowed unless approved.",
      },
      {
        icon: "party",
        question: "Are parties allowed?",
        answer: "Parties and unauthorized events are not allowed.",
      },
      {
        icon: "calendar",
        question: "Are events allowed?",
        answer: "Events or gatherings must be approved in advance.",
      },
      {
        icon: "quiet",
        question: "Are quiet hours required?",
        answer: "Quiet hours help keep the stay peaceful for everyone.",
      },
    ],
  },
  {
    id: "faq-care",
    layout: "care",
    eyebrow: "Care",
    kicker: "Smoking, damage & space care",
    title: "Please treat the retreat with care.",
    body: "Some policies should be confirmed directly before booking, especially smoking, pets, fees, and special requests.",
    image: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
    faqs: [
      {
        icon: "smoke",
        question: "Is smoking allowed?",
        answer: "Smoking rules should be confirmed before booking.",
      },
      {
        icon: "damage",
        question: "What if something is damaged?",
        answer: "Guests are responsible for damages caused during the stay.",
      },
      {
        icon: "bath",
        question: "How should I treat the space?",
        answer:
          "Please care for the apartment, furniture, bathroom, and rooftop.",
      },
      {
        icon: "request",
        question: "Are pets allowed?",
        answer: "Pet policy should be confirmed before booking.",
      },
    ],
  },
  {
    id: "faq-transport",
    layout: "transport",
    eyebrow: "Getting Around",
    kicker: "Parking & movement",
    title: "Arrive, park, and move around with less stress.",
    body: "Airport transfer, private driver support, and parking can be discussed before the stay so planning feels easier.",
    image: `${imageBase}06-exterior-balcony-front-view.jpeg`,
    faqs: [
      {
        icon: "parking",
        question: "Is parking available?",
        answer: "Parking may be available subject to availability.",
      },
      {
        icon: "plane",
        question: "Are airport transfers available?",
        answer: "Airport transfers can be arranged on request.",
      },
      {
        icon: "car",
        question: "Can I request a private driver?",
        answer: "Private driver support may be available on request.",
      },
      {
        icon: "map",
        question: "Is the area easy to move from?",
        answer:
          "The retreat is positioned for access to Sakumono, Tema, Accra, beaches, and essentials.",
      },
    ],
  },
  {
    id: "faq-location",
    layout: "location",
    eyebrow: "Location Privacy",
    kicker: "Address & access",
    title: "The area is public. The exact access stays private.",
    body: "This protects guest privacy and property security while still helping visitors understand the general location before booking.",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    faqs: [
      {
        icon: "pin",
        question: "Where is the retreat located?",
        answer: "The retreat is located in Sakumono Estate, Ghana.",
      },
      {
        icon: "key",
        question: "Will I get the exact address?",
        answer: "The exact address is shared after booking confirmation.",
      },
      {
        icon: "shield",
        question: "Why not show the exact address publicly?",
        answer: "This protects guest privacy and property security.",
      },
      {
        icon: "map",
        question: "Can I see the general area?",
        answer: "Yes. The site can show the general Sakumono Estate area.",
      },
    ],
  },
  {
    id: "faq-amenities",
    layout: "amenities",
    eyebrow: "Amenities",
    kicker: "Included & optional",
    title: "Know what is included and what is on request.",
    body: "Core stay features are available, while extra services can be arranged separately depending on the request.",
    image: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
    faqs: [
      {
        icon: "wifi",
        question: "Is Wi-Fi included?",
        answer: "Wi-Fi is available for guests during the stay.",
      },
      {
        icon: "ac",
        question: "Is there air conditioning?",
        answer: "Air conditioning is available in the retreat.",
      },
      {
        icon: "kitchen",
        question: "Can I cook?",
        answer:
          "Kitchen access is available for flexible meals and longer stays.",
      },
      {
        icon: "service",
        question: "Are extra services included?",
        answer:
          "Optional services may cost extra and should be confirmed before booking.",
      },
    ],
  },
  {
    id: "faq-book",
    layout: "book",
    eyebrow: "Still have a question?",
    kicker: "Booking support",
    title: "Ready to check dates?",
    body: "Review the details, confirm any special requests, then check availability to start planning your stay.",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
    cta: true,
    cards: [
      {
        icon: "book",
        title: "Book Now",
        text: "Check dates and move toward reserving the retreat.",
      },
      {
        icon: "question",
        title: "Ask first",
        text: "Confirm special requests before final booking.",
      },
    ],
  },
];

function getBannerHeight() {
  const banner = document.querySelector(".luxe-header__banner");

  if (!banner) return 0;

  return Math.ceil(banner.getBoundingClientRect().height);
}

function getFullHeaderHeight() {
  const header = document.querySelector(".luxe-header");

  if (!header) return getBannerHeight();

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

function FaqIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    question: (
      <>
        <circle cx="12" cy="12" r="9" {...common} />
        <path
          d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8"
          {...common}
        />
        <path d="M12 17h.01" {...common} />
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
    book: (
      <>
        <path d="M7 3v3M17 3v3" {...common} />
        <rect x="4" y="5" width="16" height="15" rx="2.5" {...common} />
        <path d="M4 10h16M9 15l2 2 4-5" {...common} />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" {...common} />
        <path d="M12 7v5l3 2" {...common} />
      </>
    ),
    request: (
      <>
        <path d="M5 4h14v16H5z" {...common} />
        <path d="M8 8h8M8 12h8M8 16h4" {...common} />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="12" r="3.5" {...common} />
        <path d="M11.5 12H21M17 12v3M20 12v2" {...common} />
      </>
    ),
    guests: (
      <>
        <circle cx="9" cy="8" r="3" {...common} />
        <circle cx="16" cy="9" r="2.5" {...common} />
        <path d="M4 21a5 5 0 0 1 10 0M13 21a4 4 0 0 1 7 0" {...common} />
      </>
    ),
    party: (
      <>
        <path d="M6 21 12 3l6 18" {...common} />
        <path d="M8 15h8M9 12h6" {...common} />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v3M17 3v3" {...common} />
        <rect x="4" y="5" width="16" height="15" rx="2.5" {...common} />
        <path d="M4 10h16" {...common} />
      </>
    ),
    quiet: (
      <>
        <path d="M5 10v4h3l4 4V6L8 10H5Z" {...common} />
        <path d="M17 9l3 6M20 9l-3 6" {...common} />
      </>
    ),
    smoke: (
      <>
        <path d="M4 16h10M17 16h3M5 19h14" {...common} />
        <path d="M14 5c2 1 2 3 0 4M18 4c2 1.5 2 4 0 5.5" {...common} />
      </>
    ),
    damage: (
      <>
        <path d="M12 3 3 21h18L12 3Z" {...common} />
        <path d="M12 9v5M12 17h.01" {...common} />
      </>
    ),
    bath: (
      <>
        <path d="M5 12h14v3a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-3Z" {...common} />
        <path d="M8 12V7a3 3 0 0 1 6 0M14 7h2" {...common} />
      </>
    ),
    parking: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" {...common} />
        <path d="M10 17V7h4a3 3 0 0 1 0 6h-4" {...common} />
      </>
    ),
    plane: (
      <>
        <path d="M12 3v18M4 13l8-3 8 3M8 18l4-2 4 2" {...common} />
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
    pin: (
      <>
        <path
          d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
          {...common}
        />
        <circle cx="12" cy="10" r="2.4" {...common} />
      </>
    ),
    wifi: (
      <>
        <path d="M4 9.5a12 12 0 0 1 16 0" {...common} />
        <path d="M7.5 13a7 7 0 0 1 9 0" {...common} />
        <path d="M11 16.5a1.4 1.4 0 0 1 2 0" {...common} />
      </>
    ),
    ac: (
      <>
        <path d="M12 3v18M5 6l14 12M19 6 5 18" {...common} />
      </>
    ),
    kitchen: (
      <>
        <path d="M6 3v18M10 3v18M6 9h4" {...common} />
        <path d="M15 3v7a3 3 0 0 0 3 3v8" {...common} />
      </>
    ),
    service: (
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
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.question}
    </svg>
  );
}

export default function Faq() {
  const [activePanel, setActivePanel] = useState(0);
  const [panelHeight, setPanelHeight] = useState("100vh");
  const [headerCover, setHeaderCover] = useState("0px");

  const { theme, screens } = settings;

  const previousPanel = faqSlides[activePanel - 1];
  const nextPanel = faqSlides[activePanel + 1];

  const cssVars = useMemo(
    () => ({
      "--faq-black": theme.colors.black,
      "--faq-surface": theme.colors.surface,
      "--faq-surface-2": theme.colors.surface2,
      "--faq-copper": theme.colors.copper,
      "--faq-copper-light": theme.colors.copperLight,
      "--faq-sand": theme.colors.sand,
      "--faq-cream": theme.colors.cream,
      "--faq-muted": theme.colors.muted,
      "--faq-font-display": theme.typography.fontFamily.display,
      "--faq-font-body": theme.typography.fontFamily.body,
      "--faq-letter-normal": theme.typography.letterSpacing.normal,
      "--faq-letter-wide": theme.typography.letterSpacing.wide,
      "--faq-page-padding-sm": screens.layout.small.pagePaddingX,
      "--faq-page-padding-md": screens.layout.medium.pagePaddingX,
      "--faq-page-padding-lg": screens.layout.large.pagePaddingX,
      "--faq-page-max": screens.layout.large.pageMaxWidth,
      "--faq-transition": theme.transitions.default,
      "--faq-transition-slow": theme.transitions.slow,
      "--faq-panel-count": faqSlides.length,
      "--faq-panel-height": panelHeight,
      "--faq-header-cover": headerCover,
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
    function handleFaqPanelRequest(event) {
      const sectionId = event.detail?.sectionId;
      const targetId = event.detail?.targetId;

      if (sectionId !== "faq") return;

      if (targetId === "faq") {
        setActivePanel(0);
      }
    }

    window.addEventListener(
      "onePlusOne:stayPanelRequest",
      handleFaqPanelRequest,
    );

    return () => {
      window.removeEventListener(
        "onePlusOne:stayPanelRequest",
        handleFaqPanelRequest,
      );
    };
  }, []);

  function goToPanel(panelIndex) {
    setActivePanel(Math.max(0, Math.min(panelIndex, faqSlides.length - 1)));
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
      id="faq"
      className="faq-page"
      style={cssVars}
      data-horizontal-section="true"
    >
      <div className="faq-page__pin" onClick={handlePanelTap}>
        <div className="faq-page__progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${(activePanel + 1) / faqSlides.length})`,
            }}
          />
        </div>

        <div className="faq-page__counter" aria-hidden="true">
          <span>{String(activePanel + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(faqSlides.length).padStart(2, "0")}</span>
        </div>

        <nav className="faq-page__panel-controls" aria-label="FAQ slides">
          <button
            className="faq-page__carousel-button"
            type="button"
            aria-label="Previous FAQ slide"
            disabled={!previousPanel}
            onClick={() => goToPanel(activePanel - 1)}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            className="faq-page__carousel-button"
            type="button"
            aria-label="Next FAQ slide"
            disabled={!nextPanel}
            onClick={() => goToPanel(activePanel + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <div
          className="faq-page__track"
          style={{
            transform: `translate3d(-${activePanel * 100}vw, 0, 0)`,
          }}
        >
          {faqSlides.map((slide, index) => (
            <article
              id={slide.id}
              key={slide.id}
              className={`faq-page__panel faq-page__panel--${slide.layout} ${
                activePanel === index ? "is-active" : ""
              }`}
              data-horizontal-panel-index={index}
            >
              <div
                className="faq-page__panel-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              />

              <div className="faq-page__panel-scrim" aria-hidden="true" />

              <div className="faq-page__panel-inner">
                <div className="faq-page__copy">
                  <p className="faq-page__eyebrow">{slide.eyebrow}</p>
                  <p className="faq-page__kicker">{slide.kicker}</p>

                  <h2>{slide.title}</h2>

                  <p className="faq-page__body">{slide.body}</p>

                  {slide.cta ? (
                    <div className="faq-page__cta-row">
                      <a className="faq-page__cta-button" href="#availability">
                        <span>Book Now</span>
                        <FaqIcon name="book" />
                      </a>

                      <a
                        className="faq-page__secondary-button"
                        href="#availability"
                      >
                        <span>Check Availability</span>
                        <ArrowIcon />
                      </a>
                    </div>
                  ) : null}
                </div>

                {slide.faqs ? (
                  <div className="faq-page__faq-grid">
                    {slide.faqs.map((faq) => (
                      <div
                        className="faq-page__question-card"
                        key={faq.question}
                      >
                        <FaqIcon name={faq.icon} />
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : slide.cards ? (
                  <div className="faq-page__desk-grid">
                    {slide.cards.map((card) => (
                      <div className="faq-page__desk-card" key={card.title}>
                        <FaqIcon name={card.icon} />
                        <h3>{card.title}</h3>
                        <p>{card.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="faq-page__hero-card">
                    <FaqIcon name="question" />
                    <span>Concierge FAQ</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="faq-page__tap-hint" aria-hidden="true">
          Tap left or right to explore
        </div>
      </div>
    </section>
  );
}
