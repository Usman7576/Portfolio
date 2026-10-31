import { z } from "zod";

// Shared by the contact form (client hints) and the server action (the real check).
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(100, "Please keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .max(200, "That email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail helps: at least 10 characters.")
    .max(5000, "Please keep your message under 5,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Use a full URL starting with https://.")
  .transform((v) => v || null);

const slugField = z
  .string()
  .trim()
  .max(80)
  .refine(
    (v) => v === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v),
    "Lowercase letters, numbers and dashes only.",
  );

// Admin forms send lists as one item per line; the actions split them before validating.
export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  slug: slugField,
  tagline: z.string().trim().min(1, "A one-line tagline is required.").max(200),
  problem: z.string().trim().min(20, "Describe the real problem in at least a sentence."),
  solution: z.string().trim().min(20, "Describe what you built in at least a sentence."),
  role: z.string().trim().min(1, "Say what your role was.").max(300),
  techStack: z.array(z.string().trim().min(1).max(40)).min(1, "Add at least one technology."),
  highlights: z.array(z.string().trim().min(1)),
  metrics: z
    .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
    .min(1, "Add at least one number, e.g. `1.8 s | English → Urdu latency`."),
  challenges: z.array(z.string().trim().min(1)),
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  coverImage: optionalUrl,
  featured: z.boolean(),
  published: z.boolean(),
  order: z.coerce.number().int().min(0).max(999),
});

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: slugField,
  excerpt: z.string().trim().min(1, "A short excerpt is required.").max(300),
  content: z.string().trim().min(1, "The post is empty."),
  tags: z.array(z.string().trim().min(1).max(30)),
  coverImage: optionalUrl,
  published: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type PostInput = z.infer<typeof postSchema>;
