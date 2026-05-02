# Seren × Midtrans — integration handoff (template)

Pakai dokumen ini saat komunikasi dengan tim Midtrans (onboarding, audit, atau support).  
**Salin konten ini ke dokumen baru** lalu lengkapi bagian bergaris bawah/`FILL`; **sertakan Merchant ID / Client Key / Server Key hanya lewat jalur rahasia** Midtrans Anda (biasanya tiket/email resmi)—**jangan** commit nilai sensitif ke git.

English: Use this checklist with Midtrans. Copy to a blank doc, fill `FILL` fields. Never commit live keys into the repository.

---

## 1. Merchant & brand snapshot

| Field | Value |
| --- | --- |
| Legal merchant / company | PT Sene Kamayu Venture |
| Consumer-facing brand | Seren |
| Public website | https://seren.id |
| Primary contact (ops / finance PIC) | FILL_NAME — FILL_EMAIL — FILL_PHONE |
| Technical contact (engineering) | FILL_NAME — FILL_EMAIL |

---

## 2. Credential sheet (sandbox / production) — fill locally, share securely

| Item | Sandbox (testing) | Production (live) |
| --- | --- | --- |
| Merchant ID (`merchant_id`) | FILL_FROM_SANDBOX_DASHBOARD | FILL_FROM_PRODUCTION_DASHBOARD |
| Client key (`Mid-client-…`) | FILL_OR_N_A | FILL_OR_N/A |
| Server key (`Mid-server-…`) | Share via secure channel only | Share via secure channel only |

**Implementation note:** Backend Snap create uses **Server Key** via HTTP Basic (see §4). Exposing **Client Key** is usually only needed for client-side Snap.js; Seren primarily uses server-side redirect (`redirect_url`).

---

## 3. Operational environment (matching keys ↔ API hosts)

Hosting reads these **Vercel / server** env vars (`web` project):

| Variable | Purpose |
| --- | --- |
| `MIDTRANS_SERVER_KEY` | Server key for Signature + Basic auth |
| `MIDTRANS_ENV` | Set exactly `production` **only** if both key and Dashboard are **Production**. Omit or unset for **Sandbox** Snap + matching sandbox server key |

Snap API base URL logic (see `web/src/lib/midtrans.ts`):

- If `MIDTRANS_ENV` is `production` → `https://app.midtrans.com/snap/v1/transactions`
- Otherwise → `https://app.sandbox.midtrans.com/snap/v1/transactions`

⚠️ **Sandbox Server Key against production Snap host (or reversed) returns HTTP `401 Unauthorized`.**

---

## 4. Integration type & technical endpoints (live site)

**Pattern:** Backend **Snap Transactions API** (`POST`), **redirect browser** via `redirect_url`.  
**Webhook:** Backend **notification** verification with `signature_key`.

| Purpose | HTTPS URL |
| --- | --- |
| Paywall (choose plan, Midtrans lane) | https://seren.id/paywall?provider=MIDTRANS |
| Checkout (order summary → continue to PSP) | https://seren.id/paywall/checkout?plan=journey&next=%2Fresults&provider=MIDTRANS *(adjust `plan` / `next`)* |
| **Payment Notification URL** (HTTP POST notifications) | https://seren.id/api/payments/midtrans/webhook |
| **Probe (GET)** on webhook | Returns `{"ok":true}` — real notifications remain **POST** |
| Canonical Terms | https://seren.id/terms |
| Canonical Privacy | https://seren.id/privacy |

**Midtrans Dashboard (Sandbox / Prod) fields to mirror:**

| Dashboard field | Typical value |
| --- | --- |
| Notification URL | `https://seren.id/api/payments/midtrans/webhook` |
| Finish redirect URL (default fallback) | e.g. `https://seren.id/results` (per transactional `callbacks.finish` from API may override.) |

---

## 5. Backend protocol summary (what Midtrans can log)

### 5a. Create Snap token (merchant server → Midtrans)

- **HTTP:** `POST` JSON to Snap URL above (sandbox or prod matching server key env).
- **Auth:** `Authorization: Basic BASE64(ServerKey + ":")` (colon suffix required).
- **Body (minimal):**

```json
{
  "transaction_details": {
    "order_id": "SRN-PAY-<unix>-<rand>",
    "gross_amount": 99000
  },
  "customer_details": {
    "email": "<authenticated_user_email>"
  },
  "callbacks": {
    "finish": "https://seren.id/<path-after-payment>"
  }
}
```

Implementation: `web/src/app/api/payments/midtrans/create/route.ts`  
Protected route — **authenticated** NextAuth session required.

### 5b. Notifications (Midtrans → merchant)

- **URL:** `POST https://seren.id/api/payments/midtrans/webhook`
- **Signature verification:**

```
expected = HEX( SHA512( order_id + status_code + gross_amount + ServerKey ) )
```

Compare payload field `signature_key` to `expected` (full server key concatenated, exact string concatenation).

