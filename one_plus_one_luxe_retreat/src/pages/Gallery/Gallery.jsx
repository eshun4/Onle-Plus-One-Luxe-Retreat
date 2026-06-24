import { useEffect, useMemo, useState } from "react";
import settings from "../../settings/settings";
import "./Gallery.css";

const imageBase = "/images/home/";

const galleryPhotos = [
  {
    id: "bedroom-wide",
    category: "Bedroom",
    title: "Queen bedroom wide view",
    caption: "A calm sleeping space with a warm luxury mood.",
    src: `${imageBase}20-bedroom-black-bed-wide-view.jpeg`,
  },
  {
    id: "bedroom-panorama",
    category: "Bedroom",
    title: "Bedroom window panorama",
    caption: "Natural light, privacy, and a relaxed retreat feel.",
    src: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
  },
  {
    id: "bedroom-detail",
    category: "Details",
    title: "Welcome basket detail",
    caption: "Small guest touches that make arrival feel personal.",
    src: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
  },
  {
    id: "living-open",
    category: "Living",
    title: "Open living room",
    caption: "A bright lounge for relaxing between plans.",
    src: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
  },
  {
    id: "living-door",
    category: "Living",
    title: "Living area sliding door",
    caption: "Indoor comfort with a clean modern layout.",
    src: `${imageBase}03-living-area-sliding-door-black-door.jpeg`,
  },
  {
    id: "kitchen-window",
    category: "Kitchen",
    title: "Kitchen window bar stools",
    caption: "A guest-ready kitchen for easy stays.",
    src: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
  },
  {
    id: "kitchen-breakfast",
    category: "Kitchen",
    title: "Breakfast bar setup",
    caption: "Simple meals, coffee, and flexible mornings.",
    src: `${imageBase}08-kitchen-breakfast-bar-snacks.jpeg`,
  },
  {
    id: "bath-luxury",
    category: "Bathroom",
    title: "Luxury bathtub",
    caption: "A spa-like bath moment inside the retreat.",
    src: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
  },
  {
    id: "bath-waterfall",
    category: "Bathroom",
    title: "Waterfall wall bathtub",
    caption: "A strong visual feature for memorable stays.",
    src: `${imageBase}15-bathtub-waterfall-wall-angle.jpeg`,
  },
  {
    id: "bath-glass",
    category: "Bathroom",
    title: "Glass bathroom wide view",
    caption: "Clean finishes with a premium feel.",
    src: `${imageBase}18-bathroom-glass-window-wide.jpeg`,
  },
  {
    id: "rooftop-gazebo",
    category: "Rooftop",
    title: "Rooftop terrace",
    caption: "Outdoor relaxation for morning coffee or evening breeze.",
    src: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
  },
  {
    id: "exterior-balcony",
    category: "Exterior",
    title: "Exterior balcony view",
    caption: "A private apartment setting in Sakumono Estate.",
    src: `${imageBase}06-exterior-balcony-front-view.jpeg`,
  },
];

const categoryTabs = [
  "All",
  "Bedroom",
  "Living",
  "Kitchen",
  "Bathroom",
  "Rooftop",
  "Details",
  "Exterior",
];

