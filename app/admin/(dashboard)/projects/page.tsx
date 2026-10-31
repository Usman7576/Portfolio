import { ArrowDown, ArrowUp, Eye, EyeOff, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { moveProject, setProjectFlag } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getDb().project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Order here is the order on the site. Only published projects are public."
        action={{ href: "/admin/projects/new", label: "New project" }}
      />

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">No projects yet.</p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="hover:text-primary font-medium">
                  {p.title}
                </Link>
                <p className="text-muted-foreground truncate text-sm">{p.tagline}</p>
                <div className="mt-1 flex gap-2 text-xs">
                  <span className={p.published ? "text-primary" : "text-muted-foreground"}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                  {p.featured && <span className="text-muted-foreground">· Featured on home</span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <ActionButton
                  label="Move up"
                  action={moveProject.bind(null, p.id, "up")}
                  className={i === 0 ? "invisible" : undefined}
                >
                  <ArrowUp className="size-3.5" />
                </ActionButton>
                <ActionButton
                  label="Move down"
                  action={moveProject.bind(null, p.id, "down")}
                  className={i === projects.length - 1 ? "invisible" : undefined}
                >
                  <ArrowDown className="size-3.5" />
                </ActionButton>
                <ActionButton
                  label={p.featured ? "Remove from home page" : "Feature on home page"}
                  action={setProjectFlag.bind(null, p.id, "featured", !p.featured)}
                  className={p.featured ? "text-primary" : undefined}
                >
                  <Star className="size-3.5" fill={p.featured ? "currentColor" : "none"} />
                </ActionButton>
                <ActionButton
                  label={p.published ? "Unpublish" : "Publish"}
                  action={setProjectFlag.bind(null, p.id, "published", !p.published)}
                >
                  {p.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  {p.published ? "Unpublish" : "Publish"}
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
