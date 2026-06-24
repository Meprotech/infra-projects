"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Reveal } from "@/components/ui/Reveal";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden border-t border-concrete-800 bg-concrete-900">
      {/* moving accent gradient */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 120% at 50% 100%, rgb(var(--accent) / 0.18), transparent 70%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="section-shell relative flex flex-col items-center py-24 text-center md:py-32">
        <h2 className="max-w-3xl font-heading text-3xl font-bold leading-[1.08] tracking-tight text-concrete-50 sm:text-4xl md:text-5xl lg:text-6xl">
          <AnimatedText
            text="Have a Project in Mind? *Let's Build It Together.*"
            inView
            className="text-gradient"
          />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-base text-concrete-300 sm:text-lg">
            Tell us about your water, sewerage, irrigation or environmental works
            our team will get back with a clear path forward.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-9">
            <Link href="/contact" className="conversation-button">
              <span className="conversation-button__text">
                Start a Conversation
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
