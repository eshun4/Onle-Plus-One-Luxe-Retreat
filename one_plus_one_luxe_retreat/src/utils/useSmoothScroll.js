import { useEffect } from "react";
import settings from "../settings/settings";

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function getMaxScrollY() {
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );

  return Math.max(0, documentHeight - window.innerHeight);
}

function shouldIgnoreWheelEvent(event) {
  const target = event.target;

  if (!target) return false;

  const scrollableElement = target.closest(
    "textarea, select, iframe, [data-native-scroll='true']",
  );

  return Boolean(scrollableElement);
}

export default function useSmoothScroll() {
  useEffect(() => {
    const scrollSettings = settings.navigation?.smoothScroll;

    if (!scrollSettings?.enabled) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (scrollSettings.respectReducedMotion && prefersReducedMotion) {
      return undefined;
    }

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (scrollSettings.disableOnTouch && isTouchDevice) {
      return undefined;
    }

    let targetScrollY = window.scrollY || window.pageYOffset;
    let animationFrameId = null;

    function smoothWheelScroll(event) {
      if (shouldIgnoreWheelEvent(event)) return;

      const maxScrollY = getMaxScrollY();

      if (maxScrollY <= 0) return;

      const currentScrollY = window.scrollY || window.pageYOffset;
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      if (currentScrollY <= 0 && isScrollingUp) return;
      if (currentScrollY >= maxScrollY && isScrollingDown) return;

      event.preventDefault();

      const direction = isScrollingDown ? 1 : -1;
      const step = scrollSettings.step || 200;
      const speed = scrollSettings.speed || 800;

      targetScrollY += direction * step;
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScrollY));

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      const startY = window.scrollY || window.pageYOffset;
      const distance = targetScrollY - startY;
      const startTime = performance.now();

      function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / speed, 1);
        const easedProgress = easeOutQuart(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(frame);
        } else {
          animationFrameId = null;
        }
      }

      animationFrameId = requestAnimationFrame(frame);
    }

    function handleManualScrollSync() {
      if (!animationFrameId) {
        targetScrollY = window.scrollY || window.pageYOffset;
      }
    }

    window.addEventListener("wheel", smoothWheelScroll, { passive: false });
    window.addEventListener("scroll", handleManualScrollSync, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", smoothWheelScroll);
      window.removeEventListener("scroll", handleManualScrollSync);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
}
