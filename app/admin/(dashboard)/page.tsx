import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export default async function AdminOverview() {
  const session = await requireAdmin();
  const db = getDb();
  const [projects, drafts, posts, unread, recent] = await Promise.all([
    db.project.count({ where: { published: true } }),
    db.project.count({ where: { published: false } }),
    db.post.count({ where: { published: true } }),
    db.message.count({ where: { read: false, archived: false } }),
    db.message.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Published projects", value: projects, href: "/admin/projects" },
    { label: "Project drafts", value: drafts, href: "/admin/projects" },
    { label: "Published posts", value: posts, href: "/admin/posts" },
    { label: "Unread messages", value: unread, href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back${session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="Everything you publish here goes live on the site immediately."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-card hover:border-primary/40 rounded-xl border p-4"
          >
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-muted-foreground mt-1 text-sm">{s.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-semibold">Latest messages</h2>
        {recent.length === 0 ? (
          <p className="text-muted-foreground mt-3 text-sm">No messages yet.</p>
        ) : (
          <ul className="mt-3 divide-y rounded-xl border">
            {recent.map((m) => (
              <li key={m.id} className="flex items-start gap-3 p-4">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-primary"}`}
                  aria-label={m.read ? undefined : "Unread"}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {m.name} <span className="text-muted-foreground font-normal">· {m.email}</span>
                  </p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{m.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/messages" className="text-primary mt-3 inline-block text-sm font-medium">
          Open inbox
        </Link>
      </section>
    </>
  );
}
