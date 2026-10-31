"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Main">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 transition-colors",
              isActive(link.href)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="bg-primary text-primary-foreground hover:bg-primary/90 ml-2 rounded-md px-3 py-1.5 font-medium transition-colors"
        >
          Contact
        </Link>
        <ThemeToggle />
      </nav>

      <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="hover:bg-accent inline-flex size-9 items-center justify-center rounded-md"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="bg-background absolute inset-x-0 top-14 border-b px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col">
            {[...links, { href: "/contact", label: "Contact" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-3 text-base",
                    isActive(link.href) ? "text-foreground bg-accent" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
