import "server-only";
import { redirect } from "next/navigation";
import { auth, isAdminLogin } from "@/lib/auth";

/**
 * Call at the top of every admin page, server action and route handler.
 * The proxy only redirects; this is the check that actually protects data.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session || !isAdminLogin(session.user.login)) redirect("/admin/login");
  return session;
}
