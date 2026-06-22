"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building, MapPin, Navigation } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { INDIA_VIEWBOX, INDIA_STATES } from "@/data/india-geo";
import { LOCATIONS, type OfficeType } from "@/data/locations";
import { cn } from "@/lib/utils";

// viewBox is "0 0 612 696" — used to convert map coords into % offsets so we can
// overlay crisp HTML pins/tooltips on top of the SVG silhouette.
const [, , VB_W, VB_H] = INDIA_VIEWBOX.split(" ").map(Number);

const TYPE_STYLES: Record<OfficeType, { ring: string; label: string }> = {
  "Head Office": { ring: "bg-accent", label: "Head Office" },
  "Regional Office": { ring: "bg-steel", label: "Regional Office" },
  "Site Office": { ring: "bg-emerald-400", label: "Site Office" },
};

export function Presence() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="presence"
      className="relative overflow-hidden bg-concrete-950 py-24 md:py-32"
    >
      <div className="section-shell relative grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Where We Work"
            title="A growing *footprint* across India."
            description="From our base in Gujarat, we deliver and maintain projects across multiple states — coordinated through head, regional and site offices."
          />

          {/* Legend + office list */}
          <div className="mt-8 flex flex-wrap gap-4">
            {Object.entries(TYPE_STYLES).map(([type, s]) => (
              <span
                key={type}
                className="inline-flex items-center gap-2 text-xs text-concrete-300"
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", s.ring)} />
                {s.label}
              </span>
            ))}
          </div>

          <Reveal delay={0.1}>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {LOCATIONS.map((loc) => (
                <li
                  key={loc.id}
                  onMouseEnter={() => setActive(loc.id)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                    active === loc.id
                      ? "border-accent/50 bg-concrete-900"
                      : "border-concrete-800 bg-concrete-900/40",
                  )}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  <span className="font-medium text-concrete-50">{loc.city}</span>
                  <span className="ml-auto text-xs text-concrete-500">
                    {loc.type === "Head Office" ? "HQ" : loc.state}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal y={36}>
          <div
            className="relative mx-auto w-full max-w-md"
            style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
          >
            {/* faint glow behind the map */}
            <div className="pointer-events-none absolute inset-0 bg-radial-fade blur-2xl" />

            <motion.svg
              viewBox={INDIA_VIEWBOX}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              role="img"
              aria-label="Map of India showing our office locations"
            >
              {INDIA_STATES.map((st) => (
                <path
                  key={st.id}
                  d={st.d}
                  className="fill-concrete-800/70 stroke-concrete-600/60"
                  strokeWidth={0.5}
                />
              ))}
            </motion.svg>

            {/* HTML pin overlay */}
            {LOCATIONS.map((loc, i) => {
              const style = TYPE_STYLES[loc.type];
              const isActive = active === loc.id;
              return (
                <motion.button
                  key={loc.id}
                  type="button"
                  onMouseEnter={() => setActive(loc.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(loc.id)}
                  onBlur={() => setActive(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    delay: 0.4 + i * 0.1,
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(loc.x / VB_W) * 100}%`,
                    top: `${(loc.y / VB_H) * 100}%`,
                  }}
                  aria-label={`${loc.type}: ${loc.city}, ${loc.state}`}
                >
                  {/* pulsing ring */}
                  <span
                    className={cn(
                      "absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 animate-pulse-ring",
                      style.ring,
                    )}
                  />
                  <span
                    className={cn(
                      "relative block h-2.5 w-2.5 rounded-full ring-2 ring-concrete-950",
                      style.ring,
                    )}
                  />

                  {/* tooltip */}
                  <span
                    className={cn(
                      "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-concrete-700 bg-concrete-900 px-3 py-1.5 text-left shadow-lift transition-all duration-200",
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0",
                    )}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-concrete-50">
                      <Building className="h-3 w-3 text-accent" />
                      {loc.city}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-concrete-400">
                      {loc.type}
                    </span>
                  </span>
                </motion.button>
              );
            })}

            {/* scope note */}
            <span className="absolute -bottom-7 right-0 inline-flex items-center gap-1 text-[10px] text-concrete-600">
              <Navigation className="h-3 w-3" />
              Stylized map — locations approximate
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
