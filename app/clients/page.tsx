import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { ClientGrid } from "@/components/ClientGrid";
import { STATS } from "@/data/stats";
import { STRENGTHS } from "@/data/strengths";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Explore client partnerships across infrastructure, construction, engineering, water and industrial sectors.",
};

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Clients"
        title="Client partnerships, *delivered*."
        description="Discover a representative network of construction, engineering and infrastructure clients we serve through disciplined project execution."
        backHref="/#clients"
        backLabel="Back to page"
      />

      <section className="bg-concrete-950 py-16 md:py-20">
        <div className="section-shell">
          <ClientGrid />
        </div>
      </section>

      <section className="bg-concrete-900 py-20 md:py-28">
        <div className="section-shell">
          <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div className="relative mx-auto w-full max-w-xl pb-12 pr-0 sm:pb-20 sm:pr-16 lg:mx-0">
              <div className="rounded-lg bg-white p-3 shadow-[0_22px_70px_-34px_rgba(24,23,20,0.45)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src="/4.webp"
                    alt="Aerial view of water infrastructure works"
                    fill
                    sizes="(max-width: 1024px) 90vw, 520px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative mt-5 overflow-hidden rounded-[1.25rem] bg-white p-3 shadow-[0_24px_64px_-32px_rgba(24,23,20,0.45)] sm:absolute sm:-bottom-2 sm:right-0 sm:mt-0 sm:w-[58%]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image
                    src="/2.webp"
                    alt="Operational water treatment infrastructure"
                    fill
                    sizes="(max-width: 640px) 88vw, 300px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-2xl lg:mx-0">
              <span className="eyebrow">Client Value</span>
              <h2 className="mt-4 max-w-xl font-heading text-3xl font-bold leading-tight tracking-tight text-concrete-50 sm:text-4xl">
                Built to support long-term infrastructure delivery.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-concrete-400">
                Our clients work with a focused execution team that combines site
                discipline, technical risk planning and responsible project
                handover across water and civic infrastructure works.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-concrete-700 bg-white p-4 shadow-[0_18px_48px_-34px_rgba(24,23,20,0.35)]"
                  >
                    <strong className="block font-heading text-2xl font-bold leading-none text-concrete-50">
                      {stat.display ?? `${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""}`}
                    </strong>
                    <span className="mt-2 block text-xs font-semibold leading-snug text-concrete-400">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-3">
                {STRENGTHS.map((strength) => {
                  const Icon = strength.icon;

                  return (
                    <article
                      key={strength.title}
                      className="flex gap-4 rounded-2xl border border-concrete-700 bg-white p-4 shadow-[0_18px_48px_-36px_rgba(24,23,20,0.35)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-concrete-800 text-accent">
                        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-semibold text-concrete-50">
                          {strength.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-concrete-400">
                          {strength.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
