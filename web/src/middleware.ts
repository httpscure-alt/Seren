import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal route protection for production hardening.
// We keep it permissive for now (UI demo), but gate obvious admin/clinician routes.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname.startsWith("/physician") || pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  // NextAuth session cookie is httpOnly; this is a lightweight guard.
  // Real enforcement is also done server-side via `auth()` checks.
  const hasSession =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/physician/:path*", "/admin/:path*"],
};

