"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { STRENGTHS } from "@/data/strengths";
import { staggerContainer, fadeUp } from "@/lib/motion";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden border-t border-concrete-800 bg-concrete-900 py-24 md:py-32">
      <BlueprintGrid />
      <div className="section-shell relative">
        <SectionHeading
          align="center"
          eyebrow="Safety & Environment"
          title="Health, safety & *environment*."
          description="Clear site controls protect our people, reduce operational risk and safeguard the environments where we work."
        />

        <motion.div
          variants={staggerContainer(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6 lg:grid-cols-3"
        >
          {STRENGTHS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-950/60 p-4 transition-colors hover:border-accent/40 sm:p-7"
              >
                {/* hover accent sweep */}
                <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-concrete-800 text-accent ring-1 ring-concrete-700 transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-concrete-50 sm:mt-5 sm:text-lg">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-concrete-400 sm:mt-2.5 sm:text-sm">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
