import { redirect } from "next/navigation";

/** Older path — canonical URL is /emails */
export default function MockEmailsRedirectPage() {
  redirect("/emails");
}
