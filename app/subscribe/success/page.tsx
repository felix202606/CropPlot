import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're subscribed",
  robots: { index: false, follow: false },
};

export default function SubscribeSuccess() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-5xl">🌱</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-leaf-900">Welcome to Pro</h1>
      <p className="mt-4 text-soil-900/75">
        Your subscription is confirmed. Sign in to the CropPlot app with the same email you used
        at checkout and Pro features will unlock.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white">
        Back home
      </Link>
    </section>
  );
}
