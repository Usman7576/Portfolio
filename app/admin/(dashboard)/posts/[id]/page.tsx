import { ExternalLink, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost, isUploadConfigured } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const p = await getDb().post.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <>
      <PageHeader title={p.title} description="Changes go live as soon as you save." />
      <div className="mb-6 flex gap-2">
        {p.published && (
          <Link
            href={`/blog/${p.slug}`}
            target="_blank"
            className="hover:bg-accent inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium"
          >
            <ExternalLink className="size-3.5" /> View on site
          </Link>
        )}
        <ActionButton
          action={deletePost.bind(null, p.id)}
          confirm={`Delete "${p.title}" permanently? This can't be undone.`}
          className="text-destructive"
        >
          <Trash2 className="size-3.5" /> Delete
        </ActionButton>
      </div>
      <PostForm
        canUpload={await isUploadConfigured()}
        post={{
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          tags: p.tags.join(", "),
          coverImage: p.coverImage ?? "",
          published: p.published,
        }}
      />
    </>
  );
}
