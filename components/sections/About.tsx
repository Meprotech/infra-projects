"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STATS } from "@/data/stats";
import { staggerContainer, fadeUp } from "@/lib/motion";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-concrete-950 py-24 md:py-32">
      <div className="section-shell relative grid items-center gap-14 lg:grid-cols-2">
        {/* Visual */}
        <Reveal y={36} className="order-2 lg:order-1">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-concrete-700">
              <Parallax className="absolute inset-0" distance={26}>
                <Image
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=70"
                  alt="Infrastructure construction site (placeholder)"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="scale-125 object-cover"
                />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-tr from-concrete-950/70 via-transparent to-transparent" />
            </div>
            {/* Floating accent stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-6 -right-4 rounded-xl border border-concrete-700 bg-concrete-900/90 p-5 shadow-lift backdrop-blur sm:-right-6"
            >
              <p className="font-heading text-3xl font-bold text-accent">
                <Counter to={120} suffix="+" />
              </p>
              <p className="mt-1 text-xs text-concrete-400">
                Projects Completed
              </p>
            </motion.div>
          </div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Who We Are"
            title="An engineering partner public bodies can *trust*."
            description="We design and build the unseen networks that keep cities and villages running clean water in, wastewater safely out, and farmland irrigated. As a government-approved contractor based in Gujarat, we bring disciplined execution and modern methods to public infrastructure across India."
          />

          <motion.dl
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-700"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="bg-concrete-900 p-6"
              >
                <dt className="order-2 text-xs uppercase tracking-wide text-concrete-400">
                  {stat.label}
                </dt>
                <dd className="font-heading text-3xl font-bold text-concrete-50 sm:text-4xl">
                  <Counter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    display={stat.display}
                  />
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
