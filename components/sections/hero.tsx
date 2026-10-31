import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { HeroScene } from "@/components/three/hero-scene";
import { site } from "@/lib/content";

// No scroll reveal here: hero text must paint immediately; the 3D scene loads after it.
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:py-32">
        <div className="relative z-10">
          <p className="text-primary mb-4 font-mono text-sm">{site.title}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Hi, I&apos;m {site.name}.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">{site.pitch}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium transition-colors"
            >
              View projects <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/resume"
              className="hover:bg-accent inline-flex h-10 items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors"
            >
              <Download className="size-4" /> Resume
            </Link>
          </div>
        </div>
        {/* On phones the scene sits behind the text, faded; on desktop it fills the right column. */}
        <HeroScene />
      </div>
    </section>
  );
}
