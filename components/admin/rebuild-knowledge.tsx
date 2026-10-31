"use client";

import { RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import { rebuildKnowledge } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function RebuildKnowledge({ chunks, configured }: { chunks: number; configured: boolean }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <div className="bg-card rounded-xl border p-5">
      <h2 className="font-semibold">AI assistant knowledge</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        {configured
          ? `${chunks} chunks indexed. Rebuild after you publish or edit projects and posts.`
          : "The assistant is off until GOOGLE_GENERATIVE_AI_API_KEY is set."}
      </p>
      <button
        type="button"
        disabled={pending || !configured}
        onClick={() => startTransition(async () => setResult(await rebuildKnowledge()))}
        className="hover:bg-accent mt-4 inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium disabled:opacity-50"
      >
        <RefreshCw className={cn("size-4", pending && "animate-spin")} />
        {pending ? "Rebuilding…" : "Rebuild AI knowledge"}
      </button>
      {result && (
        <p
          role="status"
          className={cn("mt-3 text-sm", result.ok ? "text-primary" : "text-destructive")}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
