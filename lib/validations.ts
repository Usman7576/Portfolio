import { z } from "zod";

// Shared by the contact form (client hints) and the server action (the real check).
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(100, "Please keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .max(200, "That email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail helps: at least 10 characters.")
    .max(5000, "Please keep your message under 5,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