Implementation: `web/src/app/api/payments/midtrans/webhook/route.ts`

**Success activation:** statuses `settlement` or `capture` (stored + subscription grant in app DB).

---

## 6. What to send Midtrans teams (recommended package)

Attach or paste in ticketing system:

1. This completed template (**without** plaintext keys in email body if policy forbids paste keys).
2. **Merchant IDs** sandbox + production (identifiers only okay in email sometimes).
3. **Notification URL** + **Screenshot** Dashboard showing URL saved.
4. **Test account credential** *(optional)* — if Midtrans QA needs a staging login:

| Field | Value |
| --- | --- |
| Test purchaser email | FILL_SEREN_LOGIN_EMAIL *(create burner / shared QA user)* |
| Test purchaser password | FILL_SENT_VIA_SIDE_CHANNEL |
| Preferred test SKU | Journey plan via checkout URL §4 |

Invite Midtrans to run one **small Sandbox** txn and confirm webhook **HTTP 200** + JSON `{"ok":true}` on successful signature.

---

## 7. Troubleshooting shorthand

| Symptom | Typical cause |
| --- | --- |
| `401` on Snap create | Server key mismatch vs Snap host (`MIDTRANS_ENV` vs key origin) |
| `401 Invalid signature.` on webhook | Prod key on sandbox notification or webhook body tampered |
| Duplicate subscription | Replay — ensure idempotent handling (order_id unique in DB checks) |

---

## 8. Internal env checklist (engineering)

Paste into Slack / sprint doc (**values redacted here**):

- [ ] `MIDTRANS_SERVER_KEY` aligned with Sandbox **or** Production merchant
- [ ] `MIDTRANS_ENV` = `production` **only for production merchant + prod key**
- [ ] Dashboard **Notification URL** saved for same environment (`sandbox`/`production`)
- [ ] Regression: paywall lanes `MIDTRANS`, `DOKU`, … still switch via query `?provider=`

---

## 9. Dedicated Midtrans PSP browser account (`/api/admin/setup-midtrans-qa`)

Seren dapat menyediakan **satu akun login** bagi tim Midtrans (browser test) yang **pasti tidak punya entitlement aktif** sehingga alur **`/paywall` → Snap Midtrans selalu bisa dijalankan** setelah provisioning / reset.

### Langkah Anda (engineering)

1. Pilih email khusus (contoh burner di domain Anda): eg. `psp-review@YOURDOMAIN.COM`.
2. Buat kata sandi panjang kuat (>8 karakter) — kirim kepada Midtrans lewat jalur rahasia mereka, **jangan**
   menyimpan plaintext di repo.
3. Pada Vercel (Production): set opsional tetapi disarankan:
   - `MIDTRANS_QA_EMAIL` — alamat tersebut
   - `MIDTRANS_QA_PASSWORD` — kata sandinya
   - `MIDTRANS_QA_NAME` — label tampilan, mis. `"Midtrans PSP Review"`
   - `CRON_SECRET` — sudah ada; dipakai untuk memanggil endpoint di bawah.
4. Jalankan provisioning **sekali per environment**:

```bash
curl -sS -X POST "https://seren.id/api/admin/setup-midtrans-qa" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email":"psp-review@YOURDOMAIN.COM","password":"YOUR_STRONG_PASSWORD","name":"Midtrans PSP Review"}'
```

Tanpa `-d` overrides: kosongkan body `{}` akan memakai **hanya `MIDTRANS_QA_EMAIL` / `MIDTRANS_QA_PASSWORD` dari env.**

**Alternatif:** pengguna ADMIN / PHYSICIAN yang sudah login dapat `POST /api/admin/setup-midtrans-qa`
dengan body `{}` dari browser/DevTools **jika ketiga env QA sudah diset di server**. Override `email`/`password` di JSON
**hanya** diizinkan dengan `Bearer CRON_SECRET` (staff session saja mendapat **403** jika mencoba kirim overrides).

Endpoint akan:

- Upsert pengguna **`USER`**, **`emailVerified` kini**
- Meng-hash ulang kata sandi
- **Menghapus seluruh `Subscription` + `Payment`** untuk pengguna tersebut agar **`hasActiveSubscription` tidak menghalangi**

Setelah pembayaran uji sandbox sukses, jalankan ulang POST yang sama untuk **me-reset entitlement** bagi putaran tes berikutnya.

### Yang diberikan ke Midtrans

| Field | Isi |
| --- | --- |
| Login URL | `https://seren.id/auth` |
| Username | Email yang Anda set |
| Password | Via channel aman mereka |
| Uji jalur pembayaran | `https://seren.id/paywall?provider=MIDTRANS` → pilih paket → **Continue** → Snap |

Sandbox Midtrans tetap menggunakan kartu/pembayaran uji mereka; **`MIDTRANS_ENV` tidak boleh production** sampai Anda lempar ke Merchant Production (lihat §3).
