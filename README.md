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
- `lib/plants.ts` – companion planting matrix (same shape planned for the Supabase JSONB column)

## Deploy (Cloudflare Pages)

The Pages project `cropplot` (custom domains `cropplot.com`, `www.cropplot.com`) is deployed with Wrangler:

```bash
npx wrangler login   # once
npm run deploy
```
