import type { Metadata } from "next";
import { ProjectFilter } from "@/components/project-filter";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies of AI products built to solve specific, real-world problems.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        as="h1"
        eyebrow="Projects"
        title="Things I've built"
        description="Each one starts from a specific person and a problem that cost them time. Open a project for the full case study: the approach, architecture, results and what went wrong."
      />
      <ProjectFilter projects={projects} />
    </div>
  );
}
