"use server";

import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import { requireAdmin } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";
import { lines, readingTime, slugify } from "@/lib/text";
import { postSchema, projectSchema } from "@/lib/validations";

export type FormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** What was submitted, so the form can refill itself after React resets it. */
  values?: Record<string, string>;
};

function formValues(fd: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && !k.startsWith("$")) values[k] = v;
  return values;
}

function collectErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  return fieldErrors;
}

function isUniqueViolation(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

// ---------------------------------------------------------------- projects

export async function saveProject(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = projectSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    tagline: str(fd, "tagline"),
    problem: str(fd, "problem"),
    solution: str(fd, "solution"),
    role: str(fd, "role"),
    techStack: str(fd, "techStack")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    highlights: lines(str(fd, "highlights")),
    // One metric per line: "1.8 s | English → Urdu latency"
    metrics: lines(str(fd, "metrics")).map((l) => {
      const [value = "", ...label] = l.split("|");
      return { value: value.trim(), label: label.join("|").trim() };
    }),
    challenges: lines(str(fd, "challenges")),
    githubUrl: str(fd, "githubUrl"),
    demoUrl: str(fd, "demoUrl"),
    coverImage: str(fd, "coverImage"),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    order: str(fd, "order") || "0",
  });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: collectErrors(parsed.error.issues),
      values: formValues(fd),
    };
  }

  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };
  const id = str(fd, "id");

  try {
    if (id) await getDb().project.update({ where: { id }, data });
    else await getDb().project.create({ data });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return {
        status: "error",
        fieldErrors: { slug: "Another project already uses this slug." },
        values: formValues(fd),
      };
    }
    throw e;
  }

  updateTag("projects");
  redirect("/admin/projects");
}

export async function setProjectFlag(id: string, flag: "featured" | "published", value: boolean) {
  await requireAdmin();
  await getDb().project.update({ where: { id }, data: { [flag]: value } });
  updateTag("projects");
}

/** Swap display order with the neighbouring project. */
export async function moveProject(id: string, direction: "up" | "down") {
  await requireAdmin();
  const db = getDb();
  const all = await db.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const i = all.findIndex((p) => p.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= all.length) return;
  [all[i], all[j]] = [all[j], all[i]];
  await db.$transaction(
    all.map((p, order) => db.project.update({ where: { id: p.id }, data: { order } })),
  );
  updateTag("projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await getDb().project.delete({ where: { id } });
  updateTag("projects");
  redirect("/admin/projects");
}

// ---------------------------------------------------------------- posts

export async function savePost(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = postSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    excerpt: str(fd, "excerpt"),
    content: str(fd, "content"),
    tags: str(fd, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    coverImage: str(fd, "coverImage"),
    published: fd.get("published") === "on",
  });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: collectErrors(parsed.error.issues),
      values: formValues(fd),
    };
  }

  const db = getDb();
  const id = str(fd, "id");
  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  const data = {
    ...parsed.data,
    slug: parsed.data.slug || slugify(parsed.data.title),
    readingTime: readingTime(parsed.data.content),
    // Keep the original publish date when editing; stamp it the first time a post goes live.
    publishedAt: parsed.data.published
      ? (existing?.publishedAt ?? new Date())
      : (existing?.publishedAt ?? null),
  };

  try {
    if (id) await db.post.update({ where: { id }, data });
    else await db.post.create({ data });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return {
        status: "error",
        fieldErrors: { slug: "Another post already uses this slug." },
        values: formValues(fd),
      };
    }
    throw e;
  }

  updateTag("posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await getDb().post.delete({ where: { id } });
  updateTag("posts");
  redirect("/admin/posts");
}

// ---------------------------------------------------------------- messages

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await getDb().message.update({ where: { id }, data: { read } });
}

export async function setMessageArchived(id: string, archived: boolean) {
  await requireAdmin();
  await getDb().message.update({ where: { id }, data: { archived, read: true } });
}

// ---------------------------------------------------------------- images

export async function isUploadConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );
}

/** Signs a direct browser-to-Cloudinary upload. The API secret never leaves the server. */
export async function getUploadSignature() {
  await requireAdmin();
  if (!(await isUploadConfigured())) throw new Error("Cloudinary is not configured");
  const folder = "portfolio";
  const timestamp = Math.round(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    timestamp,
    signature,
  };
}

// ---------------------------------------------------------------- chatbot knowledge

export async function rebuildKnowledge(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const { isChatConfigured, rebuildIndex } = await import("@/lib/rag");
  if (!isChatConfigured()) {
    return { ok: false, message: "Add GOOGLE_GENERATIVE_AI_API_KEY first." };
  }
  try {
    const chunks = await rebuildIndex();
    return {
      ok: true,
      message: `Indexed ${chunks} chunks. The assistant now knows your latest content.`,
    };
  } catch (e) {
    console.error("[rebuildKnowledge]", e);
    return { ok: false, message: e instanceof Error ? e.message : "Indexing failed." };
  }
}
