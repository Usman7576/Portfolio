import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import { ProjectCover } from "@/components/project-cover";
import { TiltCard } from "@/components/tilt-card";
import type { Project } from "@/lib/content";

// Compact card: image, title, a short description of the problem, then the two links.
// Numbers, stack and the full story live on the case-study page.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard>
      <article className="bg-card hover:border-primary/40 group relative flex h-full flex-col overflow-hidden rounded-xl border transition-colors">
        <ProjectCover project={project} className="border-b" />
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold">
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
            {project.problem}
          </p>

          <div className="mt-auto flex items-center gap-5 pt-4 text-sm font-medium">
            <span className="text-primary inline-flex items-center gap-1">
              Case study
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary relative z-10 inline-flex items-center gap-1.5"
              >
                <GitHubIcon className="size-4" /> GitHub
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
