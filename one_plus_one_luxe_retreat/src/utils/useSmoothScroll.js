import { useEffect } from "react";
import settings from "../settings/settings";

const NAV_CLICK_SCROLL_DURATION = 1850;

function lenisLikeEase(t) {
  return t * (2 - t);
}

function getMaxScrollY() {
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );

  return Math.max(0, documentHeight - window.innerHeight);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function getBannerOffset() {
  const banner = document.querySelector(".luxe-header__banner");

  if (!banner) {
    return 0;
  }

  return Math.ceil(banner.getBoundingClientRect().height);
}

function getAnchorTarget(anchor) {
  const href = anchor.getAttribute("href");

  if (!href || !href.startsWith("#") || href === "#") {
    return null;
  }

  try {
    return document.querySelector(href);
  } catch {
    return null;
  }
}

function isAllowedScrollAnchor(anchor) {
  return Boolean(
    anchor.closest(
      ".luxe-header, .stay-page__cta-button, .gallery-page__cta-button, .amenities-page__cta-button, .location-page__cta-button, .reviews-page__cta-button, .faq-page__cta-button, .faq-page__secondary-button",
    ),
  );
}

function getHorizontalSectionData(target) {
  if (!target || !(target instanceof Element)) {
    return null;
  }

  if (target.matches("[data-horizontal-section='true']")) {
    return {
      section: target,
      targetId: target.id,
    };
  }

  const horizontalSection = target.closest("[data-horizontal-section='true']");

  if (!horizontalSection) {
    return null;
  }

  return {
    section: horizontalSection,
    targetId: target.id,
  };
}

function requestHorizontalPanel(target) {
  const horizontalData = getHorizontalSectionData(target);

  if (!horizontalData) return;

  window.dispatchEvent(
    new CustomEvent("onePlusOne:stayPanelRequest", {
      detail: {
        sectionId: horizontalData.section.id,
        targetId: horizontalData.targetId,
      },
    }),
  );
}

function getTargetScrollY(target) {
  if (!target) {
    return 0;
  }

  if (target.id === "home") {
    return 0;
  }

  const horizontalData = getHorizontalSectionData(target);

  if (horizontalData) {
    const sectionTop = horizontalData.section.offsetTop;

    return clamp(sectionTop - getBannerOffset(), 0, getMaxScrollY());
  }

  const targetTop =
    target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);

  return clamp(targetTop - getBannerOffset(), 0, getMaxScrollY());
}

function isScrollableKey(event) {
  return [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    " ",
    "Spacebar",
  ].includes(event.key);
}

function isTypingOrInteractiveTarget(target) {
  if (!target || !(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, button, a, [role='button'], [contenteditable='true']",
    ),
  );
}

function getNativeScrollTarget(target) {
  if (!target || !(target instanceof Element)) {
    return null;
  }

  return target.closest(
    "[data-native-scroll='true'], [data-allow-native-scroll='true'], .stay-booking, .gallery-page__panel-inner, .gallery-page__lightbox-caption",
  );
}

