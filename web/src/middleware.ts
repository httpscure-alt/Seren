import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware — lightweight session check for protected routes.
 * We can't call Prisma here (Edge runtime), so we only verify that a
 * NextAuth JWT cookie exists.  Role enforcement happens inside each
 * page/API via `requireRole()`.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate page routes — API routes handle their own auth via requireRole()
  const isProtected =
    (pathname.startsWith("/physician") || pathname.startsWith("/admin")) &&
    !pathname.startsWith("/api/");

  if (!isProtected) return NextResponse.next();

  // NextAuth writes an httpOnly JWT cookie; its mere presence means
  // the user has an active session.  The actual role check is done
  // server-side in each page / API route.
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
