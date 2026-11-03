import { describe, expect, it } from "vitest";
import { MAX_RESUME_BYTES, resumeFileError } from "@/lib/resume-file";

const pdf = new TextEncoder().encode("%PDF-1.7 rest of file");

describe("resumeFileError", () => {
  it("accepts a PDF within the size limit", () => {
    expect(resumeFileError(pdf.length, pdf)).toBeNull();
  });

  it("rejects an empty upload", () => {
    expect(resumeFileError(0, new Uint8Array())).toMatch(/choose/i);
  });

  it("rejects files over the limit", () => {
    expect(resumeFileError(MAX_RESUME_BYTES + 1, pdf)).toMatch(/over 4 MB/);
  });

  it("rejects other files even when named .pdf", () => {
    expect(resumeFileError(5, new TextEncoder().encode("<html"))).toMatch(/isn't a PDF/);
  });
});
