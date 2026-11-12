# CropPlot website

Marketing site for [cropplot.com](https://cropplot.com), built with Next.js (static export) and hosted on Cloudflare Pages.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in ./out
```

## Structure

- `app/page.tsx` – landing page (features, pricing, FAQ, download)
- `app/companion-planting/[plant]` – programmatic SEO pages generated from `lib/plants.ts`
- `lib/site.ts` – plans, features, FAQ copy
- `lib/plants.ts` – companion planting matrix, also exported to `supabase/seed.sql`
- `functions/` – Cloudflare Pages Functions: Stripe Checkout, Stripe webhook, diagnosis photo upload
- `supabase/migrations` – Postgres schema (profiles, subscriptions, companion matrix JSONB, diagnoses)
- `mobile/` – Flutter app (iOS + Android). Beds and watering reminders stay in sqflite. Sign-in uses Supabase Auth, and Pro status is read from `subscriptions`.

## Backend

```bash
npm run seed    # regenerate supabase/seed.sql from lib/plants.ts
```

Apply `supabase/migrations` and `supabase/seed.sql` in the Supabase SQL editor (or with the Supabase CLI). Then set the Pages secrets listed in `env.example`:

```bash
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name cropplot
```

Stripe webhook endpoint: `https://cropplot.com/api/stripe-webhook`. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`, `charge.dispute.created`, and `radar.early_fraud_warning.created`. Checkout uses `STRIPE_PRICE_ID` (CropPlot Pro, $35.99/year). Signed-in app users open the Customer Portal at `GET /api/billing-portal` with a Supabase access token.

Diagnosis photos go to the R2 bucket `cropplot-diagnoses` (binding `DIAGNOSES` in `wrangler.toml`). User avatars use the Supabase Storage bucket `avatars`.

## Mobile app

```bash
cd mobile
flutter pub get
flutter test
flutter run
```

Sign in with the same email used at checkout. New accounts must confirm that email before the first sign-in. Pro shows when that email has an active subscription.

## Deploy (Cloudflare Pages)

The Pages project `cropplot` (custom domains `cropplot.com`, `www.cropplot.com`) is deployed with Wrangler:

```bash
npx wrangler login   # once
npm run deploy
```
