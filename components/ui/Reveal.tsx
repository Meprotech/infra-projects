"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** seconds before the animation starts once in view */
  delay?: number;
  /** distance to travel on the Y axis (ignored under reduced motion) */
  y?: number;
  /** re-run every time it scrolls into view (default: once) */
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}

/**
 * Scroll-triggered fade/slide-in that fires once and degrades to a plain fade
 * (no transform) when the user prefers reduced motion — the site-wide reveal.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as React.ElementType;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, delay },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
    >
      {children}
    </MotionTag>
  );
}
