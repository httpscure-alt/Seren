import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
if (!authSecret && process.env.NODE_ENV === "production") {
  console.error(
    "[auth] Set NEXTAUTH_SECRET or AUTH_SECRET in production so JWT sessions can be verified.",
  );
}

const credentialsSchema = z.object({
  email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    z.string().email(),
  ),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  debug: process.env.NODE_ENV === "development",
  // Credentials provider requires JWT sessions in NextAuth v4; database sessions do not persist credential sign-ins.
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email;
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user?.password) return null;

          const ok = await bcrypt.compare(parsed.data.password, user.password);
          if (!ok) return null;

          return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
        } catch (e: unknown) {
          console.error("[auth] credentials authorize failed:", e);
          const code = typeof e === "object" && e && "code" in e ? String((e as { code?: string }).code) : "";
          if (code === "P1001" || code === "ENOTFOUND" || code === "ECONNREFUSED") {
            throw new Error("DatabaseUnavailable");
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as { role?: string }).role;
        if (user.email) token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      const userId = ((token.userId as string) || (token.sub as string)) ?? undefined;
      if (session.user) {
        session.user.email = (token.email as string) ?? session.user.email ?? "";
        if (userId) (session.user as { id?: string }).id = userId;
      }
      if (userId) (session as { userId?: string }).userId = userId;
      if (token.role) (session as { role?: string }).role = token.role as string;
      return session;
    },
  },
};

