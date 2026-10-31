import { NextResponse } from "next/server";
import { auth, isAdminLogin } from "@/lib/auth";

// First line of defence: bounce signed-out visitors away from /admin before any page renders.
// Every admin page and action still calls requireAdmin(), so this is not the only check.
export default auth((req) => {
  if (req.nextUrl.pathname === "/admin/login") return;
  if (!isAdminLogin(req.auth?.user?.login)) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
