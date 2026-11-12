import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscriptions coming soon",
  robots: { index: false, follow: false },
};

export default function SubscribeUnavailable() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-5xl">🛠️</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-leaf-900">Payments are being connected</h1>
      <p className="mt-4 text-soil-900/75">
        CropPlot Pro is $35.99 per year. Online checkout opens as soon as the Stripe account is
        connected. Email us and we&apos;ll let you know.
      </p>
      <a
        href={`mailto:${site.email}?subject=CropPlot%20Pro`}
        className="mt-8 inline-block rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white"
      >
        Email {site.email}
      </a>
      <p className="mt-6">
        <Link href="/pricing/" className="text-sm font-semibold text-leaf-700">
          Back to pricing
        </Link>
      </p>
    </section>
  );
}
