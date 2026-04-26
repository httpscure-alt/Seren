import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function makeDemoCode() {
  return `SRN-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function safeNext(maybePath: string | null) {
  if (!maybePath) return "/referral";
  if (!maybePath.startsWith("/")) return "/referral";
  return maybePath;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = safeNext(url.searchParams.get("next"));

  const c = await cookies();
  if (!c.get("seren_referral")?.value) {
    c.set("seren_referral", makeDemoCode(), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

