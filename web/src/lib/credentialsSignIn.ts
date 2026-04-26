import { getSession } from "next-auth/react";

/**
 * Credentials sign-in without relying on next-auth/react `signIn()`, which can throw
 * when `new URL(data.url)` receives a relative or missing `url` in the JSON body.
 */
export async function signInWithCredentials(
  email: string,
  password: string,
  options?: { callbackPath?: string },
) {
  const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
  if (!csrfRes.ok) {
    throw new Error("Could not reach the sign-in service. Refresh and try again.");
  }
  const csrfJson = (await csrfRes.json()) as { csrfToken?: string };
  if (!csrfJson.csrfToken) {
    throw new Error("Could not start sign-in. Check NEXTAUTH_SECRET / cookies.");
  }

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/auth";
  const search = typeof window !== "undefined" ? window.location.search : "";
  const callbackUrl =
    options?.callbackPath != null
      ? `${window.location.origin}${options.callbackPath.startsWith("/") ? options.callbackPath : `/${options.callbackPath}`}`
      : `${window.location.origin}${pathname}${search}`;

  const body = new URLSearchParams({
    csrfToken: csrfJson.csrfToken,
    callbackUrl,
    json: "true",
    email,
    password,
  });

  const res = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    credentials: "include",
  });

  let data: { url?: string } = {};
  try {
    data = (await res.json()) as { url?: string };
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!res.ok) {
    let message = "Invalid email or password.";
    const raw = data.url;
    if (typeof raw === "string" && raw.length > 0) {
      try {
        const u = new URL(raw, window.location.origin);
        const err = u.searchParams.get("error");
        if (err === "CredentialsSignin") message = "Invalid email or password.";
        else if (err === "DatabaseUnavailable") {
          message =
            "Cannot reach the database. Start Postgres (docker compose in web/), then try again.";
        } else if (err) {
          message = err;
        }
      } catch {
        /* keep default */
      }
    }
    throw new Error(message);
  }

  await getSession();
  return { ok: true as const };
}
