import { useEffect, useMemo, useRef, useState } from "react";
import settings from "../../settings/settings";
import "./Home.css";

const imageBase = "/images/home/";

const slides = [
  {
    name: "Luxe",
    color: "#2a211b",
    image: `${imageBase}20-bedroom-black-bed-wide-view.jpeg`,
    description: "Private retreat · soft linens · city light views",
    location: "One Plus One Luxe Resort",
  },
  {
    name: "Calm",
    color: "#5f4a37",
    image: `${imageBase}oplr_batch02_luxe_bedroom_window_panorama.jpeg`,
    description: "Floor-to-ceiling curtains · warm neutral finishes",
    location: "Luxury bedroom suite",
  },
  {
    name: "Arrival",
    color: "#1a1612",
    image: `${imageBase}02-entryway-hanging-chair-black-door.jpeg`,
    description: "Private entry · hanging chair · quiet welcome",
    location: "Resort entrance lounge",
  },
  {
    name: "Living",
    color: "#3b342d",
    image: `${imageBase}05-open-living-room-tv-sofa.jpeg`,
    description: "Open living room · smart TV · soft lounge seating",
    location: "Modern living space",
  },
  {
    name: "Kitchen",
    color: "#6a5744",
    image: `${imageBase}10-kitchen-window-bar-stools.jpeg`,
    description: "Compact kitchen · breakfast bar · premium appliances",
    location: "Guest-ready kitchen",
  },
  {
    name: "Rooftop",
    color: "#403a32",
    image: `${imageBase}07-rooftop-terrace-gazebo.jpeg`,
    description: "Open-air terrace · skyline views · evening breeze",
    location: "Rooftop lounge deck",
  },
  {
    name: "Spa",
    color: "#12201a",
    image: `${imageBase}16-luxury-bathtub-waterfall-view.jpeg`,
    description: "Freestanding tub · glass wall · waterfall mood",
    location: "Luxury bathroom suite",
  },
  {
    name: "Welcome",
    color: "#6d4d2f",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
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

  const lastWheelTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const autoPlayRef = useRef(null);

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

  function goToSlide(nextDirection) {
    setDirection(nextDirection);

    setCurrentIndex((previousIndex) => {
      if (nextDirection === "next") {
        return (previousIndex + 1) % slides.length;
      }

      return (previousIndex - 1 + slides.length) % slides.length;
    });
  }

  function restartAutoPlay() {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    autoPlayRef.current = setInterval(() => {
      goToSlide("next");
    }, sliderSettings.autoPlayDelay);
  }

  useEffect(() => {
    restartAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        goToSlide("next");
        restartAutoPlay();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        goToSlide("prev");
        restartAutoPlay();
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

    const now = Date.now();

    if (now - lastWheelTimeRef.current < sliderSettings.wheelThrottle) {
      return;
    }

    lastWheelTimeRef.current = now;

    if (event.deltaY > 0) {
      goToSlide("next");
    } else {
      goToSlide("prev");
    }

    restartAutoPlay();
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
      goToSlide("next");
    } else {
      goToSlide("prev");
    }

    restartAutoPlay();
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

          <h1 className="home-slider__title" aria-live="polite">
            {splitTitle(currentSlide.name)}
          </h1>

          <div className="home-slider__footer">
            <div className="home-slider__info">
              <p className="home-slider__description">
                {currentSlide.description}
              </p>

              <p className="home-slider__location">{currentSlide.location}</p>
            </div>

            <div className="home-slider__controls" aria-label="Slider controls">
              <button
                className="home-slider__control"
                type="button"
                onClick={() => {
                  goToSlide("prev");
                  restartAutoPlay();
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
                  goToSlide("next");
                  restartAutoPlay();
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
