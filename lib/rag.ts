import "server-only";
import { randomUUID } from "node:crypto";
import { google, type GoogleEmbeddingModelOptions } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import type { ChatSource } from "@/lib/chat";
import { getDb } from "@/lib/db";
import { about, site, skillGroups, timeline } from "@/lib/site";
import type { Metric } from "@/lib/content";
import { chunkText } from "@/lib/text";

// Must match the vector(768) column in prisma/schema.prisma.
export const EMBEDDING_DIMENSIONS = 768;
const embeddingModel = google.embedding("gemini-embedding-001");

export function isChatConfigured() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.DATABASE_URL);
}

function embeddingOptions(taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY") {
  return {
    google: {
      outputDimensionality: EMBEDDING_DIMENSIONS,
      taskType,
    } satisfies GoogleEmbeddingModelOptions,
  };
}

type Doc = { sourceType: string; sourceId: string; title: string; url: string; text: string };

/** Everything the chatbot may know: profile, published projects and published posts. */
async function collectDocuments(): Promise<Doc[]> {
  const db = getDb();
  const [projects, posts] = await Promise.all([
    db.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.post.findMany({ where: { published: true } }),
  ]);

  const docs: Doc[] = [
    {
      sourceType: "profile",
      sourceId: "about",
      title: `About ${site.name}`,
      url: "/about",
      text: [`${site.name} is an ${site.title} based in ${site.location}.`, ...about.story].join(
        "\n\n",
      ),
    },
    {
      sourceType: "profile",
      sourceId: "skills",
      title: "Skills",
      url: "/about",
      text: skillGroups.map((g) => `${g.category}: ${g.skills.join(", ")}.`).join("\n"),
    },
    {
      sourceType: "profile",
      sourceId: "timeline",
      title: "Education, projects and leadership",
      url: "/about",
      text: timeline.map((t) => `${t.title}, ${t.org} (${t.when}): ${t.description}`).join("\n"),
    },
    {
      sourceType: "profile",
      sourceId: "contact",
      title: "Contact",
      url: "/contact",
      text: `${site.name} is open to AI engineering roles and internships. Contact: email ${site.email}, LinkedIn ${site.linkedin}, GitHub ${site.github}, or the contact form on the site.`,
    },
  ];

  for (const p of projects) {
    const metrics = (p.metrics as Metric[]).map((m) => `${m.label}: ${m.value}`).join("; ");
    docs.push({
      sourceType: "project",
      sourceId: p.slug,
      title: p.title,
      url: `/projects/${p.slug}`,
      text: [
        `${p.title}: ${p.tagline}`,
        `Problem: ${p.problem}`,
        `What was built: ${p.solution}`,
        `Role: ${p.role}`,
        `Tech stack: ${p.techStack.join(", ")}.`,
        `Results: ${metrics}.`,
        `Highlights:\n${p.highlights.map((h) => `- ${h}`).join("\n")}`,
        `Challenges:\n${p.challenges.map((c) => `- ${c}`).join("\n")}`,
        p.githubUrl ? `Source code: ${p.githubUrl}` : "",
        p.demoUrl ? `Live demo: ${p.demoUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    });
  }

  for (const post of posts) {
    docs.push({
      sourceType: "post",
      sourceId: post.slug,
      title: post.title,
      url: `/blog/${post.slug}`,
      text: `${post.title}\n\n${post.excerpt}\n\n${post.content}`,
    });
  }

  return docs;
}

const toVector = (values: number[]) => `[${values.join(",")}]`;

/** Re-embeds all content and replaces the stored index in one transaction. Returns the chunk count. */
export async function rebuildIndex(): Promise<number> {
  const docs = await collectDocuments();
  // Each chunk starts with its source title so retrieved text keeps its context.
  const chunks = docs.flatMap((doc) =>
    chunkText(doc.text).map((chunk) => ({ ...doc, chunk: `${doc.title}\n${chunk}` })),
  );

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map((c) => c.chunk),
    providerOptions: embeddingOptions("RETRIEVAL_DOCUMENT"),
  });

  const db = getDb();
  await db.$transaction([
    db.$executeRaw`DELETE FROM "Embedding"`,
    ...chunks.map(
      (c, i) => db.$executeRaw`
        INSERT INTO "Embedding" ("id", "sourceType", "sourceId", "title", "url", "chunk", "vector")
        VALUES (${randomUUID()}, ${c.sourceType}, ${c.sourceId}, ${c.title}, ${c.url}, ${c.chunk},
                ${toVector(embeddings[i])}::vector)`,
    ),
  ]);
  return chunks.length;
}

export type RetrievedChunk = ChatSource & { chunk: string; score: number };

/** The k stored chunks most similar to the question (cosine similarity). */
export async function retrieve(question: string, k = 5): Promise<RetrievedChunk[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: question,
    providerOptions: embeddingOptions("RETRIEVAL_QUERY"),
  });
  const vector = toVector(embedding);
  return getDb().$queryRaw<RetrievedChunk[]>`
    SELECT "title", "url", "chunk", 1 - ("vector" <=> ${vector}::vector) AS "score"
    FROM "Embedding"
    ORDER BY "vector" <=> ${vector}::vector
    LIMIT ${k}`;
}
