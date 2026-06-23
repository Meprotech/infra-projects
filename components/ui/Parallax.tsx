"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Translates its children on the Y axis as the element scrolls through the
 * viewport — subtle depth. Pair with an overflow-hidden parent and a slightly
 * scaled-up child so the parallax never reveals an edge. No-op under reduced
 * motion.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [distance, -distance],
  );

  // useScroll needs a non-static target; mirror any positioning class inline so
  // it's set even before CSS loads (or default to relative).
  const position =
    (/\b(absolute|fixed|sticky|relative)\b/.exec(className ?? "")?.[1] as
      | "absolute"
      | "fixed"
      | "sticky"
      | "relative"
      | undefined) ?? "relative";

  return (
    <motion.div ref={ref} style={{ y, position }} className={className}>
      {children}
    </motion.div>
  );
}
