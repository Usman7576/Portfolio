import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: { login?: string } & DefaultSession["user"];
  }
}

/** Only this GitHub account may sign in. Usernames are case-insensitive on GitHub. */
export function isAdminLogin(login: unknown): boolean {
  const admin = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase();
  return Boolean(admin) && typeof login === "string" && login.toLowerCase() === admin;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Reads AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from the environment.
  providers: [GitHub],
  // Vercel is trusted automatically; this also lets sign-in work on localhost (next dev / start).
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    signIn: ({ profile }) => isAdminLogin(profile?.login),
    jwt: ({ token, profile }) => {
      if (profile?.login) token.login = profile.login;
      return token;
    },
    session: ({ session, token }) => {
      session.user.login = typeof token.login === "string" ? token.login : undefined;
      return session;
    },
  },
});
