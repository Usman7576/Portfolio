"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { Mdx } from "@/lib/mdx";

/** Renders a draft with the same pipeline as the public blog. */
export async function previewMdx(source: string) {
  await requireAdmin();
  if (!source.trim())
    return <p className="text-muted-foreground text-sm">Nothing to preview yet.</p>;
  try {
    return <Mdx source={source} />;
  } catch (e) {
    return (
      <p className="text-destructive text-sm">
        Couldn&apos;t render this MDX: {e instanceof Error ? e.message : "unknown error"}
      </p>
    );
  }
}
