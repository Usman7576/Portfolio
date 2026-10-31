"use client";

import { useActionState } from "react";
import { saveProject, type FormState } from "@/app/admin/actions";
import { Checkbox, Field, SubmitButton, TextArea, TextInput } from "@/components/admin/form-fields";
import { ImageField } from "@/components/admin/image-field";

/** Project fields as the form shows them: lists as one item per line. */
export type ProjectFormValues = {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  problem: string;
  solution: string;
  role: string;
  techStack: string;
  highlights: string;
  metrics: string;
  challenges: string;
  githubUrl: string;
  demoUrl: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
  order: string;
};

const initialState: FormState = { status: "idle" };

export function ProjectForm({
  project,
  canUpload,
}: {
  project: ProjectFormValues;
  canUpload: boolean;
}) {
  const [state, action, pending] = useActionState(saveProject, initialState);
  const err = (k: string) => state.fieldErrors?.[k];
  // After a failed save, refill from what was submitted (React resets the form).
  const v = (k: keyof ProjectFormValues) =>
    state.values ? (state.values[k] ?? "") : String(project[k] ?? "");
  const checked = (k: "featured" | "published") =>
    state.values ? state.values[k] === "on" : project[k];

  return (
    <form action={action} className="space-y-6">
      {project.id && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title" name="title" error={err("title")}>
          <TextInput name="title" defaultValue={v("title")} error={err("title")} required />
        </Field>
        <Field
          label="Slug"
          name="slug"
          hint="URL path. Leave empty to generate from the title."
          error={err("slug")}
        >
          <TextInput name="slug" defaultValue={v("slug")} error={err("slug")} placeholder="auto" />
        </Field>
      </div>

      <Field
        label="Tagline"
        name="tagline"
        hint="One sentence a recruiter reads first."
        error={err("tagline")}
      >
        <TextInput name="tagline" defaultValue={v("tagline")} error={err("tagline")} required />
      </Field>

      <Field
        label="The problem"
        name="problem"
        hint="Who has the pain, what it costs them today. Be specific, not generic."
        error={err("problem")}
      >
        <TextArea name="problem" defaultValue={v("problem")} error={err("problem")} rows={5} />
      </Field>

      <Field label="What you built" name="solution" error={err("solution")}>
        <TextArea name="solution" defaultValue={v("solution")} error={err("solution")} rows={5} />
      </Field>

      <Field
        label="Your role"
        name="role"
        hint="Solo or team, and what you personally did."
        error={err("role")}
      >
        <TextInput name="role" defaultValue={v("role")} error={err("role")} />
      </Field>

      <Field label="Tech stack" name="techStack" hint="Comma separated." error={err("techStack")}>
        <TextInput name="techStack" defaultValue={v("techStack")} error={err("techStack")} />
      </Field>

      <Field
        label="Results"
        name="metrics"
        hint="One per line as `value | what it measures`, e.g. `1.8 s | English → Urdu latency`."
        error={err("metrics")}
      >
        <TextArea name="metrics" defaultValue={v("metrics")} error={err("metrics")} rows={4} />
      </Field>

      <Field label="Highlights" name="highlights" hint="One per line." error={err("highlights")}>
        <TextArea
          name="highlights"
          defaultValue={v("highlights")}
          error={err("highlights")}
          rows={5}
        />
      </Field>

      <Field
        label="Challenges and trade-offs"
        name="challenges"
        hint="One per line."
        error={err("challenges")}
      >
        <TextArea
          name="challenges"
          defaultValue={v("challenges")}
          error={err("challenges")}
          rows={4}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="GitHub URL" name="githubUrl" error={err("githubUrl")}>
          <TextInput name="githubUrl" defaultValue={v("githubUrl")} error={err("githubUrl")} />
        </Field>
        <Field label="Live demo URL" name="demoUrl" error={err("demoUrl")}>
          <TextInput name="demoUrl" defaultValue={v("demoUrl")} error={err("demoUrl")} />
        </Field>
      </div>

      <ImageField
        name="coverImage"
        label="Cover image"
        defaultValue={v("coverImage")}
        error={err("coverImage")}
        canUpload={canUpload}
      />

      <div className="flex flex-wrap items-center gap-6">
        <Checkbox name="published" label="Published" defaultChecked={checked("published")} />
        <Checkbox
          name="featured"
          label="Featured on home page"
          defaultChecked={checked("featured")}
        />
        <label className="flex items-center gap-2 text-sm">
          Order
          <input
            name="order"
            type="number"
            min={0}
            defaultValue={v("order")}
            className="bg-background w-20 rounded-md border px-2 py-1 text-sm"
          />
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-destructive text-sm">
          {state.message ?? "Some fields need fixing; see the messages above."}
        </p>
      )}

      <SubmitButton pending={pending}>
        {project.id ? "Save changes" : "Create project"}
      </SubmitButton>
    </form>
  );
}
