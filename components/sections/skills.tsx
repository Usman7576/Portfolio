import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { skillGroups } from "@/lib/content";

export function Skills() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="Toolbox"
          title="What I build with"
          description="Everything listed here is used in a project on this site."
        />
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.05}>
            <h3 className="text-sm font-medium">{group.category}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li key={skill} className="rounded-md border px-2.5 py-1 text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