const galleryPanels = [
  { id: "gallery-intro", type: "intro" },
  { id: "gallery-filter", type: "filter" },
  { id: "gallery-bedroom", type: "bedroom" },
  { id: "gallery-living", type: "living" },
  { id: "gallery-bathroom", type: "bathroom" },
  { id: "gallery-rooftop", type: "rooftop" },
  { id: "gallery-full", type: "full" },
  { id: "gallery-book", type: "book" },
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

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 7l1.4-2h5.2L16 7h2.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-7A2.5 2.5 0 0 1 5.5 7H8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 12s3.4-6 9-6 9 6 9 6-3.4 6-9 6-9-6-9-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Gallery() {
  const [activePanel, setActivePanel] = useState(0);
  const [panelHeight, setPanelHeight] = useState("100vh");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { theme, screens } = settings;

  const previousPanel = galleryPanels[activePanel - 1];
  const nextPanel = galleryPanels[activePanel + 1];

  const filteredPhotos =
    selectedCategory === "All"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === selectedCategory);

  const featuredPhoto = filteredPhotos[0] || galleryPhotos[0];

  const activeLightboxPhoto =
    typeof lightboxIndex === "number" ? galleryPhotos[lightboxIndex] : null;

  const cssVars = useMemo(
    () => ({
      "--gallery-black": theme.colors.black,
      "--gallery-surface": theme.colors.surface,
      "--gallery-surface-2": theme.colors.surface2,
      "--gallery-copper": theme.colors.copper,
      "--gallery-copper-light": theme.colors.copperLight,
      "--gallery-sand": theme.colors.sand,
      "--gallery-cream": theme.colors.cream,
      "--gallery-muted": theme.colors.muted,
      "--gallery-font-display": theme.typography.fontFamily.display,
      "--gallery-font-body": theme.typography.fontFamily.body,
      "--gallery-letter-normal": theme.typography.letterSpacing.normal,
      "--gallery-letter-wide": theme.typography.letterSpacing.wide,
      "--gallery-page-padding-sm": screens.layout.small.pagePaddingX,
      "--gallery-page-padding-md": screens.layout.medium.pagePaddingX,
      "--gallery-page-padding-lg": screens.layout.large.pagePaddingX,
      "--gallery-page-max": screens.layout.large.pageMaxWidth,
      "--gallery-transition": theme.transitions.default,
      "--gallery-transition-slow": theme.transitions.slow,
      "--gallery-panel-count": galleryPanels.length,
      "--gallery-panel-height": panelHeight,
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
    const safePanelIndex = Math.max(
      0,
      Math.min(panelIndex, galleryPanels.length - 1),
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

  function openLightbox(photoId) {
    const photoIndex = galleryPhotos.findIndex((photo) => photo.id === photoId);

    if (photoIndex >= 0) {
      setLightboxIndex(photoIndex);
    }
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function goLightbox(direction) {
    if (typeof lightboxIndex !== "number") return;

    const nextIndex =
      (lightboxIndex + direction + galleryPhotos.length) % galleryPhotos.length;

    setLightboxIndex(nextIndex);
  }

  return (
    <section
      id="gallery"
      className="gallery-page"
      style={cssVars}
      data-horizontal-section="true"
    >
      <div className="gallery-page__pin" onClick={handlePanelTap}>
        <div className="gallery-page__progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${(activePanel + 1) / galleryPanels.length})`,
            }}
          />
        </div>

        <div className="gallery-page__counter" aria-hidden="true">
          <span>{String(activePanel + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(galleryPanels.length).padStart(2, "0")}</span>
        </div>

        <nav
          className="gallery-page__panel-controls"
          aria-label="Gallery slides"
        >
          <button
            className="gallery-page__carousel-button"
            type="button"
            aria-label="Previous gallery slide"
            disabled={!previousPanel}
            onClick={() => goToPanel(activePanel - 1)}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            className="gallery-page__carousel-button"
            type="button"
            aria-label="Next gallery slide"
            disabled={!nextPanel}
            onClick={() => goToPanel(activePanel + 1)}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <div
          className="gallery-page__track"
          style={{
            transform: `translate3d(-${activePanel * 100}vw, 0, 0)`,
          }}
        >
          <article className="gallery-page__panel gallery-page__panel--intro">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[1].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__intro-copy">
                <p className="gallery-page__eyebrow">Gallery</p>
                <p className="gallery-page__kicker">Photo tour</p>

                <h2>See the retreat before you arrive.</h2>

                <p className="gallery-page__body">
                  Explore the bedroom, living area, kitchen, bathroom, rooftop,
                  and guest details through a curated visual tour of One Plus
                  One Luxe Retreat.
                </p>
              </div>

              <div className="gallery-page__hero-stack">
                {[galleryPhotos[7], galleryPhotos[10], galleryPhotos[2]].map(
                  (photo) => (
                    <button
                      className="gallery-page__stack-photo"
                      type="button"
                      key={photo.id}
                      onClick={() => openLightbox(photo.id)}
                    >
                      <img src={photo.src} alt={photo.title} />
                      <span>{photo.category}</span>
                    </button>
                  ),
                )}
              </div>

              <div className="gallery-page__mini-stats">
                <span>
                  <strong>12</strong>
                  Curated photos
                </span>
                <span>
                  <strong>7</strong>
                  Visual zones
                </span>
                <span>
                  <strong>Full</strong>
                  Screen preview
                </span>
              </div>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--filter">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${featuredPhoto.src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__filter-copy">
                <p className="gallery-page__eyebrow">Browse by space</p>
                <h2>Choose a room, then inspect the mood.</h2>
              </div>

              <div className="gallery-page__filter-shell">
                <div
                  className="gallery-page__tabs"
                  aria-label="Gallery categories"
                >
                  {categoryTabs.map((category) => (
                    <button
                      className={`gallery-page__tab ${
                        selectedCategory === category ? "is-active" : ""
                      }`}
                      type="button"
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <button
                  className="gallery-page__featured-photo"
                  type="button"
                  onClick={() => openLightbox(featuredPhoto.id)}
                >
                  <img src={featuredPhoto.src} alt={featuredPhoto.title} />

                  <span>
                    <EyeIcon />
                    View large
                  </span>
                </button>

                <div className="gallery-page__thumb-row">
                  {filteredPhotos.slice(0, 5).map((photo) => (
                    <button
                      type="button"
                      className="gallery-page__thumb"
                      key={photo.id}
                      onClick={() => openLightbox(photo.id)}
                    >
                      <img src={photo.src} alt={photo.title} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--bedroom">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[0].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__editorial-copy">
                <p className="gallery-page__eyebrow">Bedroom</p>
                <p className="gallery-page__kicker">Rest zone</p>
                <h2>Quiet nights, warm light, and a queen bed.</h2>
                <p className="gallery-page__body">
                  The bedroom images sell comfort first: the bed, the natural
                  light, the styling, and the peaceful feeling guests expect
                  before booking.
                </p>
              </div>

              <div className="gallery-page__editorial-grid">
                {[galleryPhotos[0], galleryPhotos[1], galleryPhotos[2]].map(
                  (photo) => (
                    <button
                      type="button"
                      className="gallery-page__editorial-image"
                      key={photo.id}
                      onClick={() => openLightbox(photo.id)}
                    >
                      <img src={photo.src} alt={photo.title} />
                      <span>{photo.title}</span>
                    </button>
                  ),
                )}
              </div>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--living">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[3].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__split-image gallery-page__split-image--left">
                <button
                  type="button"
                  onClick={() => openLightbox("living-open")}
                >
                  <img
                    src={galleryPhotos[3].src}
                    alt={galleryPhotos[3].title}
                  />
                </button>
              </div>

              <div className="gallery-page__center-copy">
                <p className="gallery-page__eyebrow">Living & Kitchen</p>
                <p className="gallery-page__kicker">Daily comfort</p>
                <h2>Relax, cook, watch, reset.</h2>
                <p className="gallery-page__body">
                  Show the practical parts of the apartment without making them
                  feel ordinary: lounge comfort, streaming access, kitchen
                  flexibility, and easy mornings.
                </p>
              </div>

              <div className="gallery-page__split-image gallery-page__split-image--right">
                <button
                  type="button"
                  onClick={() => openLightbox("kitchen-window")}
                >
                  <img
                    src={galleryPhotos[5].src}
                    alt={galleryPhotos[5].title}
                  />
                </button>
              </div>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--bathroom">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[7].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <button
                type="button"
                className="gallery-page__cinema-photo"
                onClick={() => openLightbox("bath-luxury")}
              >
                <img src={galleryPhotos[7].src} alt={galleryPhotos[7].title} />
                <span>Luxury bathtub</span>
              </button>

              <div className="gallery-page__bath-copy">
                <p className="gallery-page__eyebrow">Bathroom</p>
                <p className="gallery-page__kicker">Spa moment</p>
                <h2>The photo that makes guests pause.</h2>
                <p className="gallery-page__body">
                  The bathtub and waterfall wall should be treated like a key
                  selling image. It gives the retreat a stronger luxury
                  identity.
                </p>
              </div>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--rooftop">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[10].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__rooftop-copy">
                <p className="gallery-page__eyebrow">Rooftop</p>
                <p className="gallery-page__kicker">Outdoor escape</p>
                <h2>Morning coffee and evening breeze.</h2>
                <p className="gallery-page__body">
                  The rooftop images give guests a reason to imagine themselves
                  outside the apartment, relaxing above the everyday noise.
                </p>
              </div>

              <button
                type="button"
                className="gallery-page__wide-photo"
                onClick={() => openLightbox("rooftop-gazebo")}
              >
                <img
                  src={galleryPhotos[10].src}
                  alt={galleryPhotos[10].title}
                />
                <span>Rooftop terrace</span>
              </button>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--full">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[8].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__full-copy">
                <p className="gallery-page__eyebrow">Full gallery</p>
                <p className="gallery-page__kicker">Click to inspect</p>
                <h2>Open any image in full view.</h2>
              </div>

              <div className="gallery-page__mosaic">
                {galleryPhotos.map((photo) => (
                  <button
                    type="button"
                    className="gallery-page__mosaic-photo"
                    key={photo.id}
                    onClick={() => openLightbox(photo.id)}
                  >
                    <img src={photo.src} alt={photo.title} />
                    <span>{photo.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </article>

          <article className="gallery-page__panel gallery-page__panel--book">
            <div
              className="gallery-page__panel-bg"
              style={{ backgroundImage: `url(${galleryPhotos[11].src})` }}
              aria-hidden="true"
            />
            <div className="gallery-page__panel-scrim" aria-hidden="true" />

            <div className="gallery-page__panel-inner">
              <div className="gallery-page__book-card">
                <CameraIcon />

                <p className="gallery-page__eyebrow">Like what you see?</p>

                <h2>Book the retreat after the photo tour.</h2>

                <p className="gallery-page__body">
                  Once guests have seen the bedroom, bathtub, kitchen, rooftop,
                  and details, the next step is to check dates and book.
                </p>

                <a className="gallery-page__cta-button" href="#availability">
                  <span>Book Now</span>
                  <BookIcon />
                </a>
              </div>
            </div>
          </article>
        </div>

        <div className="gallery-page__tap-hint" aria-hidden="true">
          Tap left or right to explore
        </div>
      </div>

      {activeLightboxPhoto ? (
        <div className="gallery-page__lightbox" role="dialog" aria-modal="true">
          <div
            className="gallery-page__lightbox-backdrop"
            onClick={closeLightbox}
          />

          <div className="gallery-page__lightbox-content">
            <button
              className="gallery-page__lightbox-close"
              type="button"
              aria-label="Close image preview"
              onClick={closeLightbox}
            >
              <CloseIcon />
            </button>

            <button
              className="gallery-page__lightbox-arrow gallery-page__lightbox-arrow--left"
              type="button"
              aria-label="Previous image"
              onClick={() => goLightbox(-1)}
            >
              <ArrowIcon direction="left" />
            </button>

            <img
              src={activeLightboxPhoto.src}
              alt={activeLightboxPhoto.title}
            />

            <button
              className="gallery-page__lightbox-arrow gallery-page__lightbox-arrow--right"
              type="button"
              aria-label="Next image"
              onClick={() => goLightbox(1)}
            >
              <ArrowIcon direction="right" />
            </button>

            <div className="gallery-page__lightbox-caption">
              <span>{activeLightboxPhoto.category}</span>
              <strong>{activeLightboxPhoto.title}</strong>
              <p>{activeLightboxPhoto.caption}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
