import { NextResponse } from "next/server";
import { LANG_COOKIE, normalizeLang } from "@/i18n/getDictionary";

export function GET(req: Request) {
  const url = new URL(req.url);
  const lang = normalizeLang(url.searchParams.get("lang") ?? undefined);
  const next = url.searchParams.get("next") || "/";

  // Redirect using the incoming Host header (avoid 0.0.0.0 Location).
  const host = req.headers.get("host") ?? url.host;
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const redirectUrl = new URL(next, `${proto}://${host}`);

  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set(LANG_COOKIE, lang, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

