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
    eyebrow: "Check Availability",
    kicker: "Request your dates",
    title: "Check your dates before booking.",
    body: "Choose your preferred dates, add guest details, and continue on WhatsApp. The host will confirm availability manually before any booking is treated as confirmed.",
    image: `${imageBase}14-welcome-basket-bed-detail.jpeg`,
  },
];

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getBannerHeight() {
  const banner = document.querySelector(".luxe-header__banner");

  if (!banner) {
    return 0;
  }

  return Math.ceil(banner.getBoundingClientRect().height);
}

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate(),
  )}`;
}

function fromIsoDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function compareIsoDates(firstDate, secondDate) {
  const first = fromIsoDate(firstDate);
  const second = fromIsoDate(secondDate);

  if (!first || !second) return 0;

  return first.getTime() - second.getTime();
}

function formatLongDate(value) {
  const date = fromIsoDate(value);

  if (!date) return "Select a date";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(value) {
  const date = fromIsoDate(value);

  if (!date) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getNightCount(checkIn, checkout) {
  const startDate = fromIsoDate(checkIn);
  const endDate = fromIsoDate(checkout);

  if (!startDate || !endDate || endDate <= startDate) return 0;

  return Math.round((endDate - startDate) / 86400000);
}

function buildCalendarCells(viewDate) {
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const calendarStart = new Date(monthStart);

  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);

    return {
      date,
      iso: toIsoDate(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === viewDate.getMonth(),
    };
  });
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

function AvailabilityBooking() {
  const todayDate = useMemo(() => normalizeDate(new Date()), []);
  const todayIso = useMemo(() => toIsoDate(todayDate), [todayDate]);
  const [viewDate, setViewDate] = useState(
    () => new Date(todayDate.getFullYear(), todayDate.getMonth(), 1),
  );
  const [focusedDate, setFocusedDate] = useState(todayIso);
  const [checkIn, setCheckIn] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [submitNote, setSubmitNote] = useState("");

  const calendarCells = useMemo(() => buildCalendarCells(viewDate), [viewDate]);
  const monthTitle = monthLabels[viewDate.getMonth()];
  const yearTitle = viewDate.getFullYear();
  const nights = getNightCount(checkIn, checkout);
  const hasValidDates = Boolean(
    checkIn && checkout && compareIsoDates(checkout, checkIn) > 0,
  );
  const isFormReady = Boolean(
    hasValidDates && guestCount && guestName.trim() && guestPhone.trim(),
  );

  function setMonthFromIsoDate(value) {
    const date = fromIsoDate(value);

    if (!date) return;

    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function handleDateChoice(cell) {
    if (!cell.isCurrentMonth || cell.date < todayDate) return;

    const selectedIso = cell.iso;

    setFocusedDate(selectedIso);
    setSubmitNote("");

    if (!checkIn || (checkIn && checkout)) {
      setCheckIn(selectedIso);
      setCheckout("");
      return;
    }

    if (compareIsoDates(selectedIso, checkIn) <= 0) {
      setCheckIn(selectedIso);
      setCheckout("");
      return;
    }

    setCheckout(selectedIso);
  }

  function handleCheckInChange(event) {
    const nextCheckIn = event.target.value;

    setCheckIn(nextCheckIn);
    setFocusedDate(nextCheckIn || todayIso);
    setSubmitNote("");

    if (nextCheckIn) {
      setMonthFromIsoDate(nextCheckIn);
    }

    if (checkout && compareIsoDates(checkout, nextCheckIn) <= 0) {
      setCheckout("");
    }
  }

  function handleCheckoutChange(event) {
    const nextCheckout = event.target.value;

    setCheckout(nextCheckout);
    setFocusedDate(nextCheckout || checkIn || todayIso);
    setSubmitNote("");

    if (nextCheckout) {
      setMonthFromIsoDate(nextCheckout);
    }
  }

  function goToToday() {
    setViewDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
    setFocusedDate(todayIso);
  }

  function buildRequestMessage() {
    return [
      "Hello, I would like to check availability for One Plus One Luxe Retreat.",
      `Check-in: ${checkIn}`,
      `Checkout: ${checkout}`,
      `Guests: ${guestCount}`,
      `Name: ${guestName.trim()}`,
      `Phone/WhatsApp: ${guestPhone.trim()}`,
      `Message: ${guestMessage.trim() || "No extra request yet."}`,
      "Please confirm if these dates are available.",
    ].join("\n");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isFormReady) {
      setSubmitNote(
        "Please complete the required booking request details first.",
      );
      return;
    }

    const requestMessage = buildRequestMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      requestMessage,
    )}`;

    setSubmitNote("Opening WhatsApp with your booking request message.");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="stay-booking" data-allow-native-scroll="true">
      <div className="stay-booking__intro">
        <p className="stay-page__eyebrow">Check Availability</p>
        <p className="stay-page__kicker">Request first · Confirm manually</p>
        <h2>Check your dates before booking.</h2>
        <p>
          Choose your preferred dates and send a booking request. This first
          version does not confirm live availability or take payment yet.
        </p>
      </div>

      <div className="stay-booking__workspace">
        <section
          className="stay-booking__calendar-shell"
          aria-label="Date selection calendar"
        >
          <div className="stay-booking__calendar-header">
            <button
              className="stay-booking__month-button"
              type="button"
              aria-label="Previous month"
              onClick={() => setViewDate((current) => addMonths(current, -1))}
            >
              <ArrowIcon direction="left" />
            </button>

            <div className="stay-booking__month-title" aria-live="polite">
              <span>{monthTitle}</span>
              <strong>{yearTitle}</strong>
            </div>

            <button
              className="stay-booking__month-button"
              type="button"
              aria-label="Next month"
              onClick={() => setViewDate((current) => addMonths(current, 1))}
            >
              <ArrowIcon direction="right" />
            </button>

            <button
              className="stay-booking__today-button"
              type="button"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <div
            className="stay-booking__calendar-grid"
            role="grid"
            aria-label={`${monthTitle} ${yearTitle}`}
          >
            {dayLabels.map((label) => (
              <div
                className="stay-booking__weekday"
                key={label}
                role="columnheader"
              >
                {label}
              </div>
            ))}

            {calendarCells.map((cell) => {
              const isPast = cell.date < todayDate;
              const isCheckIn = cell.iso === checkIn;
              const isCheckout = cell.iso === checkout;
              const isToday = cell.iso === todayIso;
              const isFocused = cell.iso === focusedDate;
              const isInRange = Boolean(
                checkIn &&
                checkout &&
                compareIsoDates(cell.iso, checkIn) > 0 &&
                compareIsoDates(cell.iso, checkout) < 0,
              );

              return (
                <button
                  className={`stay-booking__day ${
                    !cell.isCurrentMonth ? "is-outside" : ""
                  } ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""} ${
                    isCheckIn ? "is-check-in" : ""
                  } ${isCheckout ? "is-checkout" : ""} ${
                    isInRange ? "is-in-range" : ""
                  } ${isFocused ? "is-focused" : ""}`}
                  type="button"
                  key={cell.iso}
                  disabled={!cell.isCurrentMonth || isPast}
                  aria-pressed={isCheckIn || isCheckout || isInRange}
                  aria-label={`${formatLongDate(cell.iso)}${
                    isPast ? ", unavailable for past-date requests" : ""
                  }`}
                  onClick={() => handleDateChoice(cell)}
                >
                  <span>{cell.dayNumber}</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside
          className="stay-booking__aside"
          aria-label="Selected booking request details"
        >
          <div className="stay-booking__selected-day">
            <span>{fromIsoDate(focusedDate)?.getDate() || "—"}</span>
            <strong>{formatLongDate(focusedDate)}</strong>
          </div>

          <div className="stay-booking__selection-summary">
            <div>
              <span>Check-in</span>
              <strong>{formatShortDate(checkIn)}</strong>
            </div>
            <div>
              <span>Checkout</span>
              <strong>{formatShortDate(checkout)}</strong>
            </div>
            <div>
              <span>Nights</span>
              <strong>{nights || "—"}</strong>
            </div>
          </div>

          <p className="stay-booking__manual-note">
            Dates are requested first. The host confirms availability manually
            before the stay is treated as booked.
          </p>
        </aside>

        <form className="stay-booking__form" onSubmit={handleSubmit}>
          <div className="stay-booking__form-head">
            <span>Booking request</span>
            <strong>Continue on WhatsApp</strong>
          </div>

          <div className="stay-booking__field-grid">
            <label className="stay-booking__field">
              <span>Check-in</span>
              <input
                type="date"
                min={todayIso}
                value={checkIn}
                onChange={handleCheckInChange}
                required
              />
            </label>

            <label className="stay-booking__field">
              <span>Checkout</span>
              <input
                type="date"
                min={checkIn || todayIso}
                value={checkout}
                onChange={handleCheckoutChange}
                required
              />
            </label>

            <label className="stay-booking__field">
              <span>Guests</span>
              <select
                value={guestCount}
                onChange={(event) => setGuestCount(event.target.value)}
                required
              >
                {[1, 2, 3, 4].map((count) => (
                  <option value={count} key={count}>
                    {count} {count === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>

            <label className="stay-booking__field">
              <span>Name</span>
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="stay-booking__field stay-booking__field--wide">
              <span>Phone / WhatsApp</span>
              <input
                type="tel"
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="Best number for follow-up"
                required
              />
            </label>

            <label className="stay-booking__field stay-booking__field--wide">
              <span>Message</span>
              <textarea
                value={guestMessage}
                onChange={(event) => setGuestMessage(event.target.value)}
                placeholder="Airport transfer, driver, early check-in, or special request"
                rows="3"
              />
            </label>
          </div>

          {checkout && checkIn && compareIsoDates(checkout, checkIn) <= 0 ? (
            <p className="stay-booking__error" role="alert">
              Checkout must be after check-in.
            </p>
          ) : null}

          {submitNote ? (
            <p className="stay-booking__submit-note" role="status">
              {submitNote}
            </p>
          ) : null}

          <button
            className="stay-booking__submit"
            type="submit"
            disabled={!isFormReady}
          >
            <span>Continue on WhatsApp</span>
            <BookIcon />
          </button>
        </form>
      </div>
    </div>
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
                {panel.layout === "booking" ? (
                  <AvailabilityBooking />
                ) : (
                  <>
                    <div className="stay-page__copy">
                      <p className="stay-page__eyebrow">{panel.eyebrow}</p>

                      <p className="stay-page__kicker">{panel.kicker}</p>

                      <h2>{panel.title}</h2>

                      <p className="stay-page__body">{panel.body}</p>
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
                  </>
                )}
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
