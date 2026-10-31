import { describe, expect, it } from "vitest";
import { contactSchema, postSchema, projectSchema } from "@/lib/validations";

describe("contactSchema", () => {
  const valid = { name: "Recruiter", email: "hr@example.com", message: "Let's talk about a role." };

  it("accepts a normal message and trims it", () => {
    const r = contactSchema.safeParse({ ...valid, name: "  Recruiter  " });
    expect(r.success && r.data.name).toBe("Recruiter");
  });

  it.each([
    ["name", ""],
    ["email", "not-an-email"],
    ["message", "too short"],
    ["message", "x".repeat(5001)],
  ])("rejects a bad %s", (field, value) => {
    const r = contactSchema.safeParse({ ...valid, [field]: value });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path[0]).toBe(field);
  });
});

describe("projectSchema", () => {
  const valid = {
    title: "IntelliMeet",
    slug: "",
    tagline: "Meetings in your own language.",
    problem: "Urdu and English speakers can't follow each other in meetings.",
    solution: "A meeting platform with live speech-to-speech translation.",
    role: "Team of 3",
    techStack: ["LiveKit"],
    highlights: [],
    metrics: [{ value: "1.8 s", label: "English → Urdu latency" }],
    challenges: [],
    githubUrl: "",
    demoUrl: "https://example.com",
    coverImage: "/projects/intellimeet.png",
    featured: true,
    published: false,
    order: "2",
  };

  it("accepts a complete project, empty URLs as null and site-relative cover paths", () => {
    const r = projectSchema.safeParse(valid);
    expect(r.success).toBe(true);
    expect(r.data?.githubUrl).toBeNull();
    expect(r.data?.coverImage).toBe("/projects/intellimeet.png");
    expect(r.data?.order).toBe(2);
  });

  it("requires at least one measured result", () => {
    const r = projectSchema.safeParse({ ...valid, metrics: [] });
    expect(r.error?.issues[0].path[0]).toBe("metrics");
  });

  it("rejects slugs with spaces or capitals", () => {
    expect(projectSchema.safeParse({ ...valid, slug: "Intelli Meet" }).success).toBe(false);
  });

  it("rejects links that aren't http(s)", () => {
    expect(projectSchema.safeParse({ ...valid, demoUrl: "javascript:alert(1)" }).success).toBe(
      false,
    );
  });
});

describe("postSchema", () => {
  it("rejects an empty post", () => {
    const r = postSchema.safeParse({
      title: "T",
      slug: "",
      excerpt: "E",
      content: "   ",
      tags: [],
      coverImage: "",
      published: false,
    });
    expect(r.error?.issues[0].path[0]).toBe("content");
  });
});
