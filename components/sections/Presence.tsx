"use client";

/* ───────────────────────────────────────────────────────────────────────────
 * Presence — "Where We Work" map.
 *
 * ORIGINAL IMPLEMENTATION (detected):
 *   - Inline <svg> relief map of India (data/india-geo.ts, viewBox 0 0 612 696),
 *     no map library. Pins are absolutely-positioned HTML <div class="map-city">
 *     placed via CSS --x/--y percent offsets (data/locations.ts coords).
 *   - Interaction was PURE CSS hover (globals.css .map-city:hover) — no React
 *     state. Office "cards" were a static <li> list.
 *
 * PHASE 2 (this change): added click-to-zoom proof of concept.
 *   - New React state `activePinId` (the clicked loc.id, or null).
 *   - The <svg> + pin overlay are wrapped in a single Framer Motion "stage"
 *     that zooms (scale), pans (x/y, centering the clicked pin) and tilts in 3D
 *     (rotateY/rotateX) — perspective lives on .map-container, preserve-3d on
 *     the stage. Pins lock to the map (zoom together as one plane).
 *   - Clicking a pin toggles it active/inactive; clicking it again resets.
 *   - Active pin gets a pulsing emphasis ring (distinct from CSS hover).
 *
 * PHASE 3 (this change): synced the rest of the UI to `activePinId`.
 *   - Left office cards now reflect the active pin (border/bg + subtle scale).
 *     They are highlight-only (not clickable) by design.
 *   - Click-outside-to-reset: a document pointerdown listener clears the active
 *     pin when the click lands outside the map container (mapRef).
 *   - "Reset view" pill button next to the hint text, shown only while a pin is
 *     active, also clears the state.
 *   Deferred: reduced-motion snap + mobile tilt gating (Phase 4).
 *
 * 3D-CARD REFINEMENT (per reference Uiverse card): the tilt now reads as a
 *   lifted glass card — tighter perspective (850px), a combined corner-lift
 *   rotation, and a Z-pushed glass sheen.
 *   Direction flipped vs the reference: NEGATIVE rotateY tilts the plane to the
 *   RIGHT (reference's positive-Y leaned it left).
 *
 * "FULL 3D" PASS (interaction patterns sourced via 21st.dev/Magic MCP, then
 *   grafted onto our real India geometry):
 *   - Idle mouse-parallax: the resting plane tilts toward the cursor via
 *     spring-driven rotateX/rotateY motion values (rotX/rotY). Rotation now
 *     flows through that one channel; zoom+pan stay on the `animate` prop so
 *     they never fight each other.
 *   - Pin click "bend": rotX/rotY snap to the dramatic card tilt while we zoom
 *     and pan to the pin; releasing returns to flat + cursor-follow.
 *   - Glassmorphic info card flips up from the base showing the active office
 *     (city / state / type), outside the zooming stage so it stays crisp.
 *   All gated by prefers-reduced-motion (no parallax/bend/flip when set).
 * ─────────────────────────────────────────────────────────────────────────── */

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { Navigation, RotateCcw } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useEffect, useRef, useState } from "react";
import { INDIA_VIEWBOX, INDIA_STATES } from "@/data/india-geo";
import { LOCATIONS, type OfficeType, type OfficeLocation } from "@/data/locations";

// viewBox is "0 0 612 696" — convert map coords into % offsets for the pins.
const [, , VB_W, VB_H] = INDIA_VIEWBOX.split(" ").map(Number);

// Zoom + tilt tuning for the active (clicked) pin.
// The 3D feel is modelled on a "glass card" tilt: a combined corner-lift
// rotation (like CSS `rotate3d(1, -1, 0, …)`) over a tight perspective, plus a
// directional depth shadow. NOTE on direction: a POSITIVE rotateY leans the
// plane LEFT (its right edge recedes); we use a NEGATIVE rotateY so the right
// edge lifts toward the viewer → the map tilts to the RIGHT.
const ZOOM_SCALE = 1.9;
const TILT_Y = -15; // deg — negative ⇒ tilt to the RIGHT (right edge forward)
const TILT_X = 8; // deg — top edge leans back, for the card-like corner lift
const ZOOM_SPRING = { type: "spring", stiffness: 140, damping: 19 } as const;

