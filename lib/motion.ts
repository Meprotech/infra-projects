import type { Variants } from "framer-motion";

// Shared Framer Motion variants. Components pass these to motion elements so the
// motion language stays consistent site-wide. `prefers-reduced-motion` is handled
// at the component layer (see components/ui/Reveal.tsx and the MotionConfig in
// app/layout-providers) by swapping transforms for a plain fade.

export const EASE = [0.22, 1, 0.36, 1] as const; // expo-out-ish, premium feel

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// Parent container that staggers its children.
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Per-word / per-character reveal used by AnimatedText.
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.6, ease: EASE },
  },
};
