import { useEffect, useMemo, useState } from "react";
import settings from "../../settings/settings";
import "./Stay.css";

const imageBase = "/images/home/";

const stayPanels = [
  {
    id: "stay-overview",
    layout: "arrival",
    eyebrow: "The Stay",
    kicker: "Sakumono Estate · Ghana",
    title: "A private rooftop luxe retreat.",
    body: "One Plus One Luxe Retreat is a modern one-bedroom private apartment designed for comfort, privacy, and memorable stays near beaches, restaurants, shopping, Tema, and Accra.",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
    stats: [
      "Private one-bedroom apartment",
      "Queen-size bed",
      "Luxury bathtub",
      "Private balcony",
    ],
  },
  {
    id: "stay-bedroom",
    layout: "bedroom",
    eyebrow: "Bedroom",
    kicker: "Rest",
    title: "A calm queen bedroom for quiet nights.",
    body: "The retreat includes a spacious bedroom with a comfortable queen-size bed, warm styling, and a peaceful atmosphere for slow mornings or restful evenings.",
    image: `${imageBase}20-bedroom-black-bed-wide-view.jpeg`,
    stats: [
      "Queen-size bed",
      "Private bedroom",
      "Soft room mood",
      "Ideal for couples",
    ],
  },
  {
    id: "stay-living",
    layout: "lounge",
    eyebrow: "Living Area",
    kicker: "Relax",
    title: "A bright lounge between plans.",
    body: "Guests can relax in the living room, watch the Smart TV with streaming access, or enjoy a calm indoor space after time in Accra, Tema, or nearby beaches.",
    image: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
    stats: [
      "Spacious living room",
      "Smart TV",
      "Streaming access",
      "Comfortable lounge",
    ],
  },
  {
    id: "stay-kitchen",
    layout: "kitchen",
    eyebrow: "Kitchen",
    kicker: "Ease",
    title: "A fully equipped kitchen for easy stays.",
    body: "The apartment includes a guest-ready kitchen for coffee, light meals, groceries, and longer stays where comfort and flexibility matter.",
    image: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
    stats: [
      "Fully equipped kitchen",
      "Breakfast bar",
      "Guest essentials",
      "Easy meal setup",
    ],
  },
  {
    id: "stay-bath",
    layout: "bath",
    eyebrow: "Bathroom",
    kicker: "Soak",
    title: "A luxury bathtub with a spa-like feel.",
    body: "The bathroom is one of the retreat’s strongest features, with a soaking bathtub and relaxing finishes designed to make the stay feel more memorable.",
    image: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
    stats: [
      "Luxury bathtub",
      "Bathroom essentials",
      "Clean finishes",
      "Relaxing bath mood",
    ],
  },
  {
    id: "stay-rooftop",
    layout: "rooftop",
    eyebrow: "Balcony & Rooftop",
    kicker: "Breeze",
    title: "Private outdoor moments above the city.",
    body: "Guests can enjoy a private balcony and access to a spacious rooftop terrace, ideal for morning coffee, evening breeze, or quiet conversation.",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    stats: [
      "Private balcony",
      "Rooftop terrace",
      "Outdoor lounge",
      "Evening relaxation",
    ],
  },
  {
    id: "availability",
    layout: "booking",
    eyebrow: "Guest Details",
    kicker: "Plan",
    title: "Everything needed for a smooth stay.",
    body: "Guests have full access to the apartment, rooftop terrace, and parking area. Check-in is from 3:00 PM, checkout is at 11:00 AM, and gatherings require prior approval from management.",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
    stats: [
      "High-speed Wi-Fi",
      "Air conditioning",
      "Free parking, subject to availability",
      "Extra services on request",
    ],
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

function BookIcon() {
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
        d="M9 15l2 2 4-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Stay() {
  const [activePanel, setActivePanel] = useState(0);
  const [panelHeight, setPanelHeight] = useState("100vh");

  const { theme, screens } = settings;

  const previousPanel = stayPanels[activePanel - 1];
  const nextPanel = stayPanels[activePanel + 1];

  const cssVars = useMemo(
    () => ({
      "--stay-black": theme.colors.black,
      "--stay-surface": theme.colors.surface,
      "--stay-surface-2": theme.colors.surface2,
      "--stay-copper": theme.colors.copper,
      "--stay-copper-light": theme.colors.copperLight,
      "--stay-sand": theme.colors.sand,
      "--stay-cream": theme.colors.cream,
      "--stay-muted": theme.colors.muted,
      "--stay-font-display": theme.typography.fontFamily.display,
      "--stay-font-body": theme.typography.fontFamily.body,
      "--stay-letter-normal": theme.typography.letterSpacing.normal,
      "--stay-letter-wide": theme.typography.letterSpacing.wide,
      "--stay-page-padding-sm": screens.layout.small.pagePaddingX,
      "--stay-page-padding-md": screens.layout.medium.pagePaddingX,
      "--stay-page-padding-lg": screens.layout.large.pagePaddingX,
      "--stay-page-max": screens.layout.large.pageMaxWidth,
      "--stay-transition": theme.transitions.default,
      "--stay-transition-slow": theme.transitions.slow,
      "--stay-panel-count": stayPanels.length,
      "--stay-panel-height": panelHeight,
    }),
    [theme, screens, panelHeight],
  );

  useEffect(() => {
    function updatePanelHeight() {
      const bannerHeight = getBannerHeight();
      const nextPanelHeight = Math.max(420, window.innerHeight - bannerHeight);

      setPanelHeight(`${nextPanelHeight}px`);
    }

    updatePanelHeight();

    window.addEventListener("resize", updatePanelHeight);

    return () => {
      window.removeEventListener("resize", updatePanelHeight);
    };
  }, []);

  useEffect(() => {
    function handleStayPanelRequest(event) {
      const targetId = event.detail?.targetId;

      if (targetId === "stay") {
        setActivePanel(0);
        return;
      }

      const requestedPanelIndex = stayPanels.findIndex(
        (panel) => panel.id === targetId,
      );

      if (requestedPanelIndex >= 0) {
        setActivePanel(requestedPanelIndex);
      }
    }

    window.addEventListener(
      "onePlusOne:stayPanelRequest",
      handleStayPanelRequest,
    );

    return () => {
      window.removeEventListener(
        "onePlusOne:stayPanelRequest",
        handleStayPanelRequest,
      );
    };
  }, []);

  function goToPanel(panelIndex) {
    const safePanelIndex = Math.max(
      0,
      Math.min(panelIndex, stayPanels.length - 1),
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

    const tapX = event.clientX;
    const screenMiddle = window.innerWidth / 2;

    if (tapX < screenMiddle) {
      goToPanel(activePanel - 1);
    } else {
      goToPanel(activePanel + 1);
    }
  }

  return (
    <section
      id="stay"
      className="stay-page"
      style={cssVars}
      data-horizontal-section="true"
    >
      <div className="stay-page__pin" onClick={handlePanelTap}>
        <div className="stay-page__progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${(activePanel + 1) / stayPanels.length})`,
            }}
          />
        </div>

        <div className="stay-page__counter" aria-hidden="true">
          <span>{String(activePanel + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(stayPanels.length).padStart(2, "0")}</span>
        </div>

        <nav className="stay-page__panel-controls" aria-label="Stay sections">
          <button
            className="stay-page__carousel-button"
            type="button"
            aria-label="Previous stay section"
            disabled={!previousPanel}
            onClick={() => goToPanel(activePanel - 1)}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            className="stay-page__carousel-button"
            type="button"
            aria-label="Next stay section"
            disabled={!nextPanel}
            onClick={() => goToPanel(activePanel + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <div
          className="stay-page__track"
          style={{
            transform: `translate3d(-${activePanel * 100}vw, 0, 0)`,
          }}
        >
          {stayPanels.map((panel, index) => (
            <article
              id={panel.id}
              className={`stay-page__panel stay-page__panel--${panel.layout} ${
                activePanel === index ? "is-active" : ""
              }`}
              key={panel.id}
              data-horizontal-panel-index={index}
            >
              <div
                className="stay-page__panel-bg"
                style={{ backgroundImage: `url(${panel.image})` }}
                aria-hidden="true"
              />

              <div className="stay-page__panel-scrim" aria-hidden="true" />

              <div className="stay-page__panel-inner">
                <div className="stay-page__copy">
                  <p className="stay-page__eyebrow">{panel.eyebrow}</p>

                  <p className="stay-page__kicker">{panel.kicker}</p>

                  <h2>{panel.title}</h2>

                  <p className="stay-page__body">{panel.body}</p>

                  {panel.cta ? (
                    <a className="stay-page__cta-button" href="#faq">
                      <span>Book Now</span>
                      <BookIcon />
                    </a>
                  ) : null}
                </div>

                <div className="stay-page__card">
                  <span className="stay-page__card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{panel.eyebrow}</h3>

                  <ul>
                    {panel.stats.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="stay-page__tap-hint" aria-hidden="true">
          Tap left or right to explore
        </div>
      </div>
    </section>
  );
}
