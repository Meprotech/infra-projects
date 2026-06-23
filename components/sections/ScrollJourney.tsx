"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";

// Real project photography from /public, shown as a scroll-driven crossfade.
const SLIDES = [
  {
    src: "/1.webp",
    num: "01",
    title: "Treatment at scale",
    body: "Clarifiers, digesters and treatment works that turn raw water and sewage into safe, compliant output.",
  },
  {
    src: "/2.webp",
    num: "02",
    title: "Pumping & aeration",
    body: "Pumping stations, aeration basins and elevated reservoirs engineered for real, sustained load.",
  },
  {
    src: "/3.webp",
    num: "03",
    title: "Across the region",
    body: "Schemes that reach across districts — from headworks and intake to the last village connection.",
  },
  {
    src: "/4.webp",
    num: "04",
    title: "Built to last",
    body: "Precision-built, audited at every stage, and maintained for the communities that depend on it.",
  },
];

function Slide({
  src,
  alt,
  progress,
  index,
  total,
}: {
  src: string;
  alt: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const seg = 1 / total;
  const start = index * seg;
  // Slide 0 is the base layer; the rest fade in over the previous as the
  // matching segment is reached (and back out when scrolling up).
  const opacity = useTransform(
    progress,
    [Math.max(0, start - seg * 0.6), start],
    [index === 0 ? 1 : 0, 1],
  );
  // Slow Ken-Burns zoom across the whole section for life.
  const scale = useTransform(progress, [0, 1], [1.06, 1.18]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
    </motion.div>
  );
}

function Caption({
  slide,
  progress,
  index,
  total,
}: {
  slide: (typeof SLIDES)[number];
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;
  const opacity = useTransform(
    progress,
    [start, start + seg * 0.18, end - seg * 0.18, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [40, -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-20 left-0 right-0 md:bottom-24"
    >
      <div className="section-shell">
        <div className="max-w-xl">
          <span className="font-heading text-sm font-semibold tracking-[0.3em] text-white">
            {slide.num}
          </span>
          <h3 className="mt-3 font-heading text-3xl font-bold leading-[1.05] tracking-tight text-white drop-shadow sm:text-4xl md:text-5xl">
            {slide.title}
          </h3>
          <p className="mt-3 max-w-md text-base text-white/80 sm:text-lg">
            {slide.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Static, no-scroll-hijack version for reduced-motion users. */
function StaticJourney() {
  return (
    <section className="relative overflow-hidden border-y border-concrete-800 bg-concrete-950 py-24">
      <BlueprintGrid />
      <div className="section-shell relative">
        <span className="eyebrow">
          <span className="h-px w-6 bg-accent" />
          How We Build
        </span>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {SLIDES.map((s) => (
            <figure
              key={s.src}
              className="overflow-hidden rounded-2xl border border-concrete-700"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={s.src}
                  alt={`${s.title} — water infrastructure project`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-5">
                <span className="font-heading text-xs font-semibold tracking-[0.3em] text-accent">
                  {s.num}
                </span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-concrete-50">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-concrete-400">{s.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScrollJourney() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (mounted && reduce) return <StaticJourney />;

  return (
    <section
      ref={ref}
      className="relative bg-concrete-950"
      // inline position guarantees a non-static scroll container even before
      // the CSS class loads (avoids a transient useScroll warning).
      style={{ position: "relative", height: mobile ? "340vh" : "420vh" }}
      aria-label="How we build — project showcase"
    >
      <div className="sticky top-0 h-screen overflow-hidden border-y border-concrete-800">
        {/* crossfading photography */}
        {SLIDES.map((s, i) => (
          <Slide
            key={s.src}
            src={s.src}
            alt={`${s.title} — water infrastructure project`}
            progress={scrollYProgress}
            index={i}
            total={SLIDES.length}
          />
        ))}

        {/* dark scrims for white type */}
        <div className="pointer-events-none absolute inset-0 bg-black/30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/45" />

        {/* eyebrow + counter pinned top */}
        <div className="section-shell pointer-events-none relative z-10 flex items-center justify-between pt-24 md:pt-28">
          <span className="eyebrow text-white">
            <span className="h-px w-6 bg-white" />
            How We Build
          </span>
          <Counter progress={scrollYProgress} total={SLIDES.length} />
        </div>

        {/* captions */}
        {SLIDES.map((s, i) => (
          <Caption
            key={s.src}
            slide={s}
            progress={scrollYProgress}
            index={i}
            total={SLIDES.length}
          />
        ))}
      </div>
    </section>
  );
}

/** Small NN / TT progress counter that tracks the active slide. */
function Counter({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    return progress.on("change", (v) => {
      setCurrent(Math.min(total, Math.floor(v * total) + 1));
    });
  }, [progress, total]);
  return (
    <span className="font-heading text-xs font-medium tracking-[0.2em] text-white/80">
      0{current} <span className="text-white/40">/ 0{total}</span>
    </span>
  );
}
