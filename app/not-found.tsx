import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="text-6xl">🥀</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-leaf-900">Page not found</h1>
      <p className="mt-3 text-soil-900/70">This bed is empty. Let&apos;s get you back to the garden.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white">
        Go home
      </Link>
    </section>
  );
}
