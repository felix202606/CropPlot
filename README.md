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

Connect this GitHub repo in Cloudflare → Workers & Pages → Create → Pages → Connect to Git:

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `out`

Then add the custom domains `cropplot.com` and `www.cropplot.com` under the project's **Custom domains** tab.
