"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/(public)/contact/actions";
import { site } from "@/lib/site";
import type { ContactField } from "@/lib/validations";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <CheckCircle2 className="text-primary size-10" />
        <h2 className="mt-4 text-lg font-semibold">Message sent</h2>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Thanks for reaching out. I&apos;ll reply to the email address you gave within a couple of
          days.
        </p>
      </div>
    );
  }

  const error = (field: ContactField) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Name" name="name" error={error("name")}>
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          defaultValue={state.values?.name}
          aria-invalid={!!error("name")}
          aria-describedby={error("name") ? "name-error" : undefined}
          className={inputClass}
        />
      </Field>
      <Field label="Email" name="email" error={error("email")}>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={state.values?.email}
          aria-invalid={!!error("email")}
          aria-describedby={error("email") ? "email-error" : undefined}
          className={inputClass}
        />
      </Field>
      <Field label="Message" name="message" error={error("message")}>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          defaultValue={state.values?.message}
          aria-invalid={!!error("message")}
          aria-describedby={error("message") ? "message-error" : undefined}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium transition-colors disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pending ? "Sending…" : "Send message"}
      </button>
      <p className="text-muted-foreground text-xs">
        Prefer email? Write to{" "}
        <a href={`mailto:${site.email}`} className="hover:text-foreground underline">
          {site.email}
        </a>
        .
      </p>
    </form>
  );
}

const inputClass =
  "bg-background focus-visible:ring-ring/50 aria-invalid:border-destructive w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
