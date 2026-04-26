import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

function toUtcMidnight(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseYmd(ymd: string) {
  // Expect YYYY-MM-DD to avoid timezone surprises.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo, da));
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

const getQuerySchema = z.object({
  start: z.string().optional(), // YYYY-MM-DD
  end: z.string().optional(), // YYYY-MM-DD
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = getQuerySchema.safeParse({
    start: url.searchParams.get("start") ?? undefined,
    end: url.searchParams.get("end") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid query." }, { status: 400 });
  }

  const now = toUtcMidnight(new Date());
  const start = parsed.data.start ? parseYmd(parsed.data.start) : new Date(now.getTime() - 29 * 86400000);
  const end = parsed.data.end ? parseYmd(parsed.data.end) : now;
  if (!start || !end) {
    return NextResponse.json({ ok: false, error: "Dates must be YYYY-MM-DD." }, { status: 400 });
  }
  if (start.getTime() > end.getTime()) {
    return NextResponse.json({ ok: false, error: "Start must be before end." }, { status: 400 });
  }

  const rows = await prisma.journeyCheckIn.findMany({
    where: {
      userId,
      date: { gte: toUtcMidnight(start), lte: toUtcMidnight(end) },
    },
    orderBy: [{ date: "asc" }, { slot: "asc" }],
    select: { date: true, slot: true, completedSteps: true },
  });

  const items = rows.map((r) => ({
    date: r.date.toISOString().slice(0, 10),
    slot: r.slot,
    completedSteps: r.completedSteps,
  }));

  return NextResponse.json({ ok: true, range: { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }, items });
}

const postSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  slot: z.enum(["AM", "PM"]),
  step: z.string().min(1).max(80),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const dt = parseYmd(parsed.data.date);
  if (!dt) {
    return NextResponse.json({ ok: false, error: "Date must be YYYY-MM-DD." }, { status: 400 });
  }
  const date = toUtcMidnight(dt);

  const key = { userId_date_slot: { userId, date, slot: parsed.data.slot as any } };

  const existing = await prisma.journeyCheckIn.findUnique({
    where: key,
    select: { date: true, slot: true, completedSteps: true },
  });

  const nextSteps = existing
    ? existing.completedSteps.includes(parsed.data.step)
      ? existing.completedSteps.filter((s) => s !== parsed.data.step)
      : [...existing.completedSteps, parsed.data.step]
    : [parsed.data.step];

  const saved = existing
    ? await prisma.journeyCheckIn.update({
        where: key,
        data: { completedSteps: nextSteps },
        select: { date: true, slot: true, completedSteps: true },
      })
    : await prisma.journeyCheckIn.create({
        data: {
          userId,
          date,
          slot: parsed.data.slot as any,
          completedSteps: nextSteps,
        },
        select: { date: true, slot: true, completedSteps: true },
      });

  return NextResponse.json({
    ok: true,
    item: { date: saved.date.toISOString().slice(0, 10), slot: saved.slot, completedSteps: saved.completedSteps },
  });
}

