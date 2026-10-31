import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { GitHubIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about AI engineering roles and internships.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr]">
      <div>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let's talk"
          description="I'm open to AI engineering roles and internships. A short note about the role or problem is plenty; I'll reply within a couple of days."
        />
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="text-muted-foreground size-4" />
            <a href={`mailto:${site.email}`} className="hover:text-primary">
              {site.email}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <GitHubIcon className="text-muted-foreground size-4" />
            <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-primary">
              github.com/Usman7576
            </a>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-muted-foreground w-4 text-center text-xs font-bold">in</span>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary">
              LinkedIn
            </a>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="text-muted-foreground size-4" />
            {site.location}
          </li>
        </ul>
      </div>
      <div className="bg-card rounded-xl border p-6 sm:p-8">
        <ContactForm />
      </div>
    </div>
  );
}
