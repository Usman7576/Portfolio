import Image from "next/image";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Cover at the top of a project card or case study. A real screenshot set in the admin
 * dashboard wins; otherwise each project gets an illustration drawn from its real facts.
 */
export function ProjectCover({
  project,
  priority,
  className,
}: {
  project: Pick<Project, "slug" | "title" | "coverImage">;
  priority?: boolean;
  className?: string;
}) {
  const Art = illustrations[project.slug];

  return (
    <div
      className={cn(
        "from-primary/15 via-card to-card relative aspect-video overflow-hidden bg-gradient-to-br",
        className,
      )}
    >
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
          priority={priority}
        />
      ) : Art ? (
        <Art />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-primary/70 text-3xl font-semibold">{project.title}</span>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ illustrations
// Drawn in a 640×360 viewBox with theme colours, so they stay sharp and match light/dark mode.

const svgProps = {
  viewBox: "0 0 640 360",
  className: "absolute inset-0 h-full w-full",
  "aria-hidden": true,
  fontFamily: "var(--font-geist-sans), sans-serif",
} as const;

function Pill({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={13} className="fill-card stroke-border" />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={12} className="fill-foreground">
        {label}
      </text>
    </g>
  );
}

function IntelliMeetArt() {
  const wave = [10, 22, 34, 18, 40, 26, 16, 10];
  return (
    <svg {...svgProps}>
      {/* Speaker tile */}
      <rect x={36} y={70} width={190} height={150} rx={14} className="fill-card stroke-border" />
      <circle cx={131} cy={125} r={26} className="fill-primary/20" />
      <circle cx={131} cy={118} r={9} className="fill-primary" />
      <path d="M113 142 a18 14 0 0 1 36 0" className="fill-primary" />
      <text x={50} y={205} fontSize={13} className="fill-foreground" fontWeight={600}>
        Speaker
      </text>
      <text x={212} y={205} fontSize={12} textAnchor="end" className="fill-muted-foreground">
        speaks Urdu
      </text>

      {/* Listener tile */}
      <rect
        x={414}
        y={70}
        width={190}
        height={150}
        rx={14}
        className="fill-card stroke-primary"
        strokeWidth={2}
      />
      <circle cx={509} cy={125} r={26} className="fill-primary/20" />
      <circle cx={509} cy={118} r={9} className="fill-primary" />
      <path d="M491 142 a18 14 0 0 1 36 0" className="fill-primary" />
      <text x={428} y={205} fontSize={13} className="fill-foreground" fontWeight={600}>
        Listener
      </text>
      <text x={590} y={205} fontSize={12} textAnchor="end" className="fill-muted-foreground">
        hears English
      </text>

      {/* Voice wave leaving the speaker */}
      {wave.map((h, i) => (
        <rect
          key={i}
          x={234 + i * 6}
          y={145 - h / 2}
          width={4}
          height={h}
          rx={2}
          className="fill-primary/60"
        />
      ))}

      {/* Translation pipeline */}
      <Pill x={292} y={84} w={104} label="Speech → text" />
      <Pill x={292} y={132} w={104} label="Translate" />
      <Pill x={292} y={180} w={104} label="Neural voice" />
      <path d="M344 112 v18 M344 160 v18" className="stroke-muted-foreground" strokeWidth={1.5} />
      <path
        d="M398 193 h10"
        className="stroke-primary"
        strokeWidth={2}
        markerEnd="url(#im-arrow)"
      />
      <defs>
        <marker id="im-arrow" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="fill-primary" />
        </marker>
      </defs>

      {/* Measured latency */}
      <rect x={220} y={262} width={200} height={44} rx={22} className="fill-primary" />
      <text
        x={320}
        y={290}
        textAnchor="middle"
        fontSize={16}
        fontWeight={700}
        className="fill-primary-foreground"
      >
        1.8 s · Urdu ↔ English
      </text>
    </svg>
  );
}

function JobPilotArt() {
  const jobs = [
    { y: 52, bar: 150, best: true },
    { y: 112, bar: 128 },
    { y: 172, bar: 104 },
    { y: 232, bar: 82 },
  ];
  return (
    <svg {...svgProps}>
      {/* Resume */}
      <rect x={40} y={60} width={130} height={170} rx={10} className="fill-card stroke-border" />
      <circle cx={70} cy={92} r={12} className="fill-primary/30" />
      <rect x={90} y={84} width={60} height={7} rx={3.5} className="fill-foreground/70" />
      <rect x={90} y={97} width={42} height={6} rx={3} className="fill-muted-foreground/50" />
      {[120, 134, 148, 170, 184, 198].map((y, i) => (
        <rect
          key={y}
          x={56}
          y={y}
          width={i % 3 === 2 ? 64 : 98}
          height={6}
          rx={3}
          className="fill-muted-foreground/35"
        />
      ))}
      <text x={105} y={252} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
        your resume
      </text>

      <path
        d="M182 145 h40"
        className="stroke-primary"
        strokeWidth={2}
        markerEnd="url(#jp-arrow)"
      />
      <defs>
        <marker id="jp-arrow" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="fill-primary" />
        </marker>
      </defs>

      {/* Ranked matches */}
      {jobs.map((j) => (
        <g key={j.y}>
          <rect
            x={236}
            y={j.y}
            width={240}
            height={48}
            rx={10}
            className={j.best ? "fill-card stroke-primary" : "fill-card stroke-border"}
            strokeWidth={j.best ? 2 : 1}
          />
          <rect
            x={252}
            y={j.y + 12}
            width={96}
            height={7}
            rx={3.5}
            className="fill-foreground/70"
          />
          <rect x={252} y={j.y + 26} width={j.bar} height={8} rx={4} className="fill-primary/70" />
          <rect
            x={252 + j.bar}
            y={j.y + 26}
            width={160 - j.bar}
            height={8}
            rx={4}
            className="fill-muted"
          />
        </g>
      ))}
      <text x={356} y={300} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
        ranked by fit, with reasons
      </text>

      {/* Fact-checked draft */}
      <rect x={496} y={88} width={112} height={116} rx={10} className="fill-card stroke-border" />
      {[108, 122, 136, 150].map((y, i) => (
        <rect
          key={y}
          x={510}
          y={y}
          width={i === 3 ? 50 : 84}
          height={6}
          rx={3}
          className="fill-muted-foreground/35"
        />
      ))}
      <circle cx={552} cy={180} r={13} className="fill-primary" />
      <path
        d="M546 180 l4 4 l8 -8"
        className="stroke-primary-foreground"
        strokeWidth={2.2}
        fill="none"
      />
      <text x={552} y={226} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
        fact-checked
      </text>
      <text x={552} y={242} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
        draft, you send
      </text>
    </svg>
  );
}

const illustrations: Record<string, () => React.JSX.Element> = {
  intellimeet: IntelliMeetArt,
  jobpilot: JobPilotArt,
};
