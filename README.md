# UltraFrame marketing & checkout

Next.js site for [UltraFrame Optimizer](https://softwarerefresh.com) with Stripe Checkout and post-purchase installer download.

## Production setup

1. Copy `env.example` to `.env.local` (or `.env`) and set live Stripe keys, product/price IDs, webhook secret, and `NEXT_PUBLIC_APP_URL`.
2. Configure a Stripe webhook for `checkout.session.completed` → `https://<your-domain>/api/stripe/webhooks`.
3. Enable Managed Payments in Stripe and use a product with an eligible tax code.
4. Deploy (e.g. Vercel). Ensure `data/` is writable if you rely on local catalog cache, or depend on env vars only.

## Customer flow

1. **Checkout** — `/checkout` → Stripe-hosted payment.
2. **Success** — `/success?session_id=...` reveals the license key once and offers download.
3. **Manage** — `/license/manage` to list, activate, and remove devices (up to 3).
4. **Download** — `/api/installer/download?session_id=...` verifies payment, then redirects to the installer API.

## Development

```bash
npm install
npm run dev
```

Forward webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Sale pricing is controlled by `src/config/sale.json`.
