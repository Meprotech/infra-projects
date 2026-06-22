"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Site-wide motion config. `reducedMotion="user"` makes every Framer Motion
 * animation automatically respect the OS "reduce motion" setting — transforms
 * are dropped and only opacity changes remain. This is the accessibility
 * backbone for the whole site.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
