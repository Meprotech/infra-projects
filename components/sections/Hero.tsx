"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center"
    >
      {/* Full-bleed background image. Swap public/hero.webp with the real photo
          (keep the same path/filename). */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={reduce ? undefined : { scale: 1.08 }}
          animate={reduce ? undefined : { scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/hero.webp"
            alt="Aerial view of a water treatment and supply plant"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Dark scrims so the centered white headline stays legible over a
            bright photo (and the bottom reads under the scroll cue). */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/45" />
      </div>

      <div className="section-shell relative">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70"
        >
          Government-Approved Infrastructure
        </motion.p>

        <h1 className="mx-auto mt-6 max-w-5xl font-heading text-5xl font-bold leading-[1.02] tracking-tight text-white drop-shadow-sm sm:text-6xl md:text-7xl xl:text-[5.5rem]">
          <AnimatedText text="Building India's *Infrastructure*" delay={0.15} />
          
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.95, duration: 0.7 }}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Water supply, sewerage, irrigation and environmental works for state
          and municipal bodies — on spec, on schedule, built to last.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 1.1, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="/contact">Get in Touch</MagneticButton>
          <MagneticButton href="/#services" variant="outline-light">
            Explore Services
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.4 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          Scroll
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-white" />
        </motion.span>
      </motion.a>
    </section>
  );
}
