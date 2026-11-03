import { getDb, hasDatabase } from "@/lib/db";
import { site } from "@/lib/site";

export async function GET() {
  const resume = hasDatabase()
    ? await getDb().resume.findUnique({ where: { id: "resume" } })
    : null;
  if (!resume) return new Response("No resume has been uploaded yet.", { status: 404 });

  return new Response(new Uint8Array(resume.data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${site.name.replace(/\s+/g, "-")}-Resume.pdf"`,
      "Content-Length": String(resume.size),
      // Links carry a version query that changes on every upload, so the CDN can hold each one.
      "Cache-Control": "public, max-age=0, s-maxage=86400",
      // The PDF is for visitors to download, not for search results.
      "X-Robots-Tag": "noindex",
    },
  });
}
