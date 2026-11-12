import Link from "next/link";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Pricing } from "@/components/Pricing";
import { plants } from "@/lib/plants";
import { faqs, features, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: site.name,
      operatingSystem: "iOS, Android",
      applicationCategory: "LifestyleApplication",
      description: site.description,
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
        { "@type": "Offer", price: "35.99", priceCurrency: "USD", name: "Pro (yearly)" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-gradient-to-b from-leaf-100/70 to-transparent" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-leaf-700 ring-1 ring-leaf-200">
              🌱 Coming soon to iOS & Android
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-leaf-900 md:text-6xl">
              Grow more food.
              <br />
              Lose fewer plants.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-soil-900/75">
              CropPlot is the smart garden planner for home growers. Map your beds, get
              watering and harvest reminders, diagnose sick plants with a photo, and get
              warned before frost hits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#download"
                className="rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white hover:bg-leaf-700"
              >
                Start free
              </Link>
              <Link
                href="#features"
                className="rounded-full bg-white px-6 py-3 font-semibold text-leaf-900 ring-1 ring-soil-100 hover:ring-leaf-200"
              >
                See features
              </Link>
            </div>
            <p className="mt-4 text-sm text-soil-900/60">
              Free forever for unlimited plants. Pro from $35.99/year.
            </p>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <section id="features" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-4xl font-semibold text-leaf-900">
            Everything your garden needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-soil-900/70">
            Start with a powerful free planner. Upgrade to Pro when you want AI diagnosis,
            weather intelligence and harvest insights.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-soil-100 bg-soil-50 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{f.icon}</span>
                  {f.pro && (
                    <span className="rounded-full bg-leaf-900 px-2.5 py-0.5 text-xs font-semibold text-sun-400">
                      PRO
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-soil-900/70">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-leaf-900/10 ring-1 ring-soil-100">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-soil-100 text-3xl">🍃</div>
              <div>
                <p className="text-xs text-soil-900/60">Diagnosis · 92% confidence</p>
                <p className="font-semibold">Tomato early blight</p>
              </div>
            </div>
            <ol className="mt-5 space-y-3 text-sm">
              <li className="rounded-xl bg-leaf-50 p-3">1. Remove and bin affected lower leaves.</li>
              <li className="rounded-xl bg-leaf-50 p-3">2. Mulch to stop soil splashing onto foliage.</li>
              <li className="rounded-xl bg-leaf-50 p-3">3. Apply an organic copper or Bacillus subtilis spray every 7–10 days.</li>
            </ol>
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-leaf-600">Pro</span>
            <h2 className="mt-2 font-display text-4xl font-semibold text-leaf-900">
              Snap a photo. Save the plant.
            </h2>
            <p className="mt-4 text-soil-900/75">
              Spotted yellow leaves, holes or powdery spots? Take a picture and CropPlot&apos;s
              AI identifies the most likely pest or disease, then gives you an organic-first
              treatment plan you can start today. Every diagnosis is saved to the plant&apos;s
              history so you can track recovery.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-4xl font-semibold text-leaf-900">
            Simple pricing
          </h2>
          <p className="mx-auto mt-4 mb-14 max-w-xl text-center text-soil-900/70">
            One season of saved tomatoes pays for Pro.
          </p>
          <Pricing />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-semibold text-leaf-900">
                Companion planting guide
              </h2>
              <p className="mt-3 max-w-xl text-soil-900/70">
                Which vegetables grow well together, and which to keep apart.
              </p>
            </div>
            <Link href="/companion-planting/" className="font-semibold text-leaf-700 hover:underline">
              View all plants →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {plants.slice(0, 12).map((p) => (
              <Link
                key={p.slug}
                href={`/companion-planting/${p.slug}/`}
                className="rounded-2xl bg-white p-4 text-center ring-1 ring-soil-100 hover:ring-leaf-500"
              >
                <span className="text-3xl">{p.emoji}</span>
                <p className="mt-2 text-sm font-medium">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center font-display text-4xl font-semibold text-leaf-900">FAQ</h2>
          <div className="mt-10 divide-y divide-soil-100">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {f.q}
                  <span className="text-leaf-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-soil-900/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-leaf-900 px-8 py-16 text-center text-white">
          <h2 className="font-display text-4xl font-semibold">Your best season starts here</h2>
          <p className="mx-auto mt-4 max-w-xl text-leaf-100">
            CropPlot is launching soon on the App Store and Google Play. Want early access?
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/20">
              App Store · Coming soon
            </span>
            <span className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/20">
              ▶ Google Play · Coming soon
            </span>
          </div>
          <a
            href={`mailto:${site.email}?subject=CropPlot%20early%20access`}
            className="mt-8 inline-block rounded-full bg-sun-400 px-6 py-3 font-semibold text-soil-900 hover:bg-white"
          >
            Join the early access list
          </a>
        </div>
      </section>
    </>
  );
}
