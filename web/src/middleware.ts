import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicDemosBlocked } from "@/lib/publicDemos";

/**
 * Edge middleware — lightweight session check for protected routes.
 * We can't call Prisma here (Edge runtime), so we only verify that a
 * NextAuth JWT cookie exists.  Role enforcement happens inside each
 * page/API via `requireRole()`.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    (pathname === "/demos" || pathname.startsWith("/demos/") || pathname === "/mock" || pathname.startsWith("/mock/")) &&
    isPublicDemosBlocked()
  ) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname.startsWith("/api/")) return NextResponse.next();

  const hasSession = !!(
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token")
  );

  // Investor pitch access is gated by `PRE_SEED_PAGE_TOKEN` via server-side `resolvePitchAccess()`.
  // Middleware should not block anonymous access here, otherwise the `?t=` token can never work.
  if (pathname.startsWith("/pitch")) {
    return NextResponse.next();
  }

  // Staff / clinician areas — redirect unauthenticated users to sign-in.
  const isProtected =
    pathname.startsWith("/physician") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/partner") ||
    pathname.startsWith("/account");

  if (!isProtected) return NextResponse.next();

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/demos",
    "/demos/:path*",
    "/mock",
    "/mock/:path*",
    "/physician/:path*",
    "/admin/:path*",
    "/support/:path*",
    "/partner/:path*",
    "/account/:path*",
    "/pitch/:path*",
  ],
};
