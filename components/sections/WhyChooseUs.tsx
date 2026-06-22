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
          eyebrow="Why Choose Us"
          title="Built on engineering, earned on *trust*."
          description="The reasons public bodies bring us in — and bring us back."
        />

        <motion.div
          variants={staggerContainer(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {STRENGTHS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-950/60 p-7 transition-colors hover:border-accent/40"
              >
                {/* hover accent sweep */}
                <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-concrete-800 text-accent ring-1 ring-concrete-700 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-concrete-50">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-concrete-400">
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
