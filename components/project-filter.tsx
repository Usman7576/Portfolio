"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [tag, setTag] = useState<string | null>(null);

  const tags = [...new Set(projects.flatMap((p) => p.techStack))].sort((a, b) =>
    a.localeCompare(b),
  );
  const visible = tag ? projects.filter((p) => p.techStack.includes(tag)) : projects;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
        {[null, ...tags].map((t) => (
          <button
            key={t ?? "all"}
            type="button"
            onClick={() => setTag(t)}
            aria-pressed={tag === t}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              tag === t
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t ?? "All"}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground mt-6 text-sm" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
        {tag && ` using ${tag}`}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
