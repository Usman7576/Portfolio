// Vercel rejects request bodies over 4.5 MB, so the file itself is capped a little below that.
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

/** Returns what's wrong with an uploaded resume, or null if it's a usable PDF. */
export function resumeFileError(size: number, bytes: Uint8Array): string | null {
  if (size === 0) return "Please choose a PDF file.";
  if (size > MAX_RESUME_BYTES) return "That PDF is over 4 MB. Please export a smaller one.";
  // Check the file's own signature; a browser-reported type or file name can be anything.
  const signature = String.fromCharCode(...bytes.slice(0, 5));
  if (signature !== "%PDF-") return "That file isn't a PDF.";
  return null;
}
