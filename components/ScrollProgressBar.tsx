"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin amber bar pinned to the very top that fills as the page scrolls.
 * A cheap, premium "you are here" cue. Respects reduced motion implicitly —
 * it's a progress indicator, not decorative motion, and the spring is gentle.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      aria-hidden
    />
  );
}
