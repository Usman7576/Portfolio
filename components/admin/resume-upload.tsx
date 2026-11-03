"use client";

import { Upload } from "lucide-react";
import { useActionState } from "react";
import { uploadResume, type FormState } from "@/app/admin/actions";
import { MAX_RESUME_BYTES } from "@/lib/resume-file";

const initialState: FormState = { status: "idle" };

export function ResumeUpload({ replacing }: { replacing: boolean }) {
  const [state, action, pending] = useActionState(uploadResume, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="file" className="block text-sm font-medium">
          {replacing ? "Replace with a new PDF" : "Choose your resume PDF"}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="file:bg-secondary file:text-secondary-foreground w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium"
        />
        <p className="text-muted-foreground text-xs">
          PDF only, up to {MAX_RESUME_BYTES / (1024 * 1024)} MB.
        </p>
      </div>

      {state.message && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium disabled:opacity-70"
      >
        <Upload className="size-4" />
        {pending ? "Uploading…" : replacing ? "Upload and replace" : "Upload resume"}
      </button>
    </form>
  );
}
