"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Navigation } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { INDIA_VIEWBOX, INDIA_STATES } from "@/data/india-geo";
import { LOCATIONS, type OfficeType, type OfficeLocation } from "@/data/locations";

// viewBox is "0 0 612 696" — convert map coords into % offsets for the pins.
const [, , VB_W, VB_H] = INDIA_VIEWBOX.split(" ").map(Number);

const TYPE_META: Record<OfficeType, { emoji: string; short: string }> = {
  "Head Office": { emoji: "🏛️", short: "HQ" },
  "Regional Office": { emoji: "🏢", short: "Regional" },
  "Site Office": { emoji: "🚧", short: "Site" },
};

// Stacked offsets that fake the extruded "thickness" of the relief map.
const EXTRUDE = [7.2, 6, 4.8, 3.6, 2.4, 1.2];

// A curved network arc (quadratic bezier) bowing out between two offices.
function arcPath(a: OfficeLocation, b: OfficeLocation): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const lift = dist * 0.28;
  const cx = mx + (-dy / dist) * lift;
  const cy = my + (dx / dist) * lift;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export function Presence() {
  const reduce = useReducedMotion();

  const hq =
    LOCATIONS.find((l) => l.type === "Head Office") ?? LOCATIONS[0];
  const arcs = LOCATIONS.filter((l) => l.id !== hq.id).map((l) => ({
    id: l.id,
    d: arcPath(hq, l),
  }));

  const statesContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.018, delayChildren: 0.1 } },
  };
  const stateVar: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } },
  };
  const pinsContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.9 } },
  };
  const pinVar: Variants = {
    hidden: { opacity: 0, y: -24, scale: 0.4 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 380, damping: 16 },
    },
  };

  return (
    <section
      id="presence"
      className="relative overflow-hidden bg-concrete-950 py-24 md:py-32"
    >
      <div className="section-shell relative grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* On mobile the map shows first, then the info; desktop keeps
            info-left / map-right via the lg: order overrides. */}
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="Where We Work"
            title="A growing *footprint* across India."
            description="From our base in Gujarat, we deliver and maintain projects across multiple states  coordinated through head, regional and site offices."
          />

          <Reveal delay={0.1}>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {LOCATIONS.map((loc) => (
                <li
                  key={loc.id}
                  className="flex items-center gap-3 rounded-lg border border-concrete-700 bg-concrete-900/60 px-3 py-2.5 text-sm transition-colors hover:border-concrete-500"
                >
                  <span className="text-base leading-none">
                    {TYPE_META[loc.type].emoji}
                  </span>
                  <span className="font-medium text-concrete-50">{loc.city}</span>
                  <span className="ml-auto text-xs text-concrete-400">
                    {loc.type === "Head Office" ? "HQ" : loc.state}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-concrete-400">
            <Navigation className="h-3 w-3" />
            Hover a pin on the map to see the office. Locations approximate.
          </p>
        </div>

        {/* Map */}
        <Reveal y={36} className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="map-container mx-auto"
            style={
              {
                width: "100%",
                maxWidth: "30rem",
                aspectRatio: `${VB_W} / ${VB_H}`,
                boxShadow: "none",
                "--city-sign-color-back": "#181714",
                "--city-sign-color-font": "#f4f3ee",
              } as React.CSSProperties
            }
          >
            <svg
              className="map-background"
              viewBox={INDIA_VIEWBOX}
              role="img"
              aria-label="Map of India showing our office locations and network"
            >
              <defs>
                <linearGradient id="reliefTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ece8df" />
                  <stop offset="1" stopColor="#d3cdc1" />
                </linearGradient>
              </defs>

              {/* extruded side wall */}
              <motion.g
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
              >
                {EXTRUDE.map((dy, i) => (
                  <g key={i} transform={`translate(0 ${dy})`}>
                    {INDIA_STATES.map((st) => (
                      <path key={st.id} d={st.d} fill="#a79f93" />
                    ))}
                  </g>
                ))}
              </motion.g>

              {/* lit top face — states build in with a stagger */}
              <motion.g
                variants={statesContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
              >
                {INDIA_STATES.map((st) => (
                  <motion.path
                    key={st.id}
                    d={st.d}
                    fill="url(#reliefTop)"
                    stroke="#8c8579"
                    strokeWidth={0.5}
                    strokeLinejoin="round"
                    variants={stateVar}
                  />
                ))}
              </motion.g>

              {/* network: arcs from HQ + flowing dots + pulsing hub ring */}
              {!reduce && (
                <g>
                  {/* pulsing hub ring at HQ */}
                  <circle cx={hq.x} cy={hq.y} fill="none" stroke="#181714" strokeWidth={1}>
                    <animate
                      attributeName="r"
                      values="3;13"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.55;0"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {arcs.map((a, i) => (
                    <g key={a.id}>
                      <motion.path
                        id={`arc-${a.id}`}
                        d={a.d}
                        fill="none"
                        stroke="#1d1b17"
                        strokeOpacity={0.4}
                        strokeWidth={1.1}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 1,
                          delay: 0.5 + i * 0.12,
                          ease: "easeInOut",
                        }}
                      />
                      {/* dot flowing along the arc */}
                      <circle r={3.6} fill="#181714">
                        <animateMotion
                          dur="2.8s"
                          begin={`${0.7 + i * 0.25}s`}
                          repeatCount="indefinite"
                        >
                          <mpath href={`#arc-${a.id}`} />
                        </animateMotion>
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.12;0.88;1"
                          dur="2.8s"
                          begin={`${0.7 + i * 0.25}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  ))}
                </g>
              )}
            </svg>

            {/* pins — drop in with a spring stagger */}
            <motion.div
              className="map-cities"
              variants={pinsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {LOCATIONS.map((loc) => (
                <motion.div
                  key={loc.id}
                  className="map-city"
                  variants={pinVar}
                  style={
                    {
                      "--x": ((loc.x / VB_W) * 100).toFixed(1),
                      "--y": ((loc.y / VB_H) * 100).toFixed(1),
                    } as React.CSSProperties
                  }
                  aria-label={`${loc.city}, ${loc.state}`}
                >
                  <div className="map-city__label">
                    <div className="map-city__sign anim anim-grow">
                      {loc.city}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
