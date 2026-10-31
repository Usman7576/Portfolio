import { describe, expect, it } from "vitest";
import { chunkText, lines, readingTime, slugify } from "@/lib/text";

describe("slugify", () => {
  it("lowercases, strips accents and joins words with dashes", () => {
    expect(slugify("  Café Ünïcode: AI & RAG!  ")).toBe("cafe-unicode-ai-rag");
  });

  it("caps the length at 80 characters", () => {
    expect(slugify("a".repeat(200))).toHaveLength(80);
  });
});

describe("readingTime", () => {
  it("is at least one minute", () => {
    expect(readingTime("")).toBe(1);
  });

  it("counts about 200 words a minute", () => {
    expect(readingTime("word ".repeat(1000))).toBe(5);
  });
});

describe("lines", () => {
  it("keeps non-empty trimmed lines", () => {
    expect(lines("  one\r\n\n two  \n")).toEqual(["one", "two"]);
  });
});

describe("chunkText", () => {
  it("returns nothing for empty text and one chunk for short text", () => {
    expect(chunkText("   ")).toEqual([]);
    expect(chunkText("Short paragraph.")).toEqual(["Short paragraph."]);
  });

  it("never exceeds the size limit", () => {
    const text = Array.from({ length: 40 }, (_, i) => `Paragraph ${i}. ${"word ".repeat(40)}`).join(
      "\n\n",
    );
    const chunks = chunkText(text, 500, 80);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(500);
  });

  it("keeps every paragraph somewhere in the output", () => {
    const paragraphs = Array.from({ length: 12 }, (_, i) => `Marker-${i} ${"text ".repeat(30)}`);
    const joined = chunkText(paragraphs.join("\n\n"), 400, 50).join(" ");
    for (let i = 0; i < 12; i++) expect(joined).toContain(`Marker-${i}`);
  });

  it("splits a single paragraph that is longer than the limit", () => {
    const longSentence = "x".repeat(1200);
    const chunks = chunkText(longSentence, 500, 0);
    expect(chunks.every((c) => c.length <= 500)).toBe(true);
    expect(chunks.join("")).toBe(longSentence);
  });
});
