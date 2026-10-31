import type { Metadata } from "next";
import { isUploadConfigured } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();
  const count = await getDb().project.count();

  return (
    <>
      <PageHeader title="New project" description="Saved as a draft unless you tick Published." />
      <ProjectForm
        canUpload={await isUploadConfigured()}
        project={{
          title: "",
          slug: "",
          tagline: "",
          problem: "",
          solution: "",
          role: "",
          techStack: "",
          highlights: "",
          metrics: "",
          challenges: "",
          githubUrl: "",
          demoUrl: "",
          coverImage: "",
          featured: false,
          published: false,
          order: String(count + 1),
        }}
      />
    </>
  );
}
