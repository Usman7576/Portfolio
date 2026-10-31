import type { Metadata } from "next";
import { isUploadConfigured } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New post" description="Saved as a draft unless you tick Published." />
      <PostForm
        canUpload={await isUploadConfigured()}
        post={{
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          tags: "",
          coverImage: "",
          published: false,
        }}
      />
    </>
  );
}
