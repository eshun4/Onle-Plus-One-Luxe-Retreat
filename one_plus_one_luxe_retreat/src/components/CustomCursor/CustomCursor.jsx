import { useEffect, useMemo, useRef, useState } from "react";
import settings from "../../settings/settings";
import "./CustomCursor.css";

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-cursor='button']",
  ".home-slider__control",
  ".home-slider__slide",
  ".luxe-header__icon-button",
  ".luxe-header__search-desktop",
  ".luxe-header__search-mobile",
].join(",");

const textSelector = [
  "input",
  "textarea",
  "[contenteditable='true']",
  "[data-cursor='text']",
].join(",");

const dragSelector = ["[draggable='true']", "[data-cursor='drag']"].join(",");

function getCursorVariant(target) {
  if (!target || !(target instanceof Element)) {
    return "default";
  }

  if (target.closest(textSelector)) {
    return "text";
  }

  if (target.closest(dragSelector)) {
    return "drag";
  }

  if (target.closest(interactiveSelector)) {
    return "interactive";
  }

  return "default";
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 48 58" aria-hidden="true">
      <path
        d="M8 5V48L20.2 36.3L27 53L36.2 49.2L29.2 33.3H45L8 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg viewBox="0 0 64 72" aria-hidden="true">
      <path
        d="M29.2 6.2C25.8 6.2 23 9 23 12.4V38.3L18.2 33.3C15.4 30.4 10.8 30.3 7.9 33.1C5 35.9 4.8 40.5 7.6 43.5L24.5 61.5C28 65.2 32.8 67.3 37.9 67.3H44.1C54.4 67.3 60 61.5 60 51.1V34.8C60 31.4 57.3 28.7 53.9 28.7C51.9 28.7 50.1 29.7 49 31.2C48.3 28.4 45.8 26.3 42.8 26.3C40.6 26.3 38.7 27.4 37.6 29.1C36.7 26.7 34.4 25 31.7 25C30.9 25 30.1 25.2 29.4 25.5V12.4C29.4 9 26.6 6.2 23.2 6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 0)"
      />
      <path
        d="M29.4 25.5V42.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
        transform="translate(3 0)"
      />
      <path
        d="M37.6 29.1V43.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
        transform="translate(3 0)"
      />
      <path
        d="M49 31.2V45"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
        transform="translate(3 0)"
      />
    </svg>
  );
}

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const visibleRef = useRef(false);
  const variantRef = useRef("default");

  const clickTimerRef = useRef(null);
  const releaseTimerRef = useRef(null);
  const doubleTimerRef = useRef(null);
  const rightTimerRef = useRef(null);
  const wheelTimerRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState("default");
  const [isPressing, setIsPressing] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isDoubleClicking, setIsDoubleClicking] = useState(false);
  const [isRightClicking, setIsRightClicking] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);

  const { theme } = settings;

  const cssVars = useMemo(
    () => ({
      "--cursor-black": theme.colors.black,
      "--cursor-surface": theme.colors.surface,
      "--cursor-surface-2": theme.colors.surface2,
      "--cursor-copper": theme.colors.copper,
      "--cursor-copper-light": theme.colors.copperLight,
      "--cursor-sand": theme.colors.sand,
      "--cursor-cream": theme.colors.cream,
      "--cursor-muted": theme.colors.muted,
      "--cursor-font-body": theme.typography.fontFamily.body,
      "--cursor-transition": theme.transitions.default,
      "--cursor-transition-slow": theme.transitions.slow,
    }),
    [theme],
  );

  useEffect(() => {
    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!supportsFinePointer) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    function clearTimer(timerRef) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    function flash(setter, timerRef, duration = 380) {
      clearTimer(timerRef);
      setter(true);

      timerRef.current = setTimeout(() => {
        setter(false);
      }, duration);
    }

    function showCursor() {
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
        flash(setHasEntered, enterTimerRef, 380);
      }
    }

    function hideCursor() {
      if (visibleRef.current) {
        visibleRef.current = false;
        setIsVisible(false);
        flash(setHasLeft, leaveTimerRef, 380);
      }
    }

    function updatePosition(event) {
      if (!cursorRef.current) return;

      cursorRef.current.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursorRef.current.style.setProperty("--cursor-y", `${event.clientY}px`);
    }

    function handlePointerMove(event) {
      updatePosition(event);
      showCursor();

      const nextVariant = getCursorVariant(event.target);

      if (nextVariant !== variantRef.current) {
        variantRef.current = nextVariant;
        setVariant(nextVariant);
      }
    }

    function handlePointerDown(event) {
      showCursor();

      if (event.button === 2) {
        flash(setIsRightClicking, rightTimerRef, 520);
        return;
      }

      setIsPressing(true);
      flash(setIsClicking, clickTimerRef, 420);
    }

    function handlePointerUp() {
      setIsPressing(false);
      flash(setIsReleasing, releaseTimerRef, 320);
    }

    function handleClick() {
      flash(setIsClicking, clickTimerRef, 420);
    }

    function handleDoubleClick() {
      flash(setIsDoubleClicking, doubleTimerRef, 560);
    }

    function handleContextMenu() {
      flash(setIsRightClicking, rightTimerRef, 560);
    }

    function handleWheel() {
      flash(setIsScrolling, wheelTimerRef, 500);
    }

    function handleDragStart() {
      setIsDragging(true);
      variantRef.current = "drag";
      setVariant("drag");
    }

    function handleDragEnd() {
      setIsDragging(false);
      variantRef.current = "default";
      setVariant("default");
      flash(setIsReleasing, releaseTimerRef, 320);
    }

    function handleWindowOut(event) {
      if (!event.relatedTarget) {
        hideCursor();
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("click", handleClick);
    window.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);
    window.addEventListener("mouseout", handleWindowOut);

    return () => {
      root.classList.remove("has-custom-cursor");

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);
      window.removeEventListener("mouseout", handleWindowOut);

      [
        clickTimerRef,
        releaseTimerRef,
        doubleTimerRef,
        rightTimerRef,
        wheelTimerRef,
        enterTimerRef,
        leaveTimerRef,
      ].forEach(clearTimer);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={[
        "custom-cursor",
        isVisible ? "is-visible" : "",
        `is-${variant}`,
        isPressing ? "is-pressing" : "",
        isClicking ? "is-clicking" : "",
        isReleasing ? "is-releasing" : "",
        isDoubleClicking ? "is-double-clicking" : "",
        isRightClicking ? "is-right-clicking" : "",
        isScrolling ? "is-scrolling" : "",
        isDragging ? "is-dragging" : "",
        hasEntered ? "has-entered" : "",
        hasLeft ? "has-left" : "",
      ].join(" ")}
      style={cssVars}
      aria-hidden="true"
    >
      <span className="custom-cursor__arrow">
        <ArrowIcon />
      </span>

      <span className="custom-cursor__hand">
        <HandIcon />
      </span>

      <span className="custom-cursor__dot" />

      <span className="custom-cursor__caret" />

      <span className="custom-cursor__scroll-mark">
        <span />
        <span />
        <span />
      </span>

      <span className="custom-cursor__rays">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} style={{ "--ray-index": index }} />
        ))}
      </span>
    </div>
  );
}
