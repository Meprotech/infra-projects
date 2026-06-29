"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CLIENTS } from "@/data/clients";
import { cn } from "@/lib/utils";

interface ClientGridProps {
  limit?: number;
  className?: string;
}

export function ClientGrid({ limit, className }: ClientGridProps) {
  const clients = typeof limit === "number" ? CLIENTS.slice(0, limit) : CLIENTS;
  const twoColumns = splitIntoColumns(clients, 2);
  const threeColumns = splitIntoColumns(clients, 3);

  return (
    <div
      className={cn(
        "relative mt-10 flex max-h-[560px] justify-center gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] sm:mt-14 md:max-h-[720px] md:gap-6",
        className,
      )}
    >
      <ClientColumn clients={twoColumns[0]} duration={24} compact className="md:hidden" />
      <ClientColumn clients={twoColumns[1]} duration={29} compact className="md:hidden" />

      <ClientColumn clients={twoColumns[0]} duration={24} className="hidden md:block lg:hidden" />
      <ClientColumn clients={twoColumns[1]} duration={29} className="hidden md:block lg:hidden" />

      <ClientColumn clients={threeColumns[0]} duration={22} className="hidden lg:block" />
      <ClientColumn clients={threeColumns[1]} duration={28} className="hidden lg:block" />
      <ClientColumn clients={threeColumns[2]} duration={25} className="hidden lg:block" />
    </div>
  );
}

function ClientColumn({
  clients,
  className,
  duration,
  compact = false,
}: {
  clients: typeof CLIENTS;
  className?: string;
  duration: number;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const repeatedClients = reduceMotion ? clients : [...clients, ...clients];

  return (
    <div className={cn("w-full max-w-sm", compact && "max-w-none", className)}>
      <motion.div
        animate={reduceMotion ? undefined : { y: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {repeatedClients.map((client, index) => (
          <React.Fragment key={`${client.id}-${index}`}>
            <ClientCard client={client} compact={compact} />
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

function ClientCard({
  client,
  compact = false,
}: {
  client: (typeof CLIENTS)[number];
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "group w-full border border-concrete-700 bg-concrete-900 shadow-lg shadow-concrete-700/20 transition-colors hover:bg-concrete-800",
        compact ? "rounded-2xl p-3" : "rounded-3xl p-6 sm:p-8",
      )}
    >
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden bg-white ring-1 ring-concrete-700",
          compact ? "h-20 rounded-xl p-3" : "h-28 rounded-2xl p-5",
        )}
      >
        <Image
          src={client.logo}
          alt={`${client.name} logo`}
          fill
          sizes={compact ? "45vw" : "(max-width: 768px) 320px, 360px"}
          className={cn(
            "object-contain transition-transform duration-300 group-hover:scale-[1.03]",
            compact ? "p-3" : "p-5",
          )}
        />
      </div>

      <h3
        className={cn(
          "font-heading font-semibold leading-tight tracking-tight text-concrete-50",
          compact ? "mt-4 text-sm" : "mt-7 text-xl",
        )}
      >
        {client.name}
      </h3>
      <p
        className={cn(
          "leading-relaxed text-concrete-400",
          compact ? "mt-2 text-xs" : "mt-3 text-sm",
        )}
      >
        {client.detail ?? "Infrastructure and construction partner"}
      </p>
    </article>
  );
}

function splitIntoColumns<T>(items: T[], count: number) {
  return items.reduce<T[][]>(
    (columns, item, index) => {
      columns[index % count].push(item);
      return columns;
    },
    Array.from({ length: count }, () => []),
  );
}
