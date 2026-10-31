import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { site } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur print:hidden">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {site.name}
          <span className="text-primary">.</span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
