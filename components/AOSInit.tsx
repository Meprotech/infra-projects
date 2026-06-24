"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Initialises AOS (Animate On Scroll) site-wide. Tuned to be fast + smooth:
 * short duration, ease-out, fires once. Disabled entirely under reduced motion.
 */
export function AOSInit() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    AOS.init({
      duration: 400, // snappy
      easing: "ease-out", // smooth + fast
      once: true, // animate a single time
      offset: 60, // trigger close to entering the viewport
      delay: 0,
      disable: reduce,
    });

    // Recalculate positions once fonts/images settle (and after Lenis lays out).
    const onLoad = () => AOS.refresh();
    window.addEventListener("load", onLoad);
    const t = window.setTimeout(() => AOS.refresh(), 600);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
