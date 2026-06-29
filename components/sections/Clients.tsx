"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";

const HOME_CLIENTS = [
  "Torrent Power Ltd",
  "Sterling & Wilson",
  "Oriano Clean Energy",
  "Onix Renewable",
  "SAEL",
  "Future Infrastructure",
  "Shree Ganesh Corporation",
  "Jay Balanand Construction",
  "Banko Construction",
];

export function Clients() {
  return (
    <section className="relative overflow-hidden border-t border-concrete-800 bg-concrete-950 py-24 md:py-28">
      <div className="section-shell relative">
        <SectionHeading
          eyebrow="Industry Partnerships"
          title="Our esteemed *clientele*."
          description="Our operational transparency and timeline fidelity have helped us build long-standing relationships with leading names across the energy and infrastructure sectors."
        />

        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-700 sm:mt-14 lg:grid-cols-3"
        >
          {HOME_CLIENTS.map((client, index) => (
            <motion.div
              key={client}
              variants={fadeUp}
              className={`flex min-h-24 items-center justify-center bg-concrete-900 px-4 py-6 text-center transition-colors hover:bg-concrete-800 sm:min-h-28 sm:px-6 ${
                index === HOME_CLIENTS.length - 1
                  ? "col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <span className="font-heading text-sm font-semibold text-concrete-100 sm:text-base">
                {client}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
