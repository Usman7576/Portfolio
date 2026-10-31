import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { about, skillGroups, timeline } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: about.short,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading as="h1" eyebrow="About" title="Hi, I'm Usman." />

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-pretty">
        {about.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold">Education, projects and leadership</h2>
        <ol className="mt-6 border-l">
          {timeline.map((entry) => (
            <li key={entry.title + entry.org} className="relative pb-8 pl-6 last:pb-0">
              <span
                className="bg-primary ring-background absolute top-1.5 -left-[5px] size-2.5 rounded-full ring-4"
                aria-hidden
              />
              <p className="text-muted-foreground font-mono text-xs">{entry.when}</p>
              <h3 className="mt-1 font-medium">{entry.title}</h3>
              <p className="text-muted-foreground text-sm">{entry.org}</p>
              <p className="mt-2 text-sm leading-relaxed">{entry.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold">Skills</h2>
        <dl className="mt-6 space-y-4">
          {skillGroups.map((group) => (
            <div key={group.category} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="text-muted-foreground text-sm">{group.category}</dt>
              <dd className="text-sm">{group.skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
