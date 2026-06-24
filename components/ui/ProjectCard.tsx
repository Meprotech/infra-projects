"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// forwardRef so AnimatePresence `mode="popLayout"` can measure the card.
export const ProjectCard = forwardRef<
  HTMLElement,
  { project: Project; className?: string }
>(function ProjectCard({ project, className }, ref) {
    return (
      <motion.article
        ref={ref}
        layout
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-900",
          className,
        )}
      >
      <div className="relative aspect-square overflow-hidden sm:aspect-[16/11]">
        {/* clip-path wipe reveal on scroll into view */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={`${project.name} (placeholder image)`}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-concrete-950 via-concrete-950/30 to-transparent" />
        <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-accent/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-ink sm:left-4 sm:top-4 sm:px-3 sm:text-[11px]">
          {project.sector}
        </span>
      </div>

      <div className="p-3 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-concrete-400 sm:gap-3 sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-accent sm:h-3.5 sm:w-3.5" />
            {project.state}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-concrete-600 sm:block" />
          <span>{project.year}</span>
        </div>

        <h3 className="mt-2 line-clamp-3 font-heading text-sm font-semibold leading-snug text-concrete-50 sm:mt-3 sm:line-clamp-none sm:text-lg">
          {project.name}
        </h3>
        <p className="mt-2 hidden text-sm leading-relaxed text-concrete-400 sm:block">
          {project.blurb}
        </p>

        <div className="mt-4 hidden items-center gap-1.5 border-t border-concrete-700 pt-4 text-xs text-concrete-300 sm:flex">
          <Building2 className="h-3.5 w-3.5 text-concrete-500" />
          <span className="font-medium">{project.client}</span>
        </div>
      </div>
      </motion.article>
    );
  },
);
