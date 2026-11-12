import type { Metadata } from "next";
import Link from "next/link";
import { plants } from "@/lib/plants";

export const metadata: Metadata = {
  title: "Companion Planting Guide: What to Plant Together",
  description:
    "Free companion planting chart for home vegetable gardens. See which vegetables, herbs and flowers grow well together and which to keep apart.",
  alternates: { canonical: "/companion-planting/" },
};

export default function CompanionIndex() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-5xl font-semibold text-leaf-900">Companion Planting Guide</h1>
      <p className="mt-4 max-w-2xl text-lg text-soil-900/75">
        Some plants help each other by deterring pests, adding nitrogen or sharing space
        efficiently. Others compete or spread disease. Pick a plant to see its best and worst
        neighbours.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plants.map((p) => (
          <Link
            key={p.slug}
            href={`/companion-planting/${p.slug}/`}
            className="rounded-3xl bg-white p-6 ring-1 ring-soil-100 transition hover:-translate-y-0.5 hover:ring-leaf-500"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{p.emoji}</span>
              <div>
                <h2 className="text-lg font-semibold">{p.name} companions</h2>
                <p className="text-xs text-soil-900/60">{p.family}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-soil-900/70">
              <span className="font-semibold text-leaf-700">{p.good.length} good</span>
              {" · "}
              <span className="font-semibold text-red-700">{p.avoid.length} to avoid</span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
