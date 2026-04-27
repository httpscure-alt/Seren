# Seren referral & affiliate service (standalone)

This folder is a **separate bounded context**: its own database and APIs. The main Seren app (`web/`) should only talk to it over **HTTPS + signed webhooks / service API keys**—no shared Prisma schema. That keeps payouts, KYC-ish creator data, and commission logic out of the clinical monolith.

---

## 1. Where shareable journey cards live today (main app)

Sharable “journey / report” cards are **design demos only**, not wired into production `/results` or `/results/journey`.

| Area | Base path | What it is |
|------|-----------|------------|
| Share fun explorations | `/demos/share-fun` (subroutes `d`, `e`, `f`) | Playful card variants for social |
| Share variants | `/demos/share-variants` (`a`, `b`, `c`) | Layout / OG-style previews |
| Share report mock | `/demos/share-report`, `/demos/share-preview` | “Share page” + copy link / WhatsApp (mock) |
| Recommendations demo | `/demos/recommendations` | Includes `ShareableReportCard` |
| Journey library | `/demos/journey-library` | Journey presentation concepts |

**Production:** `web/src/app/results/journey/JourneyClient.tsx` has **no** share/export flow yet. To ship in-app sharing, reuse one of the demo layouts and add a route under `/results` or `/journey` with real user data + privacy gates (no clinical photos in OG image by default—already called out in demos).

**Existing referral *stub* in main app:** `/referral` and `GET /api/referral/init` set a **demo** cookie code; copy mentions credits but there is **no** attribution ledger or payout. Replace that with calls to this service when you integrate.

---

## 2. Goals

- **End users:** refer friends; earn **8–10%** of **net subscription fee** (configurable per program) when the referee pays.
- **External creators:** unique links/codes, dashboard, monthly payout statement, optional tier (e.g. 8% default, 10% negotiated).
- **Seren ops:** programs, rates, fraud review, manual adjustments, export for finance.

---

## 3. Core concepts

| Concept | Meaning |
|--------|---------|
| **Partner** | Anyone who can earn: Seren `user_id` (nullable until linked) or standalone creator record |
| **Program** | Rules: `rate_bps` (800–1000 = 8–10%), cookie window, eligible plans, active dates |
| **Attribution** | First-touch or last-touch within window; store `referral_code` + landing timestamp |
| **Conversion** | Referee completed a **qualifying payment** (Midtrans `SUCCEEDED` on subscription SKU) |
| **Commission** | `floor(qualifying_amount_idr * rate_bps / 10000)`; currency IDR v1 |
| **Payout** | Batch monthly (or threshold); status `pending`, `approved`, `paid` |

**Commission base (recommended):** gross IDR captured on the **first qualifying subscription payment** (or each renewal—product choice). Start with **first payment only** to limit liability; document in `Program`.

**Tax / compliance:** creators may need invoices or W-8/W-9 style collection later—keep `Partner.payout_profile` JSON extensible, do not block v1.

---

## 4. Attribution flow (high level)

1. **Land:** `https://seren.com/?ref=CREATOR123` or `/r/CREATOR123` redirect sets **HttpOnly** cookie `seren_ref` (or this service sets short-lived signed JWT in query → main app exchanges once).
2. **Signup optional:** store `referral_code` on referee when account created (main app sends `POST /v1/attributions` with `anonymous_id` / `email_hash` until `user_id` exists).
3. **Pay:** main app webhook or worker calls `POST /v1/events/payment-succeeded` with `order_id`, `user_id`, `amount_idr`, `plan`, `subscription_id`.
4. **Service:** resolves active attribution → creates **Conversion** + **Commission** rows (idempotent on `order_id`).

**Idempotency:** all event endpoints require an `event_id` (e.g. `midtrans-{order_id}`) so retries never double-pay commission.

---

## 5. Partner types

| Type | Identity | Notes |
|------|----------|--------|
| `USER` | Links to Seren `user_id` | In-app referral UI; optional payout to “wallet” or bank later |
| `CREATOR` | Email + payout details | External; codes like `SARAH10`; optional manual KYC flag |

Same `Commission` table; `Program` can restrict which `partner_type` is eligible.

---

## 6. API surface (this service)

All routes authenticated with `Authorization: Bearer <SERVICE_SECRET>` from Seren backend (or mTLS later).

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/partners` | Create creator / link Seren user |
| `GET` | `/v1/partners/:id` | Balance, pending commissions |
| `POST` | `/v1/codes` | Issue or rotate referral code |
| `POST` | `/v1/attributions` | Record landing / signup |
| `POST` | `/v1/events/payment-succeeded` | **Main integration** from Midtrans success |
| `POST` | `/v1/events/subscription-refunded` | Claw back or mark `reversed` |
| `GET` | `/v1/internal/payouts/:period` | Finance export |

**Public read-only (optional):** `GET /v1/codes/:code/validate` for landing page (rate limited).

---

## 7. Integration checklist (Seren `web/` later)

- [ ] Replace demo `/api/referral/init` with redirect that hits this service or sets cookie from signed payload.
- [ ] On registration, forward referral context (hashed email + code).
- [ ] On **Midtrans webhook** success (`web/src/app/api/payments/midtrans/webhook/route.ts` or equivalent), emit `payment-succeeded` with amounts from DB.
- [ ] Admin UI can stay minimal: link out to **referral-service dashboard** or embed iframe with SSO JWT.

---

## 8. Fraud & guardrails (v1)

- Cap commissions per referee (one conversion per referred user).
- Block self-referral (`partner.user_id === referee.user_id`).
- Velocity limits on new codes per IP.
- Manual `Commission.status = held` for review.

---

## 9. Tech suggestion

- Small **Node (Hono/Fastify)** or **Next.js API-only** deploy with **its own Postgres**.
- No user PII beyond email + payment refs; prefer **Seren `user_id`** opaque IDs from main app.

See `prisma/schema.prisma` in this folder for a starting data model.
