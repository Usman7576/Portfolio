import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { getFeaturedProjects, site } from "@/lib/content";

export default async function Home() {
  const projects = await getFeaturedProjects();

  return (
    <>
      {/* Hero. The 3D neural-network scene arrives in Week 3; this glow is its static fallback. */}
      <section className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:py-32">
          <div>
            <p className="text-primary mb-4 font-mono text-sm">{site.title}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Hi, I&apos;m {site.name}.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">{site.pitch}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium transition-colors"
              >
                View projects <ArrowRight className="size-4" />
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-accent inline-flex h-10 items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors"
              >
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </div>
          </div>
          <div
            className="hero-orb mx-auto hidden aspect-square w-full max-w-sm md:block"
            aria-hidden
          />
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Projects</h2>
        <p className="text-muted-foreground mt-2">
          Real problems, working software, measured results.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.slug} className="bg-card flex flex-col rounded-xl border p-6">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-primary mt-1 text-sm">{project.tagline}</p>

              <h4 className="text-muted-foreground mt-5 text-xs font-medium tracking-wider uppercase">
                The problem
              </h4>
              <p className="mt-1 text-sm leading-relaxed">{project.problem}</p>

              <h4 className="text-muted-foreground mt-4 text-xs font-medium tracking-wider uppercase">
                What I built
              </h4>
              <p className="mt-1 text-sm leading-relaxed">{project.solution}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                {project.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="bg-muted/50 rounded-lg p-3">
                    <dt className="text-muted-foreground text-xs">{m.label}</dt>
                    <dd className="mt-1 text-lg font-semibold">{m.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-5 flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <li
                    key={t}
                    className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary mt-6 inline-flex items-center gap-2 text-sm font-medium"
                >
                  <GitHubIcon className="size-4" /> Source code
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-24 sm:px-6">
        <div className="bg-card rounded-xl border p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight">Let&apos;s talk</h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md">
            Open to AI engineering roles and internships. The fastest way to reach me is email.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex h-10 items-center rounded-md px-5 text-sm font-medium transition-colors"
          >
            {site.email}
          </a>
        </div>
      </section>
    </>
  );
}
