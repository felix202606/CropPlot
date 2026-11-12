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
- `mobile/` – Flutter app (iOS + Android) with an on-device sqflite database

## Backend

```bash
npm run seed    # regenerate supabase/seed.sql from lib/plants.ts
```

Apply `supabase/migrations` and `supabase/seed.sql` in the Supabase SQL editor (or with the Supabase CLI). Then set the Pages secrets listed in `env.example`:

```bash
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name cropplot
```

Stripe webhook endpoint: `https://cropplot.com/api/stripe-webhook`, events `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

Diagnosis photos go to the R2 bucket `cropplot-diagnoses` (binding `DIAGNOSES` in `wrangler.toml`). User avatars use the Supabase Storage bucket `avatars`.

## Mobile app

```bash
cd mobile
flutter pub get
flutter test
flutter run
```

## Deploy (Cloudflare Pages)

The Pages project `cropplot` (custom domains `cropplot.com`, `www.cropplot.com`) is deployed with Wrangler:

```bash
npx wrangler login   # once
npm run deploy
```
