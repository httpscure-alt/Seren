import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const createSchema = z.object({
  text: z.string().trim().min(1).max(2000),
  // optional "reason" for quick replies, etc.
  kind: z.string().trim().max(60).optional(),
});

async function requireAuthed() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) return { session: null, userId: null };
  return { session, userId };
}

async function ensureThread(userId: string) {
  const existing = await prisma.messageThread.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.messageThread.create({
    data: { userId, title: "Dr. Riris" },
    select: { id: true },
  });

  // Seed a first clinician message so the inbox doesn't look empty.
  await prisma.message.create({
    data: {
      threadId: created.id,
      role: "CLINICIAN",
      text:
        "Hi — I’m Dr. Riris. I’ll guide your 30‑day routine here. Tap your AM/PM checklist, and if anything feels off, send me a note (you can attach a photo).",
      meta: { seeded: true },
    },
  });

  return created.id;
}

export async function GET() {
  const { userId } = await requireAuthed();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const threadId = await ensureThread(userId);
  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      messages: {
        orderBy: { createdAt: "asc" },
        take: 80,
        select: {
          id: true,
          role: true,
          text: true,
          createdAt: true,
          meta: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, thread });
}

export async function POST(req: Request) {
  const { userId } = await requireAuthed();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const threadId = await ensureThread(userId);

  const msg = await prisma.message.create({
    data: {
      threadId,
      userId,
      role: "USER",
      text: parsed.data.text,
      meta: parsed.data.kind ? { kind: parsed.data.kind } : undefined,
    },
    select: { id: true, role: true, text: true, createdAt: true, meta: true },
  });

  // Lightweight auto-reply for v1 to keep the loop feeling “alive”.
  // Clinician workflow can replace this later.
  const auto = await prisma.message.create({
    data: {
      threadId,
      role: "CLINICIAN",
      text:
        parsed.data.kind === "checkin"
          ? "Got it. Keep going today — consistency beats intensity. If you notice irritation, tell me what product stung and when."
          : "Thanks — I saw your message. If you can, share what changed (new product, period, stress, weather) and attach a photo if it’s visible.",
      meta: { auto: true },
    },
    select: { id: true, role: true, text: true, createdAt: true, meta: true },
  });

  // Touch thread updatedAt
  await prisma.messageThread.update({ where: { id: threadId }, data: { updatedAt: new Date() } });

  return NextResponse.json({ ok: true, messages: [msg, auto] });
}

