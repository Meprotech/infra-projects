"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { CLIENTS } from "@/data/clients";

function LogoTile({ monogram, label }: { monogram: string; label: string }) {
  return (
    <div
      className="group flex h-24 w-44 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-concrete-700 bg-concrete-900/60"
      title={label}
    >
      {/* Placeholder monogram standing in for a real client logo. */}
      <span className="font-heading text-2xl font-bold tracking-wider text-concrete-500 grayscale transition-all duration-300 group-hover:text-accent group-hover:grayscale-0">
        {monogram}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-concrete-600">
        {label}
      </span>
    </div>
  );
}

export function Clients() {
  // Duplicate the list so the marquee can loop seamlessly (-50% translate).
  const row = [...CLIENTS, ...CLIENTS];

  return (
    <section className="relative overflow-hidden border-t border-concrete-800 bg-concrete-950 py-24 md:py-28">
      <div className="section-shell relative">
        <SectionHeading
          align="center"
          eyebrow="Trusted By"
          title="Working with *government & private* clients."
          description="Placeholder slots — real client logos drop in here later."
        />
      </div>

      <div
        className="group relative mt-14 flex overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
      >
        {/* The track auto-scrolls; pause on hover via group-hover. */}
        <div className="flex shrink-0 gap-5 pr-5 animate-scroll-x [animation-play-state:running] group-hover:[animation-play-state:paused]">
          {row.map((c, i) => (
            <LogoTile key={`${c.id}-${i}`} monogram={c.monogram} label={c.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
