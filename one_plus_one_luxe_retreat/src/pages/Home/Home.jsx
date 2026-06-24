import { useEffect, useMemo, useRef, useState } from "react";
import settings from "../../settings/settings";
import "./Home.css";

const imageBase = "/images/home/";

const slides = [
  {
    name: "Suite",
    color: "#2a211b",
    image: `${imageBase}20-bedroom-black-bed-wide-view.jpeg`,
    caption:
      "Sink into a soft, quiet bedroom made for slow mornings and restful nights.",
    description: "Soft linens · warm tones · peaceful rest",
    location: "One Plus One Luxe Resort",
  },
  {
    name: "Retreat",
    color: "#5f4a37",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
    caption:
      "Wake up beside wide windows, warm textures, and a view that feels private.",
    description: "Wide windows · calm light · private comfort",
    location: "Luxury bedroom suite",
  },
  {
    name: "Arrival",
    color: "#1a1612",
    image: `${imageBase}02-entryway-hanging-chair-black-door.jpeg`,
    caption:
      "Step into a relaxed welcome corner with modern charm and resort ease.",
    description: "Private entry · hanging chair · quiet welcome",
    location: "Resort entrance lounge",
  },
  {
    name: "Lounge",
    color: "#3b342d",
    image: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
    caption:
      "Stretch out in a cozy living space built for movies, laughter, and rest.",
    description: "Open living · smart TV · soft seating",
    location: "Modern living space",
  },
  {
    name: "Kitchen",
    color: "#6a5744",
    image: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
    caption:
      "Start your day around a polished kitchen made for coffee, bites, and ease.",
    description: "Breakfast bar · clean finishes · easy mornings",
    location: "Guest-ready kitchen",
  },
  {
    name: "Terrace",
    color: "#403a32",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    caption:
      "Unwind above it all with open air, skyline moments, and golden-hour calm.",
    description: "Open air · rooftop views · evening breeze",
    location: "Rooftop lounge deck",
  },
  {
    name: "Bath",
    color: "#12201a",
    image: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
    caption:
      "Slip into a spa-style bath framed by glass, water views, and deep calm.",
    description: "Freestanding tub · glass view · spa mood",
    location: "Luxury bathroom suite",
  },
  {
    name: "Welcome",
    color: "#6d4d2f",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
    caption:
      "Arrive to thoughtful details that make the stay feel personal from the start.",
    description: "Curated basket · thoughtful details · soft textures",
    location: "Guest welcome setup",
  },
];

function getRelativePosition(index, currentIndex, total) {
  let position = index - currentIndex;

  if (position > total / 2) {
    position -= total;
  }

  if (position < -total / 2) {
    position += total;
  }

  return position;
}

function getSlideClass(position) {
  if (position === 0) return "home-slider__slide home-slider__slide--active";
  if (position === -1) return "home-slider__slide home-slider__slide--prev";
  if (position === 1) return "home-slider__slide home-slider__slide--next";
  if (position === -2) return "home-slider__slide home-slider__slide--far-prev";
  if (position === 2) return "home-slider__slide home-slider__slide--far-next";

  return "home-slider__slide home-slider__slide--hidden";
}

function splitTitle(title) {
  return [...title].map((character, index) => (
    <span
      key={`${title}-${character}-${index}`}
      style={{ "--char-index": index }}
    >
      {character === " " ? "\u00A0" : character}
    </span>
  ));
}

