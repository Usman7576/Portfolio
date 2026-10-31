"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { savePost, type FormState } from "@/app/admin/actions";
import { previewMdx } from "@/app/admin/preview";
import { Checkbox, Field, SubmitButton, TextArea, TextInput } from "@/components/admin/form-fields";
import { ImageField } from "@/components/admin/image-field";
import { cn } from "@/lib/utils";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  coverImage: string;
  published: boolean;
};

const initialState: FormState = { status: "idle" };

export function PostForm({ post, canUpload }: { post: PostFormValues; canUpload: boolean }) {
  const [state, action, pending] = useActionState(savePost, initialState);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [preview, setPreview] = useState<React.ReactNode>(null);
  const [rendering, startRender] = useTransition();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const err = (k: string) => state.fieldErrors?.[k];
  const v = (k: keyof PostFormValues) =>
    state.values ? (state.values[k] ?? "") : String(post[k] ?? "");

  function showPreview() {
    setTab("preview");
    const source = contentRef.current?.value ?? "";
    startRender(async () => setPreview(await previewMdx(source)));
  }

  return (
    <form action={action} className="space-y-6">
      {post.id && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title" name="title" error={err("title")}>
          <TextInput name="title" defaultValue={v("title")} error={err("title")} required />
        </Field>
        <Field
          label="Slug"
          name="slug"
          hint="Leave empty to generate from the title."
          error={err("slug")}
        >
          <TextInput name="slug" defaultValue={v("slug")} error={err("slug")} placeholder="auto" />
        </Field>
      </div>

      <Field
        label="Excerpt"
        name="excerpt"
        hint="One or two sentences for the blog list."
        error={err("excerpt")}
      >
        <TextArea name="excerpt" defaultValue={v("excerpt")} error={err("excerpt")} rows={2} />
      </Field>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium">
            Content (Markdown / MDX)
          </label>
          <div className="flex rounded-md border p-0.5 text-xs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "write"}
              onClick={() => setTab("write")}
              className={cn("rounded px-2.5 py-1", tab === "write" && "bg-accent font-medium")}
            >
              Write
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "preview"}
              onClick={showPreview}
              className={cn("rounded px-2.5 py-1", tab === "preview" && "bg-accent font-medium")}
            >
              Preview
            </button>
          </div>
        </div>
        {/* Stays mounted while previewing so its value is submitted with the form. */}
        <textarea
          ref={contentRef}
          id="content"
          name="content"
          rows={20}
          defaultValue={v("content")}
          aria-invalid={!!err("content")}
          className={cn(
            "bg-background focus-visible:ring-ring/50 aria-invalid:border-destructive w-full resize-y rounded-md border px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2",
            tab === "preview" && "hidden",
          )}
        />
        {tab === "preview" && (
          <div className="bg-card min-h-80 rounded-md border p-6">
            {rendering ? <p className="text-muted-foreground text-sm">Rendering…</p> : preview}
          </div>
        )}
        {err("content") && <p className="text-destructive text-sm">{err("content")}</p>}
      </div>

      <Field label="Tags" name="tags" hint="Comma separated." error={err("tags")}>
        <TextInput name="tags" defaultValue={v("tags")} error={err("tags")} />
      </Field>

      <ImageField
        name="coverImage"
        label="Cover image"
        defaultValue={v("coverImage")}
        error={err("coverImage")}
        canUpload={canUpload}
      />

      <Checkbox
        name="published"
        label="Published"
        defaultChecked={state.values ? state.values.published === "on" : post.published}
      />

      {state.status === "error" && (
        <p role="alert" className="text-destructive text-sm">
          {state.message ?? "Some fields need fixing; see the messages above."}
        </p>
      )}

      <SubmitButton pending={pending}>{post.id ? "Save changes" : "Create post"}</SubmitButton>
    </form>
  );
}
