import crypto from "crypto";

export type XenditMode = "test" | "live";

export function xenditConfig() {
  const secretKey = process.env.XENDIT_SECRET_KEY || "";
  const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN || "";
  const mode = ((process.env.XENDIT_MODE || "").toLowerCase() === "live" ? "live" : "test") as XenditMode;
  return { secretKey, webhookToken, mode };
}

export function xenditAuthHeader(secretKey: string) {
  // Xendit uses Basic auth: base64(secretKey + ":")
  const token = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${token}`;
}

/** Idempotency helper — safe, short, deterministic. */
export function xenditIdempotencyKey(orderId: string) {
  return crypto.createHash("sha256").update(orderId).digest("hex").slice(0, 32);
}

