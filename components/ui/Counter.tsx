"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  animate,
} from "framer-motion";

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  /** if provided, shown verbatim instead of the animated number */
  display?: string;
  duration?: number;
}

/**
 * Counts up from 0 to `to` once it scrolls into view. Reduced motion / a
 * `display` override both short-circuit straight to the final value.
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  display,
  duration = 1.8,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [rendered, setRendered] = useState(0);

  useEffect(() => {
    if (!inView || display) return;
    if (reduce) {
      setRendered(to);
      return;
    }
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setRendered(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce, display, motionValue]);

  return (
    <span ref={ref}>
      {display ?? `${prefix}${rendered.toLocaleString("en-IN")}${suffix}`}
    </span>
  );
}
