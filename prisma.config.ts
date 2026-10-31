import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrations need Neon's direct (non-pooled) connection. Empty is fine for `prisma generate`,
  // which runs on install, including on Vercel builds before a database exists.
  datasource: {
    url: process.env.DIRECT_URL ?? "",
  },
});
