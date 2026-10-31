"use server";

import { headers } from "next/headers";
import { getDb, hasDatabase } from "@/lib/db";
import { canSendEmail, sendContactEmail } from "@/lib/email";
import { contactLimiter } from "@/lib/ratelimit";
import { site } from "@/lib/site";
import { contactSchema, type ContactField } from "@/lib/validations";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Record<ContactField, string>;
};

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real visitors never see this field. Bots that fill it get a quiet "success".
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", fieldErrors, values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = await contactLimiter.limit(ip);
  if (!success) {
    return {
      status: "error",
      message: "You've sent a few messages already. Please try again in about ten minutes.",
      values,
    };
  }

  const canSave = hasDatabase();
  const canEmail = canSendEmail();
  const fallback = `Something went wrong on my side. Please email me directly at ${site.email}.`;
  if (!canSave && !canEmail) return { status: "error", message: fallback, values };

  // Save first: if email delivery fails, the message is still in the admin inbox.
  let saved = false;
  if (canSave) {
    try {
      await getDb().message.create({ data: toRow(parsed.data) });
      saved = true;
    } catch (e) {
      console.error("[contact] could not save message", e);
    }
  }

  let emailed = false;
  if (canEmail) {
    try {
      await sendContactEmail(parsed.data);
      emailed = true;
    } catch (e) {
      console.error("[contact] could not send email", e);
    }
  }

  if (!saved && !emailed) return { status: "error", message: fallback, values };
  return { status: "success" };
}

function toRow({ name, email, message }: { name: string; email: string; message: string }) {
  return { name, email, body: message };
}
