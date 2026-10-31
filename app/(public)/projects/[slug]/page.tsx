import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitHubIcon } from "@/components/icons";
import { getProject, getProjects } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="text-primary mt-2 text-lg text-pretty">{project.tagline}</p>
        <p className="text-muted-foreground mt-4 text-sm">{project.role}</p>

        {(project.githubUrl || project.demoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium"
              >
                <ExternalLink className="size-4" /> Live demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-accent inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium"
              >
                <GitHubIcon className="size-4" /> Source code
              </a>
            )}
          </div>
        )}
      </header>

      {project.coverImage && (
        <Image
          src={project.coverImage}
          alt={`${project.title} screenshot`}
          width={1200}
          height={675}
          className="mt-10 w-full rounded-xl border object-cover"
          priority
        />
      )}

      <dl className="mt-10 grid gap-3 sm:grid-cols-2">
        {project.metrics.map((m) => (
          <div key={m.label} className="bg-card rounded-lg border p-4">
            <dd className="text-2xl font-semibold">{m.value}</dd>
            <dt className="text-muted-foreground mt-1 text-sm">{m.label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">The problem</h2>
        <p className="mt-3 leading-relaxed text-pretty">{project.problem}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">The approach</h2>
        <p className="mt-3 leading-relaxed text-pretty">{project.solution}</p>
        <ul className="mt-5 space-y-3">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 leading-relaxed">
              <span className="bg-primary mt-2.5 size-1.5 shrink-0 rounded-full" aria-hidden />
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Challenges and trade-offs</h2>
        <ul className="mt-4 space-y-3">
          {project.challenges.map((c) => (
            <li
              key={c}
              className="bg-muted/40 border-l-primary rounded-lg border-l-2 px-4 py-3 leading-relaxed"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Tech stack</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <li
              key={t}
              className="bg-secondary text-secondary-foreground rounded-md px-2.5 py-1 text-sm"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
