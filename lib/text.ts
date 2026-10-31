export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** About 200 words a minute, never less than one. */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** One item per non-empty line. */
export function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Splits text into chunks of at most `maxChars`, breaking on paragraphs (then sentences),
 * with `overlap` characters carried into the next chunk so context isn't cut mid-thought.
 */
export function chunkText(text: string, maxChars = 1500, overlap = 200): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  const pieces = clean
    .split(/\n{2,}/)
    .flatMap((p) => (p.length <= maxChars ? [p] : (p.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) ?? [p])))
    .flatMap((s) =>
      s.length <= maxChars ? [s] : (s.match(new RegExp(`.{1,${maxChars}}`, "gs")) ?? []),
    );

  const chunks: string[] = [];
  let current = "";
  for (const piece of pieces) {
    const candidate = current ? `${current}\n\n${piece}` : piece;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current.trim());
    const tail = current.slice(-overlap);
    current = tail && (tail + piece).length <= maxChars ? `${tail}${piece}` : piece;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
