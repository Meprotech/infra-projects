"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "outline-light";
  className?: string;
  /** how far the button drifts toward the cursor (px) */
  strength?: number;
}

/**
 * Button/link that subtly follows the cursor (magnetic), with a scale + shadow
 * lift on hover. Disables the magnetic drift under reduced-motion preferences.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-accent text-ink hover:bg-accent-soft shadow-[0_10px_30px_-10px_rgb(var(--accent)/0.6)]"
      : variant === "outline-light"
        ? "border border-white/40 text-white backdrop-blur-sm hover:border-yellow-200 hover:bg-white/5 hover:text-yellow-200"
        : "border border-concrete-500 text-concrete-50 hover:border-accent hover:text-accent";

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cn(base, styles, className)}
    >
      {children}
    </motion.span>
  );

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className="inline-block">
      {inner}
    </button>
  );
}
