"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_SLIDES = [
  {
    src: "/hero-treatment-plant.webp",
    alt: "Aerial view of a water treatment and supply plant",
    position: "object-bottom",
  },
  {
    src: "/1.webp",
    alt: "Kalathiya Infrastructure project",
    position: "object-center",
  },
  {
    src: "/2.webp",
    alt: "Kalathiya Infrastructure construction project",
    position: "object-center",
  },
  {
    src: "/3.webp",
    alt: "Kalathiya Infrastructure development work",
    position: "object-center",
  },
  {
    src: "/4.webp",
    alt: "Kalathiya Infrastructure completed project",
    position: "object-center",
  },
] as const;

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const [slidesReady, setSlidesReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const preloadTimer = window.setTimeout(async () => {
      await Promise.all(
        HERO_SLIDES.slice(1).map(
          ({ src }) =>
            new Promise<void>((resolve) => {
              const image = new window.Image();
              image.onload = () => resolve();
              image.onerror = () => resolve();
              image.src = src;
            }),
        ),
      );
      if (!cancelled) setSlidesReady(true);
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(preloadTimer);
    };
  }, []);

  useEffect(() => {
    if (!slidesReady) return;

    let clearPreviousTimer = 0;
    const interval = window.setInterval(() => {
      if (document.hidden) return;

      setActiveSlide((current) => {
        setPreviousSlide(current);
        window.clearTimeout(clearPreviousTimer);
        clearPreviousTimer = window.setTimeout(
          () => setPreviousSlide(null),
          1600,
        );
        return (current + 1) % HERO_SLIDES.length;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(clearPreviousTimer);
    };
  }, [slidesReady]);

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh+80px)] items-center justify-center overflow-hidden bg-black text-center"
    >
      {/* Full-bleed background image. Swap public/hero.webp with the real photo
          (keep the same path/filename). */}
      <div className="absolute inset-x-0 -top-2 -bottom-8 z-0">
        <div className="hero-media absolute inset-0 origin-bottom">
          {previousSlide !== null && (
            <Image
              key={`previous-${previousSlide}`}
              src={HERO_SLIDES[previousSlide].src}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className={`hero-slide hero-slide--previous object-cover ${HERO_SLIDES[previousSlide].position}`}
              aria-hidden
            />
          )}
          <Image
            key={`active-${activeSlide}`}
            src={HERO_SLIDES[activeSlide].src}
            alt={HERO_SLIDES[activeSlide].alt}
            fill
            unoptimized
            priority={activeSlide === 0}
            sizes="100vw"
            className={`hero-slide object-cover ${HERO_SLIDES[activeSlide].position} ${
              previousSlide !== null ? "hero-slide--current" : ""
            }`}
          />
        </div>

        {/* Dark scrims so the centered white headline stays legible over a
            bright photo (and the bottom reads under the scroll cue). */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/45" />
      </div>

      <div className="section-shell relative z-10">
        <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
          Government-Approved Infrastructure
        </p>

        <h1 className="mx-auto mt-6 max-w-5xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-6xl md:text-7xl xl:text-[5.5rem]">
          <span className="hero-title-word">Building</span>{" "}
          <span className="hero-title-word">India&apos;s</span>{" "}
          <span className="hero-title-word font-serif font-medium italic">
            Infrastructure
          </span>
        </h1>

        <div className="hero-actions mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="boton-elegante inline-flex items-center justify-center tracking-wide"
          >
            Get in Touch
          </Link>
          <Link
            href="/#projects"
            className="boton-elegante boton-elegante--transparent inline-flex items-center justify-center tracking-wide"
          >
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="hero-scroll-indicator absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span className="hero-scroll-chevron">
          <ChevronDown className="h-5 w-5 text-white" />
        </span>
      </a>
    </section>
  );
}
