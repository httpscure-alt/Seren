import crypto from "crypto";

export function duitkuConfig() {
  const isProd = process.env.NODE_ENV === "production" && process.env.PAYMENT_PROVIDER === "DUITKU" && process.env.DUITKU_ENV === "production";
  return {
    merchantCode: process.env.DUITKU_MERCHANT_CODE || "",
    apiKey: process.env.DUITKU_API_KEY || "",
    baseUrl: isProd ? "https://passport.duitku.com/webapi/api/merchant/v2/inquiry" : "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
    isProd,
  };
}

export function generateDuitkuSignature(merchantOrderId: string, amountIdr: number, apiKey: string, merchantCode: string) {
  // MD5(merchantCode + merchantOrderId + paymentAmount + apiKey)
  const payload = `${merchantCode}${merchantOrderId}${amountIdr}${apiKey}`;
  return crypto.createHash("md5").update(payload).digest("hex");
}

export function verifyDuitkuWebhookSignature(merchantOrderId: string, amountIdr: number | string, signature: string, apiKey: string, merchantCode: string) {
  // Callback signature: MD5(merchantCode + amount + merchantOrderId + apiKey)
  const payload = `${merchantCode}${amountIdr}${merchantOrderId}${apiKey}`;
  const expected = crypto.createHash("md5").update(payload).digest("hex");
  return expected === signature;
}
