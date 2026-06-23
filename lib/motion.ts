import type { Variants } from "framer-motion";

// Shared Framer Motion variants so the motion language stays consistent
// site-wide. `prefers-reduced-motion` is handled at the component layer
// (see components/ui/Reveal.tsx and the MotionConfig in MotionProvider).

export const EASE = [0.22, 1, 0.36, 1] as const; // expo-out-ish, premium feel

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

// Parent container that staggers its children.
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
