"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HardHat } from "lucide-react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { MenuOverlay } from "@/components/MenuOverlay";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The homepage opens on a dark cinematic hero, so the transparent navbar
  // needs light text there. Everywhere else (and once scrolled onto the white
  // chrome) it uses dark text.
  const onDark = pathname === "/" && !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-concrete-700/60 bg-concrete-950/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="section-shell flex h-16 items-center justify-between md:h-20">
          <Link
            href="/#home"
            className="group flex items-center gap-2.5"
            aria-label={`${SITE.name} home`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-ink transition-transform duration-300 group-hover:scale-105">
              <HardHat className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span
              className={cn(
                "font-heading text-base font-bold tracking-tight transition-colors",
                onDark ? "text-white" : "text-concrete-50",
              )}
            >
              {SITE.name}
            </span>
          </Link>

          {/* Minimal CW-style trigger — all navigation lives in the overlay. */}
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "group flex items-center gap-3 text-sm font-medium",
              onDark ? "text-white/90" : "text-concrete-300",
            )}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="hidden tracking-wide sm:inline">Menu</span>
            <span className="flex flex-col items-end gap-[5px]">
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-7" />
              <span className="h-px w-4 bg-current transition-all duration-300 group-hover:w-7" />
            </span>
          </button>
        </nav>
      </motion.header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
