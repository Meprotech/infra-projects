"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  /** Wrap words in *asterisks* to render them in serif italic (CW-style). */
  text: string;
  className?: string;
  /** delay before the stagger begins */
  delay?: number;
  /** stagger between words */
  stagger?: number;
  /** trigger when scrolled into view instead of on mount */
  inView?: boolean;
}

interface Token {
  word: string;
  italic: boolean;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Split on *...* spans, keeping the delimited groups.
  text.split(/(\*[^*]+\*)/g).forEach((seg) => {
    if (!seg) return;
    const italic = seg.startsWith("*") && seg.endsWith("*");
    const clean = italic ? seg.slice(1, -1) : seg;
    clean
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => tokens.push({ word, italic }));
  });
  return tokens;
}

/**
 * Headline reveal: each word rises and fades in with a stagger. Words wrapped
 * in *asterisks* render in serif italic. Under reduced motion the line simply
 * fades in with no per-word transform.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.07,
  inView = false,
}: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const tokens = tokenize(text);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  };

  const word = {
    hidden: { opacity: 0, y: reduce ? 0 : "0.7em" },
    show: {
      opacity: 1,
      y: "0em",
      transition: { duration: 0.6, ease: EASE },
    },
  };

  const animProps = inView
    ? { whileInView: "show" as const, viewport: { once: true, amount: 0.5 } }
    : { animate: "show" as const };

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      {...animProps}
    >
      {tokens.map((t, i) => (
        <span
          key={i}
          // overflow-y hides the rise; overflow-x stays visible so italic
          // glyph overhang isn't clipped.
          className="inline-block overflow-x-visible overflow-y-hidden align-bottom"
          style={{ marginRight: i < tokens.length - 1 ? "0.25em" : 0 }}
        >
          <motion.span
            variants={word}
            className={cn(
              "inline-block",
              t.italic && "font-serif font-medium italic",
            )}
          >
            {t.word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
