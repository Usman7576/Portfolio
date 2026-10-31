import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-primary font-mono text-sm">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
        <p className="text-muted-foreground mt-3">
          The link may be old or mistyped. The projects are a good place to start.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center rounded-md px-5 text-sm font-medium"
          >
            Go home
          </Link>
          <Link
            href="/projects"
            className="hover:bg-accent inline-flex h-10 items-center rounded-md border px-5 text-sm font-medium"
          >
            See projects
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
