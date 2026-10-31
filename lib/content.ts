// Data-access layer. Pages only import from here.
// Projects and posts come from Postgres when DATABASE_URL is set, otherwise from lib/data.
// Reads are cached until an admin change calls updateTag("projects" | "posts").

import { cacheLife, cacheTag } from "next/cache";
import { staticProjects } from "@/lib/data/projects";
import { getDb, hasDatabase } from "@/lib/db";

export type Metric = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  /** The real-world problem, told from the user's side. */
  problem: string;
  /** What the project does about it. */
  solution: string;
  role: string;
  techStack: string[];
  highlights: string[];
  metrics: Metric[];
  challenges: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
};

export { about, site, skillGroups, timeline } from "@/lib/site";
export type { SkillGroup, TimelineEntry } from "@/lib/site";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
};

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("max");
  cacheTag("posts");
  if (!hasDatabase()) return [];

  const rows = await getDb().post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString().slice(0, 10),
    readingTime: p.readingTime,
  }));
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  if (!hasDatabase()) return [...staticProjects].sort((a, b) => a.order - b.order);

  const rows = await getDb().project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    problem: p.problem,
    solution: p.solution,
    role: p.role,
    techStack: p.techStack,
    highlights: p.highlights,
    metrics: p.metrics as Metric[],
    challenges: p.challenges,
    githubUrl: p.githubUrl ?? undefined,
    demoUrl: p.demoUrl ?? undefined,
    featured: p.featured,
    order: p.order,
  }));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}
