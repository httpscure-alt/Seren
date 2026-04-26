import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ENTITLEMENT_COOKIE = "seren_entitled";
const COUPON_COOKIE = "seren_coupon";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan") ?? "journey";
  const next = url.searchParams.get("next") ?? "/report/srn-8821";
  const coupon = url.searchParams.get("coupon") ?? "";

  const c = await cookies();
  c.set(ENTITLEMENT_COOKIE, plan, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  if (coupon) {
    c.set(COUPON_COOKIE, coupon, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

