import { AuthClient } from "./AuthClient";

type Props = { searchParams?: Promise<{ returnTo?: string }> };

function safeReturnTo(maybePath: string | undefined) {
  if (!maybePath) return "/consult/analyzing";
  if (!maybePath.startsWith("/")) return "/consult/analyzing";
  return maybePath;
}

export default async function AuthPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const returnTo = safeReturnTo(sp.returnTo);
  const oauth = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    apple: Boolean(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
  };
  return <AuthClient returnTo={returnTo} oauth={oauth} />;
}

