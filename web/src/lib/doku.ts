import crypto from "crypto";

export function dokuConfig() {
  const clientId = process.env.DOKU_CLIENT_ID || "";
  const secretKey = process.env.DOKU_SECRET_KEY || "";
  const isProd = (process.env.DOKU_ENV || "").toLowerCase() === "production";
  const baseUrl = isProd ? "https://api.doku.com" : "https://api-sandbox.doku.com";
  return { clientId, secretKey, isProd, baseUrl };
}

export function dokuRequestTimestamp() {
  // DOKU expects ISO8601 UTC (e.g. 2020-08-11T08:45:42Z). `toISOString()` is UTC.
  // Remove milliseconds to match examples more closely.
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function dokuDigestFromBody(bodyText: string) {
  // Digest: base64(SHA256(body))
  return crypto.createHash("sha256").update(bodyText, "utf8").digest("base64");
}

export function dokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  digest,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  digest?: string;
  secretKey: string;
}) {
  const lines = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:${requestTarget}`,
  ];
  if (digest) lines.push(`Digest:${digest}`);
  const component = lines.join("\n");

  const mac = crypto.createHmac("sha256", secretKey);
  mac.update(component, "utf8");
  const sig = mac.digest("base64");
  return `HMACSHA256=${sig}`;
}

export function dokuSignedHeaders({
  clientId,
  secretKey,
  requestId,
  requestTimestamp,
  requestTarget,
  bodyText,
  includeDigest = true,
}: {
  clientId: string;
  secretKey: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  bodyText?: string;
  includeDigest?: boolean;
}) {
  const digest = bodyText && includeDigest ? dokuDigestFromBody(bodyText) : "";
  const signature = dokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest: bodyText && includeDigest ? digest : undefined,
    secretKey,
  });

  const headers: Record<string, string> = {
    "Client-Id": clientId,
    "Request-Id": requestId,
    "Request-Timestamp": requestTimestamp,
    Signature: signature,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (bodyText && includeDigest) headers.Digest = digest;
  return headers;
}

export function verifyDokuWebhookSignature({
  clientId,
  secretKey,
  requestTarget,
  headers,
  bodyText,
}: {
  clientId: string;
  secretKey: string;
  requestTarget: string;
  headers: Headers;
  bodyText: string;
}) {
  const headerClientId = (headers.get("Client-Id") || headers.get("client-id") || "").trim();
  const requestId = (headers.get("Request-Id") || headers.get("request-id") || "").trim();
  const requestTimestamp = (headers.get("Request-Timestamp") || headers.get("request-timestamp") || "").trim();
  const signature = (headers.get("Signature") || headers.get("signature") || "").trim();

  if (!headerClientId || headerClientId !== clientId) return { ok: false as const, error: "Invalid client id." };
  if (!requestId || !requestTimestamp || !signature) return { ok: false as const, error: "Missing signature headers." };

  const digest = dokuDigestFromBody(bodyText);
  const expected = dokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest,
    secretKey,
  });

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  const same = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!same) return { ok: false as const, error: "Invalid signature." };
  return { ok: true as const };
}

