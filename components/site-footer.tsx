import { site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t print:hidden">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {site.name}</p>
        <div className="flex gap-4">
          <a href={site.github} className="hover:text-foreground" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href={site.linkedin}
            className="hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
