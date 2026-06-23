import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore our portfolio of water supply, sewerage, drainage, irrigation and environmental infrastructure projects across India.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Public works, *delivered*."
        description="Filter by state or sector to explore representative projects. All entries are placeholders pending real project data."
      />
      <section className="bg-concrete-950 py-16 md:py-20">
        <div className="section-shell" data-aos="fade-up">
          <ProjectsExplorer />
        </div>
      </section>
    </>
  );
}
