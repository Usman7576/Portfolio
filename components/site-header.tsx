import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/content";

const nav = [
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {site.name}
          <span className="text-primary">.</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
