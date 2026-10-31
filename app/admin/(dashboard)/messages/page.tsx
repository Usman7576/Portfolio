import { Archive, ArchiveRestore, Mail, MailOpen, Reply } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { setMessageArchived, setMessageRead } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin();
  const archived = (await searchParams).view === "archived";
  const messages = await getDb().message.findMany({
    where: { archived },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Messages" description="Everything sent through the contact form." />

      <div className="mb-4 flex gap-1 text-sm">
        {[
          { href: "/admin/messages", label: "Inbox", active: !archived },
          { href: "/admin/messages?view=archived", label: "Archived", active: archived },
        ].map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "rounded-md px-3 py-1.5",
              t.active ? "bg-accent font-medium" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {archived ? "Nothing archived." : "Inbox zero."}
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn("bg-card rounded-xl border p-5", !m.read && "border-primary/50")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {!m.read && (
                      <span className="bg-primary mr-2 inline-block size-2 rounded-full" />
                    )}
                    {m.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {m.email} · {m.createdAt.toISOString().replace("T", " ").slice(0, 16)} UTC
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                    className="hover:bg-accent inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium"
                  >
                    <Reply className="size-3.5" /> Reply
                  </a>
                  <ActionButton
                    label={m.read ? "Mark unread" : "Mark read"}
                    action={setMessageRead.bind(null, m.id, !m.read)}
                  >
                    {m.read ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />}
                  </ActionButton>
                  <ActionButton
                    label={m.archived ? "Move to inbox" : "Archive"}
                    action={setMessageArchived.bind(null, m.id, !m.archived)}
                  >
                    {m.archived ? (
                      <ArchiveRestore className="size-3.5" />
                    ) : (
                      <Archive className="size-3.5" />
                    )}
                  </ActionButton>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
