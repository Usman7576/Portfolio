import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { PersonJsonLd } from "@/components/person-json-ld";
import { SectionHeading } from "@/components/section-heading";
import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { about, getFeaturedProjects, getPosts } from "@/lib/content";

export default async function Home() {
  const [projects, posts] = await Promise.all([getFeaturedProjects(), getPosts()]);

  return (
    <>
      <PersonJsonLd />
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Featured work"
            title="Real problems, working software"
            description="Each project starts with someone losing time or being left out, and ends with numbers I measured."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      <Skills />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-start">
          <SectionHeading eyebrow="About" title="A bit about me" />
          <div>
            <p className="text-lg leading-relaxed text-pretty">{about.short}</p>
            <Link
              href="/about"
              className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium"
            >
              More about me <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Writing" title="Latest posts" />
          </Reveal>
          <ul className="mt-8 divide-y border-y">
            {posts.slice(0, 3).map((post) => (
              <li key={post.slug} className="py-4">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary font-medium">
                  {post.title}
                </Link>
                <p className="text-muted-foreground mt-1 text-sm">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactCta />
    </>
  );
}
