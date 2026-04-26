import { NextResponse } from "next/server";
import { validateCouponCode } from "@/lib/promotions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const res = await validateCouponCode(code);
  return NextResponse.json(res, { status: res.ok ? 200 : 400 });
}

