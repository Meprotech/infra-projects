"use client";

import dynamic from "next/dynamic";
import { MapPin, Navigation, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LOCATIONS } from "@/data/locations";

const IndiaMap3D = dynamic(() => import("@/components/IndiaMap3D"), {
  ssr: false,
  loading: () => null,
});

export function Presence() {
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRegionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const mapRegion = mapRegionRef.current;
    if (!mapRegion) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadMap(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px", threshold: 0.01 },
    );

    observer.observe(mapRegion);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activePinId) return;

    const resetOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-map-control]")) return;
      setActivePinId(null);
    };
    document.addEventListener("pointerdown", resetOnOutsideClick);

    return () =>
      document.removeEventListener("pointerdown", resetOnOutsideClick);
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
                const content = (
                  <>
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-concrete-800 text-concrete-300">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium text-concrete-50">
                    {location.city}
                  </span>
                  <span className="ml-auto text-xs text-concrete-400">
                    {location.type === "Head Office"
                      ? "Head Office"
                      : location.city === location.state
                        ? "Site Office"
                        : location.state}
                  </span>
                  </>
                );

                return (
                  <li key={location.id}>
                    <button
                      type="button"
                      data-map-control
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePinId((current) =>
                          current === location.id ? null : location.id,
                        );
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${
                        isActive
                          ? "border-concrete-300 bg-concrete-800"
                          : "border-concrete-700 bg-concrete-900/60 hover:border-concrete-500"
                      }`}
                      aria-pressed={isActive}
                    >
                      {content}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="mt-5 flex min-h-7 flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-concrete-400">
              <Navigation className="h-3 w-3" />
              Click any city pin to rotate and enter the 3D map.
            </p>
            {activePinId && (
              <button
                type="button"
                data-map-control
                onClick={(event) => {
                  event.stopPropagation();
                  setActivePinId(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-concrete-700 px-3 py-1 text-[11px] font-medium text-concrete-200 transition-[border-color,color,transform] duration-150 hover:border-concrete-400 hover:text-concrete-50 active:scale-[0.97]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset view
              </button>
            )}
          </div>
        </div>

        <Reveal y={28} className="order-1 lg:order-2">
          <div
            ref={mapRegionRef}
            data-map-control
            className={`india-map-stage${mapReady ? " is-ready" : ""}`}
          >
            <div
              className="india-map-loader"
              role="status"
              aria-live="polite"
              aria-label="Preparing interactive map"
            >
              <div className="india-map-loader__orbit" aria-hidden>
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>Preparing interactive map</p>
              <span>Building the 3D state view</span>
            </div>

            {shouldLoadMap ? (
              <div className="india-map-stage__content">
                <IndiaMap3D
                  activePinId={activePinId}
                  onSelectPin={setActivePinId}
                  onReady={() => setMapReady(true)}
                  reduceMotion={reduceMotion}
                />
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
