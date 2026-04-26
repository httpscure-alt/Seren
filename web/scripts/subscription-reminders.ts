import "dotenv/config";

async function main() {
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  const token = process.env.CRON_SECRET ?? "";
  const url = new URL("/api/jobs/subscription-reminders", origin);
  if (token) url.searchParams.set("token", token);
  const res = await fetch(url.toString());
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(json);
    process.exit(1);
  }
  console.log(json);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

