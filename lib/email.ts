import "server-only";
import { Resend } from "resend";
import type { ContactInput } from "@/lib/validations";

export function canSendEmail() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

export async function sendContactEmail({ name, email, message }: ContactInput) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    // Resend's shared sender works until a custom domain is verified, but only delivers
    // to the email address of the Resend account itself.
    from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\n— ${name} <${email}>`,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
