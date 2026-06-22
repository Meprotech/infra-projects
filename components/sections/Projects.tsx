"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS, PROJECT_FILTERS } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { cn } from "@/lib/utils";

export function Projects() {
  const [filter, setFilter] = useState<(typeof PROJECT_FILTERS)[number]>("All");

  const visible =
    filter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.state === filter);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-concrete-950 py-24 md:py-32"
    >
      <div className="section-shell relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our Work"
            title="Projects that move *communities* forward."
            description="A selection of public-infrastructure works delivered across multiple states and sectors."
          />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                  filter === f
                    ? "border-accent text-ink"
                    : "border-concrete-700 text-concrete-300 hover:border-concrete-500 hover:text-concrete-50",
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-concrete-700 px-6 py-3 text-sm font-semibold text-concrete-50 transition-colors hover:border-accent hover:text-accent"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
