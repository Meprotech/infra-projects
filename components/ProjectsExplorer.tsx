"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, PROJECT_FILTERS } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { cn } from "@/lib/utils";

const SECTORS = [
  "All Sectors",
  "Water Supply",
  "Sewerage & Drainage",
  "Irrigation",
  "Environment",
] as const;

export function ProjectsExplorer() {
  const [state, setState] = useState<(typeof PROJECT_FILTERS)[number]>("All");
  const [sector, setSector] = useState<(typeof SECTORS)[number]>("All Sectors");

  const visible = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          (state === "All" || p.state === state) &&
          (sector === "All Sectors" || p.sector === sector),
      ),
    [state, sector],
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FilterRow
          label="State"
          options={PROJECT_FILTERS as readonly string[]}
          active={state}
          onChange={(v) => setState(v as typeof state)}
        />
        <FilterRow
          label="Sector"
          options={SECTORS as readonly string[]}
          active={sector}
          onChange={(v) => setSector(v as typeof sector)}
        />
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-concrete-500">
          No projects match these filters.
        </p>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: readonly string[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium uppercase tracking-wide text-concrete-500">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
            active === o
              ? "border-accent bg-accent text-ink"
              : "border-concrete-700 text-concrete-300 hover:border-concrete-500 hover:text-concrete-50",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
