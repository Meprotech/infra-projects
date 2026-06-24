"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { SITE } from "@/data/site";
import { EASE } from "@/lib/motion";

/**
 * CW-style full-screen navigation overlay: big numbered links on hairline rows
 * with a staggered reveal. Closes on link click, the Close button, or Escape.
 */
export function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-concrete-900"
        >
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />

          {/* overlay header */}
          <div className="section-shell relative flex h-16 items-center justify-between md:h-20">
            <span className="flex items-center gap-2.5">
              <span className="relative h-10 w-12">
                <Image
                  src={SITE.logo.mark}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </span>
              <span className="font-heading text-sm font-bold tracking-tight text-concrete-50 sm:text-base">
                {SITE.name}
              </span>
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium text-concrete-300 transition-colors hover:text-accent"
            >
              Close <X className="h-4 w-4" />
            </button>
          </div>

          {/* big numbered links */}
          <nav className="section-shell relative mt-4 pb-16 md:mt-10">
            <ul>
              {SITE.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: EASE }}
                  className="group border-t border-concrete-700"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-4 md:py-5"
                  >
                    <span className="font-heading text-3xl font-semibold tracking-tight text-concrete-50 transition-all duration-300 group-hover:translate-x-3 group-hover:text-accent sm:text-5xl md:text-6xl">
                      {item.label}
                    </span>
                    <span className="flex items-center gap-3 font-heading text-xs font-medium text-concrete-400 transition-colors group-hover:text-accent">
                      0{i + 1}
                      <ArrowUpRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* contact + socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-col gap-4 border-t border-concrete-700 pt-8 text-sm text-concrete-400 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-6">
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {SITE.contact.email}
                </a>
                {SITE.contact.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={`tel:${phone.href}`}
                    className="transition-colors hover:text-accent"
                  >
                    {phone.label}
                  </a>
                ))}
              </div>
              <div className="flex gap-5">
                {SITE.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
