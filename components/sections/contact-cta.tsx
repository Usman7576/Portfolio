import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function ContactCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <Reveal className="bg-card rounded-xl border p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight">Let&apos;s talk</h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md">
          I&apos;m open to AI engineering roles and internships. Tell me what you&apos;re building.
        </p>
        <Link
          href="/contact"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex h-10 items-center rounded-md px-5 text-sm font-medium transition-colors"
        >
          Get in touch
        </Link>
      </Reveal>
    </section>
  );
}
