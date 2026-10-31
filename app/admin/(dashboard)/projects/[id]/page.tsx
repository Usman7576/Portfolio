import { ExternalLink, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject, isUploadConfigured } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import type { Metric } from "@/lib/content";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const p = await getDb().project.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <>
      <PageHeader title={p.title} description="Changes go live as soon as you save." />
      <div className="mb-6 flex gap-2">
        {p.published && (
          <Link
            href={`/projects/${p.slug}`}
            target="_blank"
            className="hover:bg-accent inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium"
          >
            <ExternalLink className="size-3.5" /> View on site
          </Link>
        )}
        <ActionButton
          action={deleteProject.bind(null, p.id)}
          confirm={`Delete "${p.title}" permanently? This can't be undone.`}
          className="text-destructive"
        >
          <Trash2 className="size-3.5" /> Delete
        </ActionButton>
      </div>
      <ProjectForm
        canUpload={await isUploadConfigured()}
        project={{
          id: p.id,
          title: p.title,
          slug: p.slug,
          tagline: p.tagline,
          problem: p.problem,
          solution: p.solution,
          role: p.role,
          techStack: p.techStack.join(", "),
          highlights: p.highlights.join("\n"),
          metrics: (p.metrics as Metric[]).map((m) => `${m.value} | ${m.label}`).join("\n"),
          challenges: p.challenges.join("\n"),
          githubUrl: p.githubUrl ?? "",
          demoUrl: p.demoUrl ?? "",
          coverImage: p.coverImage ?? "",
          featured: p.featured,
          published: p.published,
          order: String(p.order),
        }}
      />
    </>
  );
}
