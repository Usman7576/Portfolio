import { ExternalLink, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:py-10">
      <aside className="md:w-48 md:shrink-0">
        <Link href="/admin" className="mb-4 block font-semibold">
          Portfolio admin
        </Link>
        {/* usePathname() needs a Suspense boundary on dynamic admin routes. */}
        <Suspense fallback={<div className="h-9 md:h-40" />}>
          <AdminNav />
        </Suspense>
        <div className="mt-6 hidden flex-col gap-1 border-t pt-4 text-sm md:flex">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-3 py-2"
          >
            <ExternalLink className="size-4" /> View site
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 px-3 py-2"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      {/* Admin pages read the session and the database on every request. */}
      <main className="min-w-0 flex-1">
        <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
