"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { MapPin, Navigation, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { INDIA_STATES, INDIA_VIEWBOX } from "@/data/india-geo";
import { LOCATIONS, type OfficeLocation } from "@/data/locations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const [, , VB_W, VB_H] = INDIA_VIEWBOX.split(" ").map(Number);
const EXTRUDE = [8, 6.5, 5, 3.5, 2];
const CAMERA_EASE = [0.77, 0, 0.175, 1] as const;

type FocusPhase = "idle" | "moving" | "settled";

function cameraFor(loc: OfficeLocation | undefined, reduce: boolean) {
  if (!loc) {
    return { scale: 1, x: "0%", y: "0%", rotateX: 0, rotateY: 0 };
  }

  const scale = reduce ? 1.45 : 2.15;
  const horizontalTilt = loc.x < VB_W / 2 ? 5 : -5;

  return {
    scale,
    x: `${(0.5 - loc.x / VB_W) * scale * 100}%`,
    y: `${(0.5 - loc.y / VB_H) * scale * 100}%`,
    rotateX: reduce ? 0 : 4,
    rotateY: reduce ? 0 : horizontalTilt,
  };
}

const statesContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.012, delayChildren: 0.08 } },
};

const stateVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export function Presence() {
  const reduce = Boolean(useReducedMotion());
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [phase, setPhase] = useState<FocusPhase>("idle");
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLoc = LOCATIONS.find((location) => location.id === activePinId);
  const activeState = activeLoc
    ? INDIA_STATES.find((state) => state.name === activeLoc.state)
    : undefined;

  const clearSettleTimer = () => {
    if (settleTimer.current) {
      clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
  };

  const resetMap = () => {
    clearSettleTimer();
    setPhase("idle");
    setActivePinId(null);
  };

  const focusCity = (location: OfficeLocation) => {
    if (location.id === activePinId && phase !== "moving") {
      resetMap();
      return;
    }

    clearSettleTimer();
    setActivePinId(location.id);
    setPhase("moving");
    settleTimer.current = setTimeout(
      () => setPhase("settled"),
      reduce ? 80 : 900,
    );
  };

  useEffect(() => () => clearSettleTimer(), []);

  useEffect(() => {
    if (!activePinId) return;

    const zoomOutOnNextClick = () => resetMap();
    document.addEventListener("click", zoomOutOnNextClick);

    return () => document.removeEventListener("click", zoomOutOnNextClick);
  }, [activePinId]);

  return (
    <section
      id="presence"
      className="relative overflow-hidden bg-concrete-950 py-24 md:py-32"
    >
      <div className="section-shell relative grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="Where We Work"
            title="A growing *footprint* across India."
            description="From our base in Gujarat, we deliver and maintain projects across multiple states, coordinated through head, regional and site offices."
          />

          <Reveal delay={0.1}>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {LOCATIONS.map((location) => {
                const isActive = activePinId === location.id;

                return (
                  <li key={location.id}>
                    <button
                      type="button"
                      onClick={() => focusCity(location)}
                      className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${
                        isActive
                          ? "border-concrete-300 bg-concrete-800"
                          : "border-concrete-700 bg-concrete-900/60 hover:border-concrete-500"
                      }`}
                      aria-pressed={isActive}
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
                          isActive
                            ? "bg-concrete-50 text-concrete-950"
                            : "bg-concrete-800 text-concrete-300"
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-medium text-concrete-50">
                        {location.city}
                      </span>
                      <span className="ml-auto text-xs text-concrete-400">
                        {location.type === "Head Office"
                          ? "Head Office"
                          : location.state}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="mt-5 flex min-h-7 flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-concrete-400">
              <Navigation className="h-3 w-3" />
              Select a city to enter the map.
            </p>
            <AnimatePresence>
              {activeLoc && (
                <motion.button
                  type="button"
                  onClick={resetMap}
                  initial={{ opacity: 0, transform: "translateX(-6px)" }}
                  animate={{ opacity: 1, transform: "translateX(0)" }}
                  exit={{ opacity: 0, transform: "translateX(-6px)" }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-concrete-700 px-3 py-1 text-[11px] font-medium text-concrete-200 transition-[border-color,color,transform] duration-150 hover:border-concrete-400 hover:text-concrete-50 active:scale-[0.97]"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset map
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Reveal y={28} className="order-1 lg:order-2">
          <div
            className={`india-map-viewport mx-auto ${
              activeLoc ? "is-focused" : ""
            }`}
            style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
          >
            {activeLoc && (
              <button
                type="button"
                className="india-map-dismiss"
                onClick={resetMap}
                aria-label="Zoom out and show the full India map"
              />
            )}

            <div className="india-map-grid" aria-hidden />

            <motion.div
              className="india-map-camera"
              initial={{ opacity: 0, transform: "scale(0.96)" }}
              whileInView={{ opacity: 1, transform: "scale(1)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.div
                className="india-map-plane"
                animate={cameraFor(activeLoc, reduce)}
                transition={
                  reduce
                    ? { duration: 0.2 }
                    : { duration: 0.9, ease: CAMERA_EASE }
                }
              >
                <svg
                  className="india-map-svg"
                  viewBox={INDIA_VIEWBOX}
                  role="img"
                  aria-label="Interactive map of India showing office locations"
                >
                  <defs>
                    <linearGradient
                      id="indiaMapFace"
                      x1="0"
                      y1="0"
                      x2="0.9"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#f4f1ea" />
                      <stop offset="0.52" stopColor="#ddd8ce" />
                      <stop offset="1" stopColor="#c7c0b5" />
                    </linearGradient>
                    <linearGradient
                      id="indiaMapFocus"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#3d3a33" />
                      <stop offset="1" stopColor="#171612" />
                    </linearGradient>
                    <filter id="indiaMapShadow" x="-20%" y="-20%" width="140%" height="150%">
                      <feDropShadow
                        dx="0"
                        dy="11"
                        stdDeviation="8"
                        floodColor="#171612"
                        floodOpacity="0.24"
                      />
                    </filter>
                  </defs>

                  <g filter="url(#indiaMapShadow)">
                    {EXTRUDE.map((offset, layer) => (
                      <g key={offset} transform={`translate(0 ${offset})`}>
                        {INDIA_STATES.map((state) => (
                          <path
                            key={`${state.id}-${layer}`}
                            d={state.d}
                            fill={layer < 2 ? "#8f887d" : "#aaa397"}
                          />
                        ))}
                      </g>
                    ))}

                    <motion.g
                      variants={statesContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.35 }}
                    >
                      {INDIA_STATES.map((state) => (
                        <motion.path
                          key={state.id}
                          d={state.d}
                          fill="url(#indiaMapFace)"
                          stroke="#817a70"
                          strokeWidth={0.55}
                          strokeLinejoin="round"
                          variants={stateVariant}
                        />
                      ))}
                    </motion.g>

                    <AnimatePresence>
                      {activeState && (
                        <motion.path
                          key={activeState.id}
                          d={activeState.d}
                          fill="url(#indiaMapFocus)"
                          stroke="#0d0c0a"
                          strokeWidth={1}
                          strokeLinejoin="round"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: phase === "settled" ? 0.94 : 0.45 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                        />
                      )}
                    </AnimatePresence>
                  </g>
                </svg>

                <div className="india-map-pins">
                  {LOCATIONS.map((location) => {
                    const isActive = activePinId === location.id;
                    const isDimmed = Boolean(activePinId) && !isActive;

                    return (
                      <motion.button
                        type="button"
                        key={location.id}
                        onClick={() => focusCity(location)}
                        className={`india-map-pin ${
                          isActive ? "is-active" : ""
                        }`}
                        style={
                          {
                            "--pin-x": `${(location.x / VB_W) * 100}%`,
                            "--pin-y": `${(location.y / VB_H) * 100}%`,
                          } as React.CSSProperties
                        }
                        animate={{
                          opacity: isDimmed ? 0.18 : 1,
                          transform: isActive
                            ? "translate(-50%, -50%) scale(1.08)"
                            : "translate(-50%, -50%) scale(1)",
                        }}
                        transition={{ duration: 0.22 }}
                        aria-label={`Focus ${location.city}, ${location.state}`}
                        aria-pressed={isActive}
                      >
                        <span className="india-map-pin__halo" aria-hidden />
                        <span className="india-map-pin__stem" aria-hidden />
                        <span className="india-map-pin__core" aria-hidden />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeLoc && phase === "settled" && (
                <motion.div
                  key={activeLoc.id}
                  className="india-city-reveal"
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          transform:
                            "translate(-50%, -42%) rotateX(-24deg) rotateY(8deg) scale(0.94)",
                          filter: "blur(5px)",
                        }
                  }
                  animate={{
                    opacity: 1,
                    transform:
                      "translate(-50%, -50%) rotateX(0deg) rotateY(0deg) scale(1)",
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    transform:
                      "translate(-50%, -54%) rotateX(12deg) scale(0.97)",
                    filter: "blur(3px)",
                  }}
                  transition={{ duration: reduce ? 0.18 : 0.48, ease: [0.23, 1, 0.32, 1] }}
                  aria-live="polite"
                >
                  <span className="india-city-reveal__kicker">
                    {activeLoc.state}
                  </span>
                  <strong
                    className="india-city-reveal__name"
                    data-text={activeLoc.city}
                  >
                    {activeLoc.city}
                  </strong>
                  <span className="india-city-reveal__type">
                    {activeLoc.type}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase === "moving" && (
                <motion.div
                  className="india-map-status"
                  initial={{
                    opacity: 0,
                    transform: "translate(-50%, 6px)",
                  }}
                  animate={{
                    opacity: 1,
                    transform: "translate(-50%, 0)",
                  }}
                  exit={{
                    opacity: 0,
                    transform: "translate(-50%, 3px)",
                  }}
                  transition={{ duration: 0.18 }}
                >
                  <span />
                  Locating {activeLoc?.city}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="india-map-vignette" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
