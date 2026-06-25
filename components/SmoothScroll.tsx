"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Buttery momentum scrolling (the CW / landing.love feel). Uses real scroll
 * position (not transforms), so position:sticky and Framer's useScroll — which
 * the 3D journey section relies on — keep working. Disabled entirely under
 * reduced-motion so it never fights assistive settings.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lowPower =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    if (lowPower) return;
    const idleWindow = window as unknown as {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let disposed = false;
    let stop = () => {};

    const initialize = async () => {
      const { default: Lenis } = await import("lenis");
      if (disposed) return;

      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
      });

      let raf = 0;
      let running = true;
      const loop = (time: number) => {
        if (!running) return;
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      const onVisibilityChange = () => {
        running = !document.hidden;
        if (!running) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      };

      document.addEventListener("visibilitychange", onVisibilityChange);
      raf = requestAnimationFrame(loop);
      stop = () => {
        running = false;
        document.removeEventListener("visibilitychange", onVisibilityChange);
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    };

    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(initialize, { timeout: 1600 })
        : window.setTimeout(initialize, 800);

    return () => {
      disposed = true;
      stop();
      if (idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [reduce]);

  return null;
}
