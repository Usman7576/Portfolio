import { Download } from "lucide-react";
import type { Metadata } from "next";
import { PrintButton } from "@/components/print-button";
import { about, getProjects, site, skillGroups, timeline } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}, ${site.title}.`,
};

export default async function ResumePage() {
  const projects = await getProjects();
  const leadership = timeline.filter((t) => t.when === "Leadership" || t.when === "Societies");
  const education = timeline.filter((t) => t.title.startsWith("BS "));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 print:max-w-none print:p-0">
      <div className="mb-8 flex flex-wrap justify-end gap-3 print:hidden">
        <PrintButton />
        {site.resumePdf && (
          <a
            href={site.resumePdf}
            download
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium"
          >
            <Download className="size-4" /> Download PDF
          </a>
        )}
      </div>

      <article className="bg-card rounded-xl border p-6 sm:p-10 print:border-0 print:p-0">
        <header className="border-b pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
          <p className="text-primary mt-1">{site.title}</p>
          <p className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>{site.location}</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.github}>github.com/Usman7576</a>
            <a href={site.linkedin}>linkedin.com/in/usman-ai-enthusiast</a>
          </p>
        </header>

        <ResumeSection title="Summary">
          <p className="text-sm leading-relaxed">{about.short}</p>
        </ResumeSection>

        <ResumeSection title="Education">
          {education.map((e) => (
            <div key={e.title}>
              <p className="text-sm font-medium">{e.title}</p>
              <p className="text-muted-foreground text-sm">
                {e.org} · {e.when}
              </p>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Projects">
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.slug}>
                <p className="text-sm font-medium">
                  {p.title}{" "}
                  <span className="text-muted-foreground font-normal">
                    · {p.techStack.join(", ")}
                  </span>
                </p>
                <p className="text-muted-foreground text-sm">{p.role}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>{p.tagline}</li>
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                  <li>
                    {p.metrics
                      .slice(0, 2)
                      .map((m) => `${m.label}: ${m.value}`)
                      .join("; ")}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Technical skills">
          <dl className="space-y-1 text-sm">
            {skillGroups.map((g) => (
              <div key={g.category} className="flex flex-wrap gap-x-2">
                <dt className="font-medium">{g.category}:</dt>
                <dd>{g.skills.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        <ResumeSection title="Leadership and societies">
          <ul className="space-y-1 text-sm">
            {leadership.map((l) => (
              <li key={l.title + l.org}>
                <span className="font-medium">{l.title}</span>, {l.org}
              </li>
            ))}
          </ul>
        </ResumeSection>
      </article>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b py-6 last:border-0 last:pb-0">
      <h2 className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
