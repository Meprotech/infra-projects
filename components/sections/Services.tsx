"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SERVICES, type Service } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { staggerContainer, fadeUp } from "@/lib/motion";

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <motion.div variants={fadeUp} className="h-full [perspective:1000px]">
      <TiltCard max={6} className="group h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-900/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow [transform-style:preserve-3d]">
          {/* corner index */}
          <span className="absolute right-5 top-5 font-heading text-xs font-medium text-concrete-600">
            0{SERVICES.indexOf(service) + 1}
          </span>

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-colors group-hover:bg-accent group-hover:text-ink">
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </span>

          <h3 className="mt-5 font-heading text-xl font-semibold text-concrete-50">
            {service.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-concrete-400">
            {service.summary}
          </p>

          {/* Sub-points — always visible */}
          <ul className="mt-5 space-y-1 border-t border-concrete-700 pt-4">
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
      <BlueprintGrid />
      <div className="section-shell relative">
        <SectionHeading
          eyebrow="What We Do"
          title="Full-spectrum *infrastructure* delivery."
          description="Four connected disciplines, delivered under one accountable team. Hover a card to see what's inside each."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
