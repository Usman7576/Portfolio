// Vercel runs this instead of `npm run build`. Migrations are applied only once a database is
// configured, so deploys keep working (with static content) before Neon is set up.
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (process.env.DIRECT_URL) {
  run("npx prisma migrate deploy");
} else {
  console.log("[vercel-build] DIRECT_URL not set; skipping migrations.");
}
run("npx next build");
