"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

/**
 * Initialises AOS (Animate On Scroll) site-wide. Tuned to be fast + smooth:
 * short duration, ease-out, fires once. Disabled entirely under reduced motion.
 */
export function AOSInit() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const idleWindow = window as unknown as {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let cancelled = false;
    let removeRefreshListeners = () => {};

    const initialize = async () => {
      const { default: AOS } = await import("aos");
      if (cancelled) return;

      AOS.init({
        duration: 400,
        easing: "ease-out",
        once: true,
        offset: 60,
        delay: 0,
      });

      const refresh = () => AOS.refresh();
      const refreshTimer = window.setTimeout(refresh, 400);
      window.addEventListener("load", refresh, { once: true });
      removeRefreshListeners = () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener("load", refresh);
      };
    };

    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(initialize, { timeout: 1800 })
        : window.setTimeout(initialize, 900);

    return () => {
      cancelled = true;
      removeRefreshListeners();
      if (idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  return null;
}
