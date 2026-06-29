import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ClientGrid } from "@/components/ClientGrid";

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
    </>
  );
}
