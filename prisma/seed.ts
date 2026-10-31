// Loads the static project write-ups into the database. Safe to re-run: rows are upserted by slug.
import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { staticProjects } from "../lib/data/projects";
import { PrismaClient } from "../lib/generated/prisma/client";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set in .env.local");

const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

async function main() {
  for (const p of staticProjects) {
    const data = {
      title: p.title,
      tagline: p.tagline,
      problem: p.problem,
      solution: p.solution,
      role: p.role,
      techStack: p.techStack,
      highlights: p.highlights,
      metrics: p.metrics,
      challenges: p.challenges,
      githubUrl: p.githubUrl ?? null,
      demoUrl: p.demoUrl ?? null,
      featured: p.featured,
      order: p.order,
      published: true,
    };
    await db.project.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, ...data },
      update: data,
    });
    console.log(`Seeded project: ${p.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