export default function Home() {
  const { theme, home } = settings;
  const sliderSettings = home.slider;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [captionVisible, setCaptionVisible] = useState(false);

  const lastWheelTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const autoPlayRef = useRef(null);
  const captionTimerRef = useRef(null);
  const slideTimerRef = useRef(null);
  const pausedRef = useRef(false);
  const changingRef = useRef(false);

  const currentSlide = slides[currentIndex];

  const cssVars = useMemo(
    () => ({
      "--home-black": theme.colors.black,
      "--home-surface": theme.colors.surface,
      "--home-surface-2": theme.colors.surface2,
      "--home-copper": theme.colors.copper,
      "--home-copper-light": theme.colors.copperLight,
      "--home-sand": theme.colors.sand,
      "--home-cream": theme.colors.cream,
      "--home-muted": theme.colors.muted,
      "--home-font-display": theme.typography.fontFamily.display,
      "--home-font-body": theme.typography.fontFamily.body,
      "--home-letter-normal": theme.typography.letterSpacing.normal,
      "--home-letter-wide": theme.typography.letterSpacing.wide,
      "--home-transition-ms": `${sliderSettings.transitionMs}ms`,
      backgroundColor: currentSlide.color,
    }),
    [theme, sliderSettings.transitionMs, currentSlide.color],
  );

  function clearAutoPlay() {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }

  function startAutoPlay() {
    clearAutoPlay();

    if (pausedRef.current) {
      return;
    }

    autoPlayRef.current = setInterval(() => {
      requestSlide("next");
    }, sliderSettings.autoPlayDelay);
  }

  function pauseSlider() {
    pausedRef.current = true;
    clearAutoPlay();
  }

  function resumeSlider() {
    pausedRef.current = false;
    startAutoPlay();
  }

  function goToSlide(nextDirection) {
    setDirection(nextDirection);

    setCurrentIndex((previousIndex) => {
      if (nextDirection === "next") {
        return (previousIndex + 1) % slides.length;
      }

      return (previousIndex - 1 + slides.length) % slides.length;
    });
  }

  function requestSlide(nextDirection, options = {}) {
    const { force = false } = options;

    if (changingRef.current) {
      return;
    }

    if (pausedRef.current && !force) {
      return;
    }

    changingRef.current = true;
    setCaptionVisible(false);

    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    slideTimerRef.current = setTimeout(() => {
      goToSlide(nextDirection);

      setTimeout(() => {
        changingRef.current = false;
      }, sliderSettings.transitionMs);
    }, 360);
  }

  useEffect(() => {
    startAutoPlay();

    return () => {
      clearAutoPlay();

      if (captionTimerRef.current) {
        clearTimeout(captionTimerRef.current);
      }

      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCaptionVisible(false);

    if (captionTimerRef.current) {
      clearTimeout(captionTimerRef.current);
    }

    captionTimerRef.current = setTimeout(() => {
      setCaptionVisible(true);
    }, sliderSettings.transitionMs + 160);

    return () => {
      if (captionTimerRef.current) {
        clearTimeout(captionTimerRef.current);
      }
    };
  }, [currentIndex, sliderSettings.transitionMs]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (pausedRef.current) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        requestSlide("next");
        startAutoPlay();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        requestSlide("prev");
        startAutoPlay();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleWheel(event) {
    event.preventDefault();

    if (pausedRef.current) {
      return;
    }

    const now = Date.now();

    if (now - lastWheelTimeRef.current < sliderSettings.wheelThrottle) {
      return;
    }

    lastWheelTimeRef.current = now;

    if (event.deltaY > 0) {
      requestSlide("next");
    } else {
      requestSlide("prev");
    }

    startAutoPlay();
  }

  function handleTouchStart(event) {
    touchStartYRef.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event) {
    const touchEndY = event.changedTouches[0].clientY;
    const difference = touchStartYRef.current - touchEndY;

    if (Math.abs(difference) < sliderSettings.swipeThreshold) {
      return;
    }

    if (difference > 0) {
      requestSlide("next", { force: true });
    } else {
      requestSlide("prev", { force: true });
    }

    startAutoPlay();
  }

  return (
    <main
      id="home"
      className={`home-slider home-slider--${direction}`}
      style={cssVars}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-native-scroll="true"
    >
      <div
        key={currentSlide.image}
        className="home-slider__backdrop"
        style={{ backgroundImage: `url(${currentSlide.image})` }}
        aria-hidden="true"
      />

      <div className="home-slider__scrim" aria-hidden="true" />

      <section className="home-slider__body" aria-label="Home showcase slider">
        <div className="home-slider__left">
          <p className="home-slider__eyebrow">
            One Plus One Luxe Resort · Private stays
          </p>

          <div
            className={`home-slider__headline ${
              captionVisible ? "is-caption-visible" : ""
            }`}
            onMouseEnter={pauseSlider}
            onMouseLeave={resumeSlider}
          >
            <h1 className="home-slider__title" aria-live="polite">
              {splitTitle(currentSlide.name)}
            </h1>

            <div key={currentSlide.name} className="home-slider__caption">
              <span className="home-slider__caption-dot" />
              <span className="home-slider__caption-line home-slider__caption-line--left" />
              <span className="home-slider__caption-line home-slider__caption-line--right" />
              <span className="home-slider__caption-bracket home-slider__caption-bracket--left" />
              <span className="home-slider__caption-bracket home-slider__caption-bracket--right" />

              <p className="home-slider__caption-kicker">
                Stay inside the moment
              </p>

              <p className="home-slider__caption-text">
                {currentSlide.caption}
              </p>
            </div>
          </div>

          <div className="home-slider__footer">
            <div className="home-slider__info">
              <p className="home-slider__description">
                {currentSlide.description}
              </p>

              <p className="home-slider__location">{currentSlide.location}</p>
            </div>

            <div
              className="home-slider__controls"
              aria-label="Slider controls"
              onMouseEnter={pauseSlider}
              onMouseLeave={resumeSlider}
              onFocus={pauseSlider}
              onBlur={resumeSlider}
            >
              <button
                className="home-slider__control"
                type="button"
                onClick={() => {
                  requestSlide("prev", { force: true });
                  startAutoPlay();
                }}
                aria-label="Previous slide"
              >
                Prev
              </button>

              <span className="home-slider__counter">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>

              <button
                className="home-slider__control"
                type="button"
                onClick={() => {
                  requestSlide("next", { force: true });
                  startAutoPlay();
                }}
                aria-label="Next slide"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="home-slider__right" aria-hidden="true">
          <div className="home-slider__images">
            {slides.map((slide, index) => {
              const position = getRelativePosition(
                index,
                currentIndex,
                slides.length,
              );

              return (
                <figure
                  key={slide.image}
                  className={getSlideClass(position)}
                  style={{ "--slide-position": position }}
                >
                  <img src={slide.image} alt="" />
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
