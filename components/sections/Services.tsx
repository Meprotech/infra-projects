"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SERVICES, type Service } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { staggerContainer, fadeUp } from "@/lib/motion";

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <motion.div variants={fadeUp} className="h-full [perspective:1000px]">
      <TiltCard max={6} className="group h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-900/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow sm:p-7 [transform-style:preserve-3d]">
          {/* corner index */}
          <span className="absolute right-3 top-3 font-heading text-[10px] font-medium text-concrete-600 sm:right-5 sm:top-5 sm:text-xs">
            0{SERVICES.indexOf(service) + 1}
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-colors group-hover:bg-accent group-hover:text-ink sm:h-12 sm:w-12">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
          </span>

          <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-concrete-50 sm:mt-5 sm:text-xl">
            {service.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-concrete-400 sm:mt-2.5 sm:text-sm">
            {service.summary}
          </p>

          {/* Detailed sub-points return when cards have more horizontal room. */}
          <ul className="mt-5 hidden space-y-1 border-t border-concrete-700 pt-4 sm:block">
            {service.points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-sm text-concrete-300"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden border-t border-concrete-800 bg-concrete-900 py-24 md:py-32"
    >
      <div className="section-shell relative">
        <SectionHeading
          eyebrow="What We Do"
          title="Our core *competencies*."
          description="Hydraulic Infrastructure & Public Health Engineering (PHE), delivered through one accountable engineering team."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
