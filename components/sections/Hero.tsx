import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh+80px)] items-center justify-center overflow-hidden bg-black text-center"
    >
      {/* Full-bleed background image. Swap public/hero.webp with the real photo
          (keep the same path/filename). */}
      <div className="absolute inset-x-0 -top-2 -bottom-8 z-0">
        <div className="hero-media absolute inset-0 origin-bottom">
          <Image
            src="/hero-treatment-plant.webp"
            alt="Aerial view of a water treatment and supply plant"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
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