function canNativeTargetScroll(scrollTarget, deltaY) {
  if (!scrollTarget) {
    return false;
  }

  const scrollRoom = scrollTarget.scrollHeight - scrollTarget.clientHeight;

  if (scrollRoom <= 1) {
    return false;
  }

  if (deltaY > 0) {
    return scrollTarget.scrollTop < scrollRoom - 1;
  }

  if (deltaY < 0) {
    return scrollTarget.scrollTop > 1;
  }

  return false;
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

    let animationFrameId = null;
    let targetClassTimer = null;
    let lastTouchY = null;

    document.documentElement.classList.add("is-nav-controlled-scroll");

    function cancelCurrentAnimation() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    function clearActiveTargets() {
      document.querySelectorAll(".is-scroll-lock-target").forEach((element) => {
        element.classList.remove("is-scroll-lock-target");
      });
    }

    function blockManualWheelScroll(event) {
      if (event.ctrlKey) return;

      const nativeScrollTarget = getNativeScrollTarget(event.target);

      if (canNativeTargetScroll(nativeScrollTarget, event.deltaY)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    }

    function trackNativeTouchStart(event) {
      lastTouchY = event.touches?.[0]?.clientY ?? null;
    }

    function blockManualTouchScroll(event) {
      const nativeScrollTarget = getNativeScrollTarget(event.target);
      const currentTouchY = event.touches?.[0]?.clientY ?? null;

      if (nativeScrollTarget && currentTouchY !== null && lastTouchY !== null) {
        const deltaY = lastTouchY - currentTouchY;
        lastTouchY = currentTouchY;

        if (canNativeTargetScroll(nativeScrollTarget, deltaY)) {
          return;
        }
      }

      event.preventDefault();
      event.stopPropagation();
    }

    function blockManualKeyboardScroll(event) {
      if (!isScrollableKey(event)) return;
      if (isTypingOrInteractiveTarget(event.target)) return;

      const nativeScrollTarget = getNativeScrollTarget(event.target);

      if (nativeScrollTarget) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    }

    function animateTo(targetScrollY, options = {}) {
      cancelCurrentAnimation();

      const {
        duration = NAV_CLICK_SCROLL_DURATION,
        easing = lenisLikeEase,
        targetElement = null,
        updateHash = null,
      } = options;

      const startY = window.scrollY || window.pageYOffset;
      const safeTargetY = clamp(targetScrollY, 0, getMaxScrollY());
      const distance = safeTargetY - startY;
      const startTime = performance.now();

      document.documentElement.classList.add("is-section-locking");

      clearActiveTargets();

      if (targetElement) {
        targetElement.classList.add("is-scroll-lock-target");
      }

      if (targetClassTimer) {
        clearTimeout(targetClassTimer);
      }

      function finish() {
        window.scrollTo(0, safeTargetY);
        animationFrameId = null;
        document.documentElement.classList.remove("is-section-locking");

        if (updateHash) {
          window.history.pushState(null, "", updateHash);
        }

        targetClassTimer = setTimeout(() => {
          if (targetElement) {
            targetElement.classList.remove("is-scroll-lock-target");
          }
        }, 900);
      }

      if (Math.abs(distance) < 2) {
        finish();
        return;
      }

      function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(frame);
        } else {
          finish();
        }
      }

      animationFrameId = requestAnimationFrame(frame);
    }

    function handleAnchorClick(event) {
      const anchor = event.target.closest("a[href^='#']");

      if (!anchor) return;
      if (!isAllowedScrollAnchor(anchor)) return;

      const target = getAnchorTarget(anchor);

      if (!target) return;

      event.preventDefault();

      requestHorizontalPanel(target);

      animateTo(getTargetScrollY(target), {
        duration: NAV_CLICK_SCROLL_DURATION,
        easing: lenisLikeEase,
        targetElement: target,
        updateHash: anchor.getAttribute("href"),
      });
    }

    window.addEventListener("wheel", blockManualWheelScroll, {
      passive: false,
      capture: true,
    });

    window.addEventListener("touchstart", trackNativeTouchStart, {
      passive: true,
      capture: true,
    });

    window.addEventListener("touchmove", blockManualTouchScroll, {
      passive: false,
      capture: true,
    });

    window.addEventListener("keydown", blockManualKeyboardScroll, {
      capture: true,
    });

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("wheel", blockManualWheelScroll, {
        capture: true,
      });

      window.removeEventListener("touchstart", trackNativeTouchStart, {
        capture: true,
      });

      window.removeEventListener("touchmove", blockManualTouchScroll, {
        capture: true,
      });

      window.removeEventListener("keydown", blockManualKeyboardScroll, {
        capture: true,
      });

      document.removeEventListener("click", handleAnchorClick);

      cancelCurrentAnimation();
      clearTimeout(targetClassTimer);
      clearActiveTargets();
      document.documentElement.classList.remove(
        "is-nav-controlled-scroll",
        "is-section-locking",
      );
    };
  }, []);
}
