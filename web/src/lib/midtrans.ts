export function midtransConfig() {
  const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
  const isProd = (process.env.MIDTRANS_ENV || "").trim() === "production";
  const baseUrl = isProd
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
  return { serverKey, baseUrl, isProd };
}

export function midtransAuthHeader(serverKey: string) {
  // Midtrans uses Basic auth: base64(serverKey + ":")
  const token = Buffer.from(`${serverKey.trim()}:`).toString("base64");
  return `Basic ${token}`;
}

