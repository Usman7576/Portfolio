import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-card hover:border-primary/40 group relative flex h-full flex-col rounded-xl border p-6 transition-colors">
      <h3 className="text-xl font-semibold">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      <p className="text-primary mt-1 text-sm">{project.tagline}</p>

      <h4 className="text-muted-foreground mt-5 text-xs font-medium tracking-wider uppercase">
        The problem
      </h4>
      <p className="mt-1 line-clamp-4 text-sm leading-relaxed">{project.problem}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        {project.metrics.slice(0, 2).map((m) => (
          <div key={m.label} className="bg-muted/50 rounded-lg p-3">
            <dt className="text-muted-foreground text-xs">{m.label}</dt>
            <dd className="mt-1 text-lg font-semibold">{m.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
        {project.techStack.map((t) => (
          <li
            key={t}
            className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center gap-5 pt-6 text-sm font-medium">
        <span className="text-primary inline-flex items-center gap-1">
          Read case study
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary relative z-10 inline-flex items-center gap-1.5"
          >
            <GitHubIcon className="size-4" /> Source
          </a>
        )}
      </div>
    </article>
  );
}
