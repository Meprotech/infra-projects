"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * App Router `template.tsx` remounts on every navigation, so wrapping its
 * children in a motion element gives us a smooth enter transition between
 * routes (fade + subtle slide). Reduced motion is honoured globally via the
 * MotionConfig provider, which strips the transform.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
