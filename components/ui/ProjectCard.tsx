"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { EASE } from "@/lib/motion";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl border border-concrete-700 bg-concrete-900"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-concrete-950 via-concrete-950/30 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
          {project.sector}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-concrete-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {project.state}
          </span>
          <span className="h-1 w-1 rounded-full bg-concrete-600" />
          <span>{project.year}</span>
        </div>

        <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-concrete-50">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-concrete-400">
          {project.blurb}
        </p>

        <div className="mt-4 flex items-center gap-1.5 border-t border-concrete-700 pt-4 text-xs text-concrete-300">
          <Building2 className="h-3.5 w-3.5 text-concrete-500" />
          <span className="font-medium">{project.client}</span>
        </div>
      </div>
    </motion.article>
  );
}
