"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
                    className="absolute inset-0 z-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.slice(0, 4).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                className={index === 3 ? "lg:hidden" : undefined}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex justify-center">
          {/* Sliding-fill button (adapted from Uiverse by nathAd17) */}
          <Link
            href="/projects#page-top"
            scroll
            className="group relative isolate z-10 flex w-fit items-center gap-2 overflow-hidden rounded-full border-2 border-concrete-700 bg-concrete-900 px-6 py-3 text-sm font-semibold text-concrete-50 shadow-lg transition-all duration-700 before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-full before:bg-accent before:transition-all before:duration-700 hover:text-concrete-950 hover:before:left-0 hover:before:scale-150 sm:text-base"
          >
            View All Projects
            <svg
              className="h-8 w-8 rotate-45 rounded-full border border-concrete-600 p-2 duration-300 ease-linear group-hover:rotate-90 group-hover:border-none group-hover:bg-concrete-950"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-concrete-50"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
