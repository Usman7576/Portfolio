import { ExternalLink, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { deleteResume } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader } from "@/components/admin/page-header";
import { ResumeUpload } from "@/components/admin/resume-upload";
import { requireAdmin } from "@/lib/auth-guard";
import { getResumeInfo } from "@/lib/content";

export const metadata: Metadata = { title: "Resume" };

export default async function AdminResumePage() {
  await requireAdmin();
  const resume = await getResumeInfo();

  return (
    <>
      <PageHeader
        title="Resume"
        description="The PDF visitors get from the Download button on the resume page."
      />

      <div className="bg-card mb-6 rounded-xl border p-5">
        {resume ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{resume.filename}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {(resume.size / (1024 * 1024)).toFixed(2)} MB · uploaded {resume.updatedAt}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-accent inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium"
              >
                <ExternalLink className="size-3.5" /> View
              </a>
              <ActionButton
                action={deleteResume}
                confirm="Remove the resume PDF? The Download button will disappear from the site."
                className="text-destructive"
              >
                <Trash2 className="size-3.5" /> Remove
              </ActionButton>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No PDF uploaded yet. The resume page shows only its web version until you add one.
          </p>
        )}
      </div>

      <ResumeUpload replacing={Boolean(resume)} />

      <p className="text-muted-foreground mt-6 text-sm">
        Anyone can download this file, so check it first: remove your phone number if you don&apos;t
        want it public, and make sure no placeholders are left.
      </p>
    </>
  );
}
