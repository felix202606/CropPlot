import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlant, plants, type Relation } from "@/lib/plants";

export const dynamicParams = false;

export function generateStaticParams() {
  return plants.map((p) => ({ plant: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/companion-planting/[plant]">): Promise<Metadata> {
  const { plant: slug } = await params;
  const plant = getPlant(slug);
  if (!plant) return {};
  const goodNames = plant.good.slice(0, 3).map((r) => getPlant(r.slug)?.name ?? r.slug);
  return {
    title: `${plant.name} Companion Plants: What to Plant With ${plant.name}`,
    description: `The best companion plants for ${plant.name.toLowerCase()} include ${goodNames.join(", ").toLowerCase()}. See what grows well with ${plant.name.toLowerCase()}, what to avoid, and why.`,
    alternates: { canonical: `/companion-planting/${plant.slug}/` },
  };
}

function RelationList({ items, tone }: { items: Relation[]; tone: "good" | "avoid" }) {
  if (items.length === 0) {
    return <p className="text-sm text-soil-900/60">No common bad neighbours.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((r) => {
        const other = getPlant(r.slug);
        return (
          <li
            key={r.slug}
            className={`rounded-2xl p-4 ring-1 ${
              tone === "good" ? "bg-leaf-50 ring-leaf-100" : "bg-red-50 ring-red-100"
            }`}
          >
            <Link
              href={`/companion-planting/${r.slug}/`}
              className="font-semibold hover:underline"
            >
              {other?.emoji} {other?.name ?? r.slug}
            </Link>
            <p className="mt-1 text-sm text-soil-900/75">{r.reason}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default async function PlantPage({ params }: PageProps<"/companion-planting/[plant]">) {
  const { plant: slug } = await params;
  const plant = getPlant(slug);
  if (!plant) notFound();

  const facts = [
    ["Sun", plant.sun],
    ["Water", plant.water],
    ["Spacing", plant.spacing],
    ["Harvest", plant.daysToHarvest],
  ];

  return (
    <article className="mx-auto max-w-4xl px-5 py-14">
      <nav className="text-sm text-soil-900/60">
        <Link href="/companion-planting/" className="hover:text-leaf-700">
          Companion Planting
        </Link>{" "}
        / {plant.name}
      </nav>
      <h1 className="mt-4 font-display text-4xl font-semibold text-leaf-900 md:text-5xl">
        {plant.emoji} {plant.name} companion plants
      </h1>
      <p className="mt-4 text-lg text-soil-900/75">{plant.intro}</p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        {facts.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white p-4 ring-1 ring-soil-100">
            <dt className="text-xs font-semibold uppercase tracking-wider text-soil-900/50">{k}</dt>
            <dd className="mt-1 text-sm">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-leaf-700">
            Good companions for {plant.name.toLowerCase()}
          </h2>
          <RelationList items={plant.good} tone="good" />
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-red-700">
            What not to plant with {plant.name.toLowerCase()}
          </h2>
          <RelationList items={plant.avoid} tone="avoid" />
        </section>
      </div>

      <aside className="mt-14 rounded-3xl bg-leaf-900 p-8 text-white">
        <h2 className="font-display text-2xl font-semibold">Plan your beds automatically</h2>
        <p className="mt-2 text-leaf-100">
          CropPlot Pro&apos;s companion grid engine places {plant.name.toLowerCase()} next to the
          right neighbours in your actual garden layout.
        </p>
        <Link
          href="/#download"
          className="mt-5 inline-block rounded-full bg-sun-400 px-5 py-2.5 font-semibold text-soil-900 hover:bg-white"
        >
          Get CropPlot
        </Link>
      </aside>
    </article>
  );
}
