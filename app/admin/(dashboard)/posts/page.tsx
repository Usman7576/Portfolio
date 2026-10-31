import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Posts" };

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await getDb().post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Posts"
        description="Technical write-ups. Only published posts appear on the blog."
        action={{ href: "/admin/posts/new", label: "New post" }}
      />
      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No posts yet. A good first one: how IntelliMeet&apos;s first translated audio went from
          4.7 s to under a second.
        </p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {posts.map((p) => (
            <li key={p.id} className="p-4">
              <Link href={`/admin/posts/${p.id}`} className="hover:text-primary font-medium">
                {p.title}
              </Link>
              <p className="text-muted-foreground mt-1 text-xs">
                <span className={p.published ? "text-primary" : undefined}>
                  {p.published ? "Published" : "Draft"}
                </span>
                {" · "}
                {p.readingTime} min read · updated {p.updatedAt.toISOString().slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