// Idle parallax: the resting map tilts gently toward the cursor for a "living"
// 3D plane. Rotation is driven through springs so the idle wobble and the
// active "bend" share one channel and never fight the zoom animation.
const PARALLAX = 7; // deg — max idle tilt following the mouse
const ROT_SPRING = { stiffness: 150, damping: 22, mass: 0.6 } as const;

// Zoom + pan that centers `loc` in the container (rotation handled separately
// via motion-value springs). translate % is relative to the (unscaled) element
// box, which equals the container size.
function stageZoom(loc: OfficeLocation | undefined) {
  if (!loc) return { scale: 1, x: "0%", y: "0%" };
  return {
    scale: ZOOM_SCALE,
    x: `${(0.5 - loc.x / VB_W) * ZOOM_SCALE * 100}%`,
    y: `${(0.5 - loc.y / VB_H) * ZOOM_SCALE * 100}%`,
  };
}

const TYPE_META: Record<OfficeType, { emoji: string; short: string }> = {
  "Head Office": { emoji: "🏛️", short: "HQ" },
  "Regional Execution Office": { emoji: "🏢", short: "Regional" },
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
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const activeLoc = LOCATIONS.find((l) => l.id === activePinId);
  // Phase 4 will gate tilt by viewport; for the POC tilt is always on.
  const tilt = !reduce;

  // Click-outside-to-reset: any pointerdown outside the map container clears
  // the active pin and animates back to the default view.
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activePinId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setActivePinId(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activePinId]);

  // 3D rotation channel (idle mouse-parallax + active "bend"), spring-smoothed.
  const rotX = useSpring(0, ROT_SPRING);
  const rotY = useSpring(0, ROT_SPRING);

  // While a pin is active the plane holds the dramatic card-bend; otherwise it
  // rests flat (and follows the cursor via onMouseMove below).
  useEffect(() => {
    if (reduce) {
      rotX.set(0);
      rotY.set(0);
      return;
    }
    if (activePinId) {
      rotX.set(TILT_X);
      rotY.set(TILT_Y);
    } else {
      rotX.set(0);
      rotY.set(0);
    }
  }, [activePinId, reduce, rotX, rotY]);

  const handleParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || activePinId || !mapRef.current) return;
    const r = mapRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotX.set(-py * PARALLAX * 2); // top toward cursor
    rotY.set(px * PARALLAX * 2);
  };
  const handleParallaxLeave = () => {
    if (reduce || activePinId) return;
    rotX.set(0);
    rotY.set(0);
  };

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
              {LOCATIONS.map((loc) => {
                const isActive = activePinId === loc.id;
                return (
                  <motion.li
                    key={loc.id}
                    animate={{ scale: isActive ? 1.03 : 1 }}
                    transition={ZOOM_SPRING}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "border-concrete-300 bg-concrete-800"
                        : "border-concrete-700 bg-concrete-900/60 hover:border-concrete-500"
                    }`}
                  >
                    <span className="text-base leading-none">
                      {TYPE_META[loc.type].emoji}
                    </span>
                    <span className="font-medium text-concrete-50">
                      {loc.city}
                    </span>
                    <span
                      className={`ml-auto text-xs ${
                        isActive ? "text-concrete-200" : "text-concrete-400"
                      }`}
                    >
                      {loc.type === "Head Office" ? "HQ" : loc.state}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </Reveal>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-concrete-400">
              <Navigation className="h-3 w-3" />
              Click a pin to zoom in. Hover to preview. Locations approximate.
            </p>
            <AnimatePresence>
              {activePinId && (
                <motion.button
                  type="button"
                  onClick={() => setActivePinId(null)}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-concrete-700 px-3 py-1 text-[11px] font-medium text-concrete-200 transition-colors hover:border-concrete-400 hover:text-concrete-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset view
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map */}
        <Reveal y={36} className="order-1 lg:order-2">
          <motion.div
            ref={mapRef}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleParallax}
            onMouseLeave={handleParallaxLeave}
            className="map-container mx-auto overflow-hidden [perspective:850px]"
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
            {/* Zoom/pan/tilt stage — the svg + pin overlay move together as one
                3D plane. transformOrigin centre + perspective on the parent. */}
            <motion.div
              className="absolute inset-0 [transform-style:preserve-3d] [will-change:transform]"
              style={{
                transformOrigin: "center center",
                rotateX: rotX,
                rotateY: rotY,
              }}
              animate={stageZoom(activeLoc)}
              transition={ZOOM_SPRING}
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
              className={`map-cities${activePinId ? " is-zoomed" : ""}`}
              variants={pinsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {LOCATIONS.map((loc) => (
                <motion.button
                  type="button"
                  key={loc.id}
                  className={`map-city${
                    activePinId === loc.id ? " is-active" : ""
                  }`}
                  variants={pinVar}
                  onClick={() =>
                    setActivePinId((cur) => (cur === loc.id ? null : loc.id))
                  }
                  style={
                    {
                      "--x": ((loc.x / VB_W) * 100).toFixed(1),
                      "--y": ((loc.y / VB_H) * 100).toFixed(1),
                    } as React.CSSProperties
                  }
                  aria-label={`${loc.city}, ${loc.state}`}
                  aria-pressed={activePinId === loc.id}
                >
                  {/* active emphasis ring — distinct from CSS hover */}
                  {activePinId === loc.id && !reduce && (
                    <motion.span
                      className="map-city__ring"
                      initial={{ scale: 0.4, opacity: 0.7 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                  <div className="map-city__label">
                    <div className="map-city__sign anim anim-grow">
                      {loc.city}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* glass sheen — borrowed from the card style; a thin lit layer
                pushed forward in Z so it catches the light when the plane
                tilts. Only visible while a pin is active. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                transform: "translateZ(40px)",
                background:
                  "linear-gradient(105deg, rgba(255,255,255,0) 45%, rgba(255,255,255,0.18) 75%, rgba(255,255,255,0.42) 100%)",
                mixBlendMode: "soft-light",
              }}
              initial={false}
              animate={{ opacity: activePinId && tilt ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
            </motion.div>

            {/* edge vignette — sits over the viewport (outside the tilting
                stage) and fades the hard rectangular crop into the page
                background while zoomed, so there's no sharp border. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                background:
                  "linear-gradient(to right, #f4f3ee 0%, transparent 14%, transparent 86%, #f4f3ee 100%), linear-gradient(to bottom, #f4f3ee 0%, transparent 14%, transparent 86%, #f4f3ee 100%)",
              }}
              initial={false}
              animate={{ opacity: activePinId ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* glassmorphic info card — flips up from the base on pin click.
                Lives outside the zooming stage so it stays crisp/readable. */}
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 [perspective:600px] sm:right-auto sm:w-56">
              <AnimatePresence>
                {activeLoc && (
                  <motion.div
                    key={activeLoc.id}
                    initial={{ opacity: 0, y: 22, rotateX: reduce ? 0 : -35 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: 14, rotateX: reduce ? 0 : -20 }}
                    transition={
                      reduce
                        ? { duration: 0.2 }
                        : { type: "spring", stiffness: 240, damping: 22 }
                    }
                    style={{ transformOrigin: "bottom center" }}
                    className="rounded-xl border border-concrete-700/60 bg-concrete-50/90 p-3.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">
                        {TYPE_META[activeLoc.type].emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-heading text-base font-bold text-concrete-950">
                          {activeLoc.city}
                        </p>
                        <p className="truncate text-[11px] text-concrete-500">
                          {activeLoc.state}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      {activeLoc.type}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
