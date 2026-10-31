import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginError } from "@/components/admin/login-error";
import { GitHubIcon } from "@/components/icons";
import { signIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const configured = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="bg-card w-full max-w-sm rounded-xl border p-8 text-center">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="text-muted-foreground mt-2 text-sm">Only the site owner can sign in.</p>

        <Suspense>
          <LoginError />
        </Suspense>

        {configured ? (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin" });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-medium"
            >
              <GitHubIcon className="size-4" /> Sign in with GitHub
            </button>
          </form>
        ) : (
          <p className="text-destructive mt-6 text-sm">
            GitHub sign-in isn&apos;t configured yet (AUTH_GITHUB_ID / AUTH_GITHUB_SECRET).
          </p>
        )}

        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mt-6 inline-block text-sm"
        >
          Back to the site
        </Link>
      </div>
    </main>
  );
}
